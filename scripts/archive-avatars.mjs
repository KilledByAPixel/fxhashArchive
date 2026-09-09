// Store every artist's avatar in this repo, at the size the site actually draws it.
//
// WHY THIS EXISTS
// ---------------
// An avatar is the one picture of an artist this archive shows, and it lives only on
// IPFS. On 2026-09-08 fxhash's own gateway was switched off — the first piece of
// their infrastructure to actually go — and the pins are the next thing to lose. A
// stored copy is the difference between an artist page with a face on it and one with
// a grey box, forever.
//
// The originals are not what gets stored. They average 1.48 MiB, because people
// uploaded 4612x4612 PNGs as profile pictures, and all of them would run to 5.3 GB
// against a 1 GiB ceiling. The site draws them at 48px (.avatar) and 96px
// (.avatar-lg), so they are re-encoded to a 96px square in WebP on the way in:
// measured at 3 KiB each, about 10 MiB for every artist who has one. That is the
// whole feature — cheap enough to be obviously worth doing.
//
// Resumable: a file already on disk is never fetched again, so a run that dies
// halfway costs nothing. Failures are counted and skipped, never written as a
// zero-byte or error-page file, which would be an invisible hole in the archive.
//
// Three of 3,686 do not survive the encoder, and all three are the image rather than
// the fetch: one truncated PNG, one BMP and one ICO — formats a browser reads and
// sharp's prebuilt libvips does not. They keep working from a gateway for as long as
// there is one, and a decoder for two files is not worth a dependency.
//
// Usage:
//   node scripts/archive-avatars.mjs [--out DIR] [--size PX] [--limit N] [--commit]

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import { GATEWAYS } from './archive-lib.mjs'

const ARTISTS = 'public/data/artists/index.json'
const DELAY_MS = 60
const COMMIT_EVERY = 250
const TIMEOUT_MS = 45000

const getArg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', 'public/data/avatars')
const SIZE = Number(getArg('size', 96))
const LIMIT = Number(getArg('limit', Infinity))
const DO_COMMIT = hasFlag('commit')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** A Tezos address or contract, and therefore safe as a file name. */
const SAFE_ID = /^[A-Za-z0-9]+$/

async function fetchAvatar(path) {
  let lastErr
  for (let attempt = 0; attempt < GATEWAYS.length * 2; attempt++) {
    const gateway = GATEWAYS[attempt % GATEWAYS.length]
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(gateway + path, { signal: ac.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim()
      // A gateway's error page is served as text/plain or text/html, and one saved
      // under a .webp name would be a hole nobody would notice. Only images pass.
      if (!type.startsWith('image/')) throw new Error(`content-type ${type || '(none)'}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length === 0) throw new Error('empty body')
      return buffer
    } catch (err) {
      lastErr = err
      if (attempt < GATEWAYS.length * 2 - 1) await sleep(500 * (attempt + 1))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr ?? new Error('all gateways failed')
}

function commitProgress(label) {
  try {
    execFileSync('git', ['add', OUT], { stdio: 'ignore' })
    const staged = execFileSync('git', ['diff', '--cached', '--name-only']).toString().trim()
    if (!staged) return
    execFileSync('git', ['commit', '-m',
      `data: archive artist avatars (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`,
    ], { stdio: 'ignore' })
    console.log(`[git] ${label}: committed`)
  } catch (err) {
    console.error(`[git] ${label}: commit FAILED: ${err.message}`)
  }
}

const mib = (b) => `${(b / 1048576).toFixed(1)} MiB`

async function main() {
  await mkdir(OUT, { recursive: true })

  const artists = JSON.parse(await readFile(ARTISTS, 'utf8'))
  const wanted = artists.filter((a) => a.avatarUri?.startsWith('ipfs://') && SAFE_ID.test(a.id))
  const other = artists.filter((a) => a.avatarUri && !a.avatarUri.startsWith('ipfs://')).length

  const existing = new Set((await readdir(OUT).catch(() => [])).filter((f) => f.endsWith('.webp')))

  console.log(`archive-avatars: ${artists.length} artists, ${wanted.length} with an ipfs avatar, ` +
    `${existing.size} already saved (resume)`)
  if (other) console.log(`  ${other} avatars on some other scheme, skipped`)
  console.log(`  ${SIZE}px square, webp q82, out=${OUT}\n`)

  let saved = 0, skipped = 0, failed = 0, bytes = 0, done = 0
  for (const a of wanted) {
    if (saved >= LIMIT) break
    const file = `${a.id}.webp`
    if (existing.has(file)) { skipped++; continue }

    // Keep whatever follows the CID: a few avatars point into a directory.
    const path = a.avatarUri.slice('ipfs://'.length)
    try {
      const raw = await fetchAvatar(path)
      // `cover`, not `contain`: an avatar is drawn inside a circle, so the square is
      // filled and the edges are cropped anyway. Losing the corners of a portrait is
      // right where letterboxing a generative piece would be wrong.
      // `failOn: 'none'`: a couple of these avatars are truncated on IPFS — the bytes
      // that survive decode to a picture, and sharp's default is to refuse the whole
      // image over the missing tail. A slightly short avatar beats no avatar, and the
      // formats it genuinely cannot read still throw.
      const out = await sharp(raw, { failOn: 'none' })
        .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
        .webp({ quality: 82 })
        .toBuffer()
      await writeFile(join(OUT, file), out)
      saved++
      bytes += out.length
    } catch (err) {
      failed++
      console.error(`  ${(a.name ?? a.id).slice(0, 28)}: ${err.message}`)
    }
    done++
    if (done % 100 === 0) {
      console.log(`  ${done}/${wanted.length - skipped} · saved ${saved} · failed ${failed} · ${mib(bytes)}`)
    }
    if (DO_COMMIT && saved > 0 && saved % COMMIT_EVERY === 0) commitProgress(`${saved} saved`)
    await sleep(DELAY_MS)
  }

  console.log(`\nsaved ${saved}, already had ${skipped}, failed ${failed} — ${mib(bytes)} written`)
  if (saved) console.log(`  mean ${(bytes / saved / 1024).toFixed(1)} KiB each`)
  if (DO_COMMIT) commitProgress('final')
}

main().catch((err) => { console.error(err); process.exit(1) })
