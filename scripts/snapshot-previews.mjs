// Capture, for every project, what fxhash ran its preview with.
//
// A project's thumbnail is one particular iteration: the artist picked a hash at
// mint, the platform rendered it, and that image became the face of the work
// everywhere — but the hash is not any minted token's, so the seeds captured per
// iteration (scripts/snapshot-seeds.mjs) never include it. It lives in the project
// metadata JSON, which the API still serves: `previewHash`, and the project's
// artifactUri carrying the whole query — `?fxhash=…&fxiteration=…&fxminter=…` and,
// for fx(params) work, the chosen parameters as a `#0x…` fragment. The gallery
// opens a painting on exactly this query, so the running piece matches the wall.
//
// The first metadata format (2021) recorded no preview hash; those projects are
// simply absent here and open on their first edition.
//
// One field per project, chunked by project id like the descriptions, so a page can
// compute its file name. ~110 bytes each.
//
// Usage:
//   node scripts/snapshot-previews.mjs [--out DIR] [--limit N]

import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { previewQueryOf } from './snapshot-lib.mjs'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const TAKE = 50 // API hard cap
const DELAY_MS = 100
/** Projects per file. Must match PREVIEW_CHUNK in src/lib/data.ts if the site ever reads these directly. */
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
const OUT = join(getArg('out', 'public/data'), 'previews')
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

const seen = new Set()
const rows = []
for (let skip = 0; seen.size < LIMIT; skip += TAKE) {
  const page = await fetchPage(skip)
  for (const t of page) {
    if (seen.has(t.id)) continue
    seen.add(t.id)
    const q = previewQueryOf(t.metadata)
    if (q) rows.push({ id: t.id, q })
  }
  if (skip % 2500 === 0) console.log(`  ${seen.size} projects seen, ${rows.length} with a preview query…`)
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
  chunks.get(key)[r.id] = r.q
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
      note: "The query fxhash ran each project's preview with, from its metadata on fxhash's API. Chunked by projectId / " + CHUNK + '.',
      chunk: CHUNK,
      projectsSeen: seen.size,
      withPreview: rows.length,
    },
    null,
    2,
  ) + '\n',
)

console.log(
  `\n${rows.length} of ${seen.size} projects have a preview query | ${chunks.size} files | ${(bytes / 1048576).toFixed(1)} MB -> ${OUT}`,
)
