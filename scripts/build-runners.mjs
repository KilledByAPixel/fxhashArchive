// Generate `_run.html` for archived generators that ship media.
//
// Those pieces cannot read their own images inside the viewer's sandbox — the
// iframe has an opaque origin, so the generator's own files count as cross-origin
// and any canvas they touch is tainted. See scripts/cors-shim.mjs for the full
// explanation; the short version is that the images need to ask for CORS, and the
// artist had no reason to write that.
//
// So the shim goes in a file we generate. The artist's index.html is never
// touched, and the viewer loads `_run.html` where one exists.
//
// Idempotent, and safe to re-run after archiving more projects: each runner is
// rebuilt from the current index.html, and runners that are no longer needed are
// removed.
//
// Usage:
//   node scripts/build-runners.mjs [--dry-run]

import { readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { buildRunner, needsRunner, RUNNER_ENTRY } from './runner-lib.mjs'

const OUT = 'public/data/generators'
const MANIFEST = join(OUT, 'manifest.json')
const DRY = process.argv.includes('--dry-run')

async function walk(dir, base = '', acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name
    if (e.isDirectory()) await walk(join(dir, e.name), rel, acc)
    else acc.push(rel)
  }
  return acc
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
let built = 0
let removed = 0
let skipped = 0
let bytes = 0

for (const [id, entry] of Object.entries(manifest)) {
  const dir = join(OUT, id)
  let files
  try {
    files = await walk(dir)
  } catch {
    console.log(`  miss  ${id}: no directory`)
    continue
  }

  const runnerPath = join(dir, RUNNER_ENTRY)
  if (!needsRunner(files.filter((f) => f !== RUNNER_ENTRY))) {
    // No media, so nothing can taint: the artist's own file runs, which is the
    // outcome to prefer wherever it is available.
    if (files.includes(RUNNER_ENTRY)) {
      if (!DRY) await unlink(runnerPath)
      delete entry.runner
      removed++
    } else {
      skipped++
    }
    continue
  }

  const source = join(dir, entry.entry)
  let html
  try {
    html = await readFile(source, 'utf8')
  } catch {
    console.log(`  fail  ${id}: cannot read ${entry.entry}`)
    continue
  }

  const runner = buildRunner(html)
  // What this actually costs on disk is the whole derived file, not just the
  // inserted shim — the site has a 1 GB ceiling, so report the real number.
  bytes += Buffer.byteLength(runner)
  if (!DRY) await writeFile(runnerPath, runner)
  entry.runner = RUNNER_ENTRY
  built++
}

if (!DRY) await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

console.log(
  `${DRY ? '[dry run] ' : ''}${built} runners built, ${removed} removed, ${skipped} not needed ` +
    `| ${(bytes / 1024).toFixed(0)} KB on disk`,
)
