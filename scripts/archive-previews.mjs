// Replace the square preview of every archived project with one in the work's
// own proportions.
//
// WHY THIS EXISTS
// ---------------
// fxhash stored a 300 x 300 thumbnail per project, and for 391 of the 420
// archived ones that is a centre crop: the work's real shape is gone from it.
// The gallery hangs those previews on its walls, so every painting there was
// square whether the piece was or not, and the live piece behind it had to be
// square to match. The catalog records no dimensions either.
//
// The full display image on IPFS has the real shape. This fetches it once for
// each archived project, fits it inside PREVIEW px on its long side, and saves
// it as WebP over the old thumbnail. The site's grid already letterboxes
// previews (`object-fit: contain`), so it gains the true shape too; the gallery
// build reads each preview's pixel size and hangs the painting to match.
//
// Nothing raw is kept — about 130 MB is fetched and ~6 MB stays. A project
// whose display image cannot be fetched keeps its square thumbnail, so the
// worst outcome for any piece is what it has today.
//
// Usage:
//   node scripts/archive-previews.mjs [--limit N] [--out DIR]
//
// Resumable: a project already saved by this script (recorded in
// public/data/thumbs/previews.json) is skipped.

import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { GATEWAYS } from './archive-lib.mjs'

const TOKENS_DIR = 'public/data/tokens'
const MANIFEST = 'public/data/generators/manifest.json'
/** Long side of a saved preview. Twice the old 300 px squares' width, and a 512 px
 * tile is the most the gallery's atlas can use; the grid shows previews at ~200 px. */
const PREVIEW = 512
const QUALITY = 82
const DELAY_MS = 80
const TIMEOUT_MS = 60000

function getArg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}
const OUT = getArg('out', 'public/data/thumbs')
const LIMIT = Number(getArg('limit', Infinity))
const LOG = join(OUT, 'previews.json')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function loadJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

/** ipfs://<cid>/<path> -> <cid>/<path>, or null for anything else. */
export const ipfsPath = (uri) => (typeof uri === 'string' && uri.startsWith('ipfs://') ? uri.slice('ipfs://'.length) : null)

async function fetchBytes(path) {
  let lastErr
  for (let attempt = 0; attempt < GATEWAYS.length * 2; attempt++) {
    const gateway = GATEWAYS[attempt % GATEWAYS.length]
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(gateway + path, { signal: ac.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim()
      // A gateway's error page is HTML; refuse anything that is not an image so a
      // challenge page never becomes somebody's preview.
      if (!type.startsWith('image/')) throw new Error(`unexpected content-type: ${type || '(none)'}`)
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

async function main() {
  await mkdir(OUT, { recursive: true })
  const manifest = await loadJson(MANIFEST, null)
  if (!manifest) throw new Error(`${MANIFEST} missing — run archive-generators.mjs first`)
  const archived = new Set(Object.keys(manifest).map(Number))

  const projects = []
  for (const f of (await readdir(TOKENS_DIR)).filter((f) => /^index-\d+\.json$/.test(f)).sort()) {
    for (const t of await loadJson(join(TOKENS_DIR, f), [])) if (archived.has(t.id)) projects.push(t)
  }

  // What is on disk now, by id, so the old square file goes when the new one lands.
  const existing = new Map()
  for (const f of await readdir(OUT).catch(() => [])) {
    const m = f.match(/^(\d+)\.(\w+)$/)
    if (m) existing.set(Number(m[1]), f)
  }
  const done = await loadJson(LOG, {})

  console.log(`archive-previews: ${projects.length} archived projects, ${Object.keys(done).length} already done (resume), out=${OUT}`)

  let saved = 0
  let failed = 0
  let bytes = 0
  const failures = []
  for (const p of projects) {
    if (saved >= LIMIT) break
    if (done[p.id]) continue
    const path = ipfsPath(p.displayUri ?? p.thumbnailUri)
    if (!path) { failed++; failures.push(`${p.id}: no ipfs display uri`); continue }
    try {
      const raw = await fetchBytes(path)
      const out = await sharp(raw)
        .rotate()
        .resize(PREVIEW, PREVIEW, { fit: 'inside', withoutEnlargement: true })
        // Alpha survives, as compress-thumbnails.mjs keeps it: some pieces are
        // drawn on transparency.
        .webp({ quality: QUALITY, effort: 5 })
        .toBuffer({ resolveWithObject: true })
      const file = `${p.id}.webp`
      await writeFile(join(OUT, file), out.data)
      const old = existing.get(p.id)
      if (old && old !== file) await unlink(join(OUT, old))
      done[p.id] = { w: out.info.width, h: out.info.height, bytes: out.data.length }
      await writeFile(LOG, JSON.stringify(done))
      saved++
      bytes += out.data.length
      console.log(`  ${p.id} ${p.name}: ${out.info.width}x${out.info.height} ${(out.data.length / 1024).toFixed(0)} KB`)
    } catch (err) {
      failed++
      failures.push(`${p.id} ${p.name}: ${err.message}`)
      console.log(`  ${p.id} ${p.name}: FAILED ${err.message}`)
    }
    await sleep(DELAY_MS)
  }

  console.log(`\nsaved ${saved} previews (${(bytes / 1048576).toFixed(1)} MiB), ${failed} failed`)
  if (failures.length) console.log('failures:\n  ' + failures.join('\n  '))
  console.log('next: npm run summary && npm run gallery')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
