// Generate `_run.html` for every archived generator.
//
// A generator running in the viewer's sandbox has an opaque origin, and four
// things stop working because of it: its own images taint any canvas they touch,
// `localStorage` / `sessionStorage` / `indexedDB` / `document.cookie` throw on
// being *read*, and `new Worker()` is refused. See scripts/sandbox-shim.mjs.
//
// So the shim goes in a file we generate. The artist's index.html is never
// touched, and the viewer loads `_run.html` where one exists.
//
// ## Why every project, and not only the ones that need it
//
// This used to build a runner only for projects shipping media, on the reasoning
// that a file list is a fact while scanning minified code for an API call is a
// guess. Widening the shim did not change that reasoning, it changed the numbers:
// 272 of 420 projects touch at least one of these APIs, and the three largest
// entry files in the archive are among them. Selecting by scan would have saved
// about 1 MB out of 15 and bought a standing risk that some project is quietly
// broken because a minifier spelled something unexpectedly.
//
// The cost is real and worth naming: ~12 MiB of duplicated entry HTML plus ~8 KB
// of shim per project, against a 1 GB ceiling this archive is already shaped by.
// Every run prints it.
//
// Idempotent, and safe to re-run after archiving more projects: each runner is
// rebuilt from the current index.html.
//
// Usage:
//   node scripts/build-runners.mjs [--dry-run]

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildRunner, RUNNER_ENTRY } from './runner-lib.mjs'

const OUT = 'public/data/generators'
const MANIFEST = join(OUT, 'manifest.json')
const DRY = process.argv.includes('--dry-run')

// The self-check frame is built here, through the same function, so that what
// public/sandbox-check.html exercises in a real browser is the shipped shim in the
// shipped wrapper rather than a copy that quietly drifts out of date.
const CHECK_SRC = 'scripts/sandbox-check.src.html'
const CHECK_OUT = 'public/sandbox-check-frame.html'

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
let built = 0
let failed = 0
let bytes = 0
let shimBytes = 0

for (const [id, entry] of Object.entries(manifest)) {
  const source = join(OUT, id, entry.entry)
  let html
  try {
    html = await readFile(source, 'utf8')
  } catch {
    // No entry file to derive from — leave the manifest pointing at the artist's
    // own, which is what the viewer falls back to.
    console.log(`  fail  ${id}: cannot read ${entry.entry}`)
    delete entry.runner
    failed++
    continue
  }

  const runner = buildRunner(html)
  // What this actually costs on disk is the whole derived file, not just the
  // inserted shim — the site has a 1 GB ceiling, so report the real number.
  bytes += Buffer.byteLength(runner)
  shimBytes += Buffer.byteLength(runner) - Buffer.byteLength(html)
  if (!DRY) await writeFile(join(OUT, id, RUNNER_ENTRY), runner)
  entry.runner = RUNNER_ENTRY
  built++
}

if (!DRY) await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
if (!DRY) await writeFile(CHECK_OUT, buildRunner(await readFile(CHECK_SRC, 'utf8')))

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `${DRY ? '[dry run] ' : ''}${built} runners built${failed ? `, ${failed} failed` : ''} ` +
    `| ${mb(bytes)} MiB on disk, of which ${mb(shimBytes)} MiB is shim`,
)
