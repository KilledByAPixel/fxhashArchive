// Recover the human artists behind fxhash's collaboration contracts.
//
// 553 projects in the catalog list a KT1 contract as their author, with no name.
// fxhash's own site resolved those to the people who made the work; with the site
// gone, the projects show as an unnamed contract address, appear on nobody's artist
// page, and cannot be found by anyone looking for that artist's work. They are also
// invisible to preserve.json's `artists` rule, so collaborations were being skipped
// by the archiver for the artists it was told to keep.
//
// The good news: this one is genuinely on chain and cannot be lost. An fxhash
// collaboration contract stores its members and their revenue split in its own
// storage:
//
//   { "collaborators": ["tz1…", "tz1…"], "shares": { "tz1…": "90", … } }
//
// So this reads it from TzKT and writes public/data/collaborations.json. Captured
// now anyway, because "recoverable from an indexer" stops being true the day the
// indexer stops.
//
// Usage:
//   node scripts/snapshot-collaborators.mjs [--limit N] [--out FILE]

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const TZKT = 'https://api.tzkt.io/v1'
const TOKENS_DIR = 'public/data/tokens'
const ARTISTS_FILE = 'public/data/artists/index.json'
const USERS_FILE = 'public/data/users.json'
const OUT_FILE = 'public/data/collaborations.json'
const DELAY_MS = 60

/**
 * Contracts originated by this are fxhash collaborations. Checked per contract
 * rather than trusted from the address shape: a KT1 in the author field is only
 * *probably* a collaboration, and reading `collaborators` off some other contract's
 * storage would invent an attribution rather than recover one.
 */
const COLLAB_FACTORIES = new Set(['KT1JrUPSCt1r2MB2J7Lk2KwiWSYr3Mr414ck'])

const getArg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : def
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJson(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === attempts - 1) throw err
      await sleep(500 * (i + 1))
    }
  }
}

/** Every distinct KT1 author in the catalog, with the projects that use it. */
async function collectCollabAuthors() {
  const byAddress = new Map()
  for (const f of (await readdir(TOKENS_DIR)).sort()) {
    if (!/^index-\d+\.json$/.test(f)) continue
    const rows = JSON.parse(await readFile(join(TOKENS_DIR, f), 'utf8'))
    for (const t of rows) {
      const id = t.author?.id
      if (!id || !id.startsWith('KT1')) continue
      if (!byAddress.has(id)) byAddress.set(id, [])
      byAddress.get(id).push(t.id)
    }
  }
  return byAddress
}

/**
 * Two name sources, in order. The artists index only knows people who minted a
 * project of their own, which leaves most collaborators nameless — a third of a
 * collaboration's members never released anything solo. The on-chain user registry
 * (see scripts/snapshot-users.mjs) knows nearly all of them, and takes over here:
 * it lifts the named share of collaborator slots from 571/1018 to 967/1018.
 */
const artists = new Map(
  JSON.parse(await readFile(ARTISTS_FILE, 'utf8')).map((a) => [a.id, a.name ?? null]),
)
let registry = {}
try {
  registry = JSON.parse(await readFile(USERS_FILE, 'utf8')).names ?? {}
  console.log(`${Object.keys(registry).length} names available from the on-chain user registry`)
} catch {
  console.log(`no ${USERS_FILE} — run scripts/snapshot-users.mjs first for many more names`)
}
const nameOf = (id) => artists.get(id) || registry[id] || null

const authors = await collectCollabAuthors()
const limit = Number(getArg('limit', 0)) || authors.size
const outFile = getArg('out', OUT_FILE)
const entries = [...authors.entries()].slice(0, limit)

console.log(`${authors.size} collaboration-authored contracts across the catalog; resolving ${entries.length}`)

const out = {}
let resolved = 0
let notCollab = 0
let failed = 0
const unknownNames = new Set()

for (const [address, projects] of entries) {
  try {
    const [meta, storage] = await Promise.all([
      getJson(`${TZKT}/contracts/${address}`),
      getJson(`${TZKT}/contracts/${address}/storage`),
    ])
    const factory = meta?.creator?.address ?? null
    if (!factory || !COLLAB_FACTORIES.has(factory)) {
      // Not an fxhash collaboration — record the fact rather than guessing at it.
      notCollab++
      console.log(`  skip ${address}: originated by ${factory ?? 'unknown'}, not a known collab factory`)
      continue
    }
    const members = Array.isArray(storage?.collaborators) ? storage.collaborators : []
    if (!members.length) {
      failed++
      console.log(`  warn ${address}: collab contract with no collaborators in storage`)
      continue
    }
    const shares = storage?.shares ?? {}
    out[address] = {
      projects: projects.sort((a, b) => a - b),
      // Biggest share first: on a two-person piece where one holds 90%, that is the
      // lead artist, and listing them first is the closest thing to what fxhash showed.
      collaborators: members
        .map((id) => ({ id, name: nameOf(id), share: Number(shares[id] ?? 0) || null }))
        .sort((a, b) => (b.share ?? 0) - (a.share ?? 0)),
    }
    for (const c of out[address].collaborators) if (!c.name) unknownNames.add(c.id)
    resolved++
    if (resolved % 50 === 0) console.log(`  ${resolved}/${entries.length}…`)
  } catch (err) {
    failed++
    console.log(`  fail ${address}: ${err.message ?? err}`)
  }
  await sleep(DELAY_MS)
}

const projectCount = Object.values(out).reduce((n, c) => n + c.projects.length, 0)

// Two indexes over the same facts, because the site asks two different questions:
// a project page has a project id and needs its artists; an artist page has an
// address and needs the collaborations it should be listing. Deriving one from the
// other in the browser would mean scanning the whole file to answer one lookup.
const byProject = {}
const byArtist = {}
for (const [contract, entry] of Object.entries(out)) {
  for (const id of entry.projects) {
    byProject[id] = { contract, collaborators: entry.collaborators }
    for (const c of entry.collaborators) (byArtist[c.id] ??= []).push(id)
  }
}
for (const list of Object.values(byArtist)) list.sort((a, b) => a - b)

await writeFile(
  outFile,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      note:
        'fxhash collaboration contracts and the artists behind them, read from each ' +
        "contract's on-chain storage via TzKT. A project whose catalog author is a KT1 " +
        'address was made by these people; fxhash showed their names, and this is where ' +
        'that attribution comes from now.',
      counts: { contracts: resolved, projects: projectCount, artists: Object.keys(byArtist).length },
      byProject,
      byArtist,
    },
    null,
    2,
  ) + '\n',
)

console.log(`\nresolved ${resolved} contracts covering ${projectCount} projects -> ${outFile}`)
if (notCollab) console.log(`${notCollab} KT1 authors were not fxhash collaboration contracts`)
if (failed) console.log(`${failed} failed`)
if (unknownNames.size) {
  console.log(`${unknownNames.size} collaborator addresses have no name anywhere on chain — only the address survives`)
}
