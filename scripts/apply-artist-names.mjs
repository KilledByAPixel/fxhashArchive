// Apply the accepted display-name changes in data/artist-names.json to the catalog.
//
// WHY THIS EXISTS
// ---------------
// An artist's name is stored everywhere the site prints it: their row in
// artists/index.json, `author` on each of their tokens, and their entry in any
// collaboration they were credited on. snapshot.mjs would normally rewrite all of
// that from the fxhash API, but the API answers HTTP 402 now, so a name can only be
// changed here — and it has to be changed in every copy at once, or the directory
// and the project pages will disagree about who made something.
//
// Idempotent by construction, so it is safe to re-run — and it must be re-run after
// snapshot-collaborators.mjs, which rebuilds collaborator names from users.json and
// would otherwise restore the on-chain name on those entries.
//
// public/data/users.json is deliberately untouched: it is a reading of the on-chain
// user registry, it says so in its own note, and nothing the site displays comes
// from it. The original name is also kept in data/artist-names.json under `was`.
//
// Usage:
//   node scripts/apply-artist-names.mjs [--out DIR] [--dry-run]

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renameById } from './artist-names-lib.mjs'

const args = process.argv.slice(2)
const outArg = args.indexOf('--out')
const OUT = outArg >= 0 ? args[outArg + 1] : 'public/data'
const DRY = args.includes('--dry-run')

const record = JSON.parse(await readFile('data/artist-names.json', 'utf8'))
const names = Object.fromEntries(Object.entries(record.names).map(([id, v]) => [id, v.name]))
const wanted = Object.entries(record.names)
if (wanted.length === 0) { console.log('no names to apply'); process.exit(0) }

for (const [id, v] of wanted) console.log(`${v.was ?? '(unnamed)'} -> ${v.name}   ${id}`)

const files = [
  ['artists', 'index.json'],
  ['collaborations.json'],
  ...(await readdir(join(OUT, 'tokens')))
    .filter((f) => /^index-\d{3}\.json$/.test(f)).sort().map((f) => ['tokens', f]),
]

let total = 0
let touched = 0
for (const parts of files) {
  const path = join(OUT, ...parts)
  const value = JSON.parse(await readFile(path, 'utf8'))
  const changed = renameById(value, names)
  if (!changed) continue
  total += changed
  touched += 1
  if (!DRY) await writeFile(path, JSON.stringify(value))
  console.log(`  ${parts.join('/')}: ${changed}`)
}

console.log(`\n${total} name${total === 1 ? '' : 's'} rewritten across ${touched} file${touched === 1 ? '' : 's'}`)
if (DRY) console.log('--dry-run: nothing written')
else if (total) console.log('run `npm run gallery` if any of these artists has work hung in it')
