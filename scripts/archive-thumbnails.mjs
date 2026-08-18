// Save the preview image of every fully-archived project into this repository.
//
// WHY THIS EXISTS
// ---------------
// A project whose generator and seeds are archived here can already be re-run
// with no network. Its *preview image* still came from IPFS, so browsing the
// archive offline showed a wall of empty tiles — the art was recoverable but
// invisible until you opened and ran each piece.
//
// These are the previews fxhash itself stored, at the size it stored them
// (~125 KB, mostly PNG). Downscaling would cut the total to a fifth, but it
// would need an image library and would throw away detail the artists chose.
// Storing them as they are also makes archived projects load from this origin
// rather than a gateway, which is faster online as well as possible offline.
//
// Only archived projects are covered: 396 of them, about 48 MB. Doing this for
// the whole catalog would be roughly 3.4 GB and would not survive the GitHub
// Pages limit.
//
// Usage:
//   node scripts/archive-thumbnails.mjs [--out DIR] [--limit N] [--commit]
//
// Resumable: a project whose thumbnail is already on disk is skipped.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const GATEWAYS = ['https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/', 'https://gateway.pinata.cloud/ipfs/']
const TOKENS_DIR = 'public/data/tokens'
const MANIFEST = 'public/data/generators/manifest.json'
const DELAY_MS = 80
const COMMIT_EVERY = 100
const TIMEOUT_MS = 60000

/** Content types we will store, and the extension each gets. */
const EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const hasFlag = (name) => process.argv.includes(`--${name}`)

const OUT = getArg('out', 'public/data/thumbs')
const LIMIT = Number(getArg('limit', Infinity))
const DO_COMMIT = hasFlag('commit')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function loadJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

async function fetchImage(cid) {
  let lastErr
  for (let attempt = 0; attempt < GATEWAYS.length * 2; attempt++) {
    const gateway = GATEWAYS[attempt % GATEWAYS.length]
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(gateway + cid, { signal: ac.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim()
      const ext = EXT[type]
      // Refuse anything that is not an image we recognise: a gateway error page
      // saved as a .png would be an invisible hole in the archive.
      if (!ext) throw new Error(`unexpected content-type: ${type || '(none)'}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length === 0) throw new Error('empty body')
      return { buffer, ext }
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
    execFileSync('git', ['commit', '-m', `data: archive project thumbnails (${label})\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`], { stdio: 'ignore' })
    console.log(`[git] ${label}: committed`)
  } catch (err) {
    console.error(`[git] ${label}: commit FAILED: ${err.message}`)
  }
}

const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`

async function main() {
  await mkdir(OUT, { recursive: true })

  const manifest = await loadJson(MANIFEST, null)
  if (!manifest) throw new Error(`${MANIFEST} missing — run archive-generators.mjs first`)
  const archived = new Set(Object.keys(manifest).map(Number))

  const projects = []
  for (const f of (await readdir(TOKENS_DIR)).filter((f) => /^index-\d+\.json$/.test(f)).sort()) {
    for (const t of await loadJson(join(TOKENS_DIR, f), [])) {
      if (archived.has(t.id)) projects.push(t)
    }
  }

  const existing = new Map()
  for (const f of await readdir(OUT).catch(() => [])) {
    const m = f.match(/^(\d+)\.(\w+)$/)
    if (m) existing.set(Number(m[1]), f)
  }

  console.log(
    `archive-thumbnails: ${projects.length} archived projects, ` +
      `${existing.size} already saved (resume), out=${OUT}`,
  )

  let saved = 0
  let skipped = 0
  let failed = 0
  let bytes = 0
  let sinceCommit = 0
  const failures = []

  for (const p of projects) {
    if (saved >= LIMIT) break
    if (existing.has(p.id)) {
      skipped++
      continue
    }
    const uri = p.thumbnailUri ?? p.displayUri
    if (!uri || !uri.startsWith('ipfs://')) {
      failed++
      failures.push(`${p.id} ${p.name}: no ipfs thumbnail`)
      continue
    }
    try {
      const { buffer, ext } = await fetchImage(uri.slice(7))
      await writeFile(join(OUT, `${p.id}.${ext}`), buffer)
      saved++
      sinceCommit++
      bytes += buffer.length
      if (saved % 25 === 0) {
        console.log(`[progress] ${saved} saved (${failed} failed) | ${mb(bytes)} this run`)
      }
    } catch (err) {
      failed++
      failures.push(`${p.id} ${p.name}: ${err.message}`)
      console.error(`FAILED ${p.id} ${String(p.name).slice(0, 32)}: ${err.message}`)
    }
    if (DO_COMMIT && sinceCommit >= COMMIT_EVERY) {
      commitProgress(`${saved} thumbnails`)
      sinceCommit = 0
    }
    await sleep(DELAY_MS)
  }

  console.log(`\n[FINAL] ${saved} saved, ${skipped} already present, ${failed} failed | ${mb(bytes)} this run`)
  if (failures.length) {
    console.log('failures:')
    for (const f of failures.slice(0, 40)) console.log(`  ${f}`)
  }
  if (DO_COMMIT && sinceCommit > 0) commitProgress(`final ${saved} thumbnails`)
  if (failed > 0) process.exitCode = 1
}

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION (continuing):', err)
})

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
