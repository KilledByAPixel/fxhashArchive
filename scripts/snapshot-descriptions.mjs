// Capture every project's description from fxhash's API.
//
// The catalog snapshot kept names, tags and authorship but not the artist's own
// words about the work — 382 bytes on average, present for every one of the 27,430
// projects, and the only prose anyone wrote about most of this art. It exists in
// two places: fxhash's API, and the project metadata JSON on IPFS. The API is
// running today despite the site being switched off for non-payment, and the IPFS
// copy sits behind exactly the pins this archive exists to outlive.
//
// Two fields, both irreplaceable:
//   description          what the project is, shown on its page
//   childrenDescription  the text shown on each individual iteration
//
// Chunked by project id rather than by the slug-index used elsewhere, so a project
// page can compute its own file name and skip the extra lookup entirely.
//
// Usage:
//   node scripts/snapshot-descriptions.mjs [--out DIR] [--limit N]

import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const TAKE = 50 // API hard cap
const DELAY_MS = 100
/** Projects per file. ~125 files of ~170 KB, so a project page fetches one small file. */
const CHUNK = 250
const TOKENS_DIR = 'public/data/tokens'

const QUERY = `query ($skip: Int!, $take: Int!) {
  generativeTokens(skip: $skip, take: $take, sort: { mintOpensAt: "ASC" }) {
    id
    metadata
  }
}`

const args = process.argv.slice(2)
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : def
}
const OUT = join(getArg('out', 'public/data'), 'descriptions')
const LIMIT = Number(getArg('limit', 0)) || Infinity

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchPage(skip, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { skip, take: TAKE } }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300))
    return json.data.generativeTokens
  } catch (err) {
    if (attempt >= 4) throw err
    console.warn(`skip=${skip} attempt ${attempt} failed (${err.message}); retrying`)
    await sleep(1000 * 2 ** attempt)
    return fetchPage(skip, attempt + 1)
  }
}

/** How many projects the committed catalog holds, as the yardstick for completeness. */
async function catalogSize() {
  let n = 0
  for (const f of await readdir(TOKENS_DIR)) {
    if (!/^index-\d+\.json$/.test(f)) continue
    n += JSON.parse(await readFile(join(TOKENS_DIR, f), 'utf8')).length
  }
  return n
}

const clean = (v) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s || null
}

const seen = new Set()
const rows = []
for (let skip = 0; rows.length < LIMIT; skip += TAKE) {
  const page = await fetchPage(skip)
  for (const t of page) {
    if (seen.has(t.id)) continue
    seen.add(t.id)
    const md = t.metadata ?? {}
    const d = clean(md.description)
    const c = clean(md.childrenDescription)
    // A project with nothing written about it costs nothing to omit.
    if (d || c) rows.push({ id: t.id, d, c })
  }
  if (skip % 2500 === 0) console.log(`  ${seen.size} projects seen, ${rows.length} with text…`)
  if (page.length < TAKE) break
  await sleep(DELAY_MS)
}

// The paging loop stops on a short page, which is also what a mid-run API failure
// looks like. Refuse to write a truncated capture over a good one.
const expected = await catalogSize()
if (LIMIT === Infinity && seen.size < expected * 0.95) {
  throw new Error(
    `only ${seen.size} of ${expected} projects came back (<95%) — refusing to write a truncated capture`,
  )
}

const chunks = new Map()
for (const r of rows) {
  const key = Math.floor(r.id / CHUNK)
  if (!chunks.has(key)) chunks.set(key, {})
  // Short keys: this file is mostly text, and "description" repeated 27,430 times
  // is 300 KB of field names.
  //
  // 25,768 of 27,403 projects set the per-iteration text to exactly their
  // description — 9.7 MiB of the same strings stored twice. So `c` records only
  // what differs, and the reader falls back:
  //   c absent  -> the iteration text is the description
  //   c === ''  -> there genuinely is none
  //   otherwise -> its own text
  const row = { d: r.d }
  if (r.c === null) row.c = ''
  else if (r.c !== r.d) row.c = r.c
  chunks.get(key)[r.id] = row
}

await mkdir(OUT, { recursive: true })
let bytes = 0
for (const [key, body] of [...chunks].sort((a, b) => a[0] - b[0])) {
  const json = JSON.stringify(body)
  bytes += Buffer.byteLength(json)
  await writeFile(join(OUT, `${String(key).padStart(4, '0')}.json`), json + '\n')
}
await writeFile(
  join(OUT, 'meta.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      note: "Artist-written text for each project, from fxhash's API. Chunked by projectId / " + CHUNK + '.',
      chunk: CHUNK,
      projectsSeen: seen.size,
      withText: rows.length,
    },
    null,
    2,
  ) + '\n',
)

console.log(
  `\n${rows.length} of ${seen.size} projects have text | ${chunks.size} files | ${(bytes / 1048576).toFixed(1)} MB -> ${OUT}`,
)
