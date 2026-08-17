import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta,
  isTruncatedSnapshot, MIN_RETAINED_RATIO,
} from './snapshot-lib.mjs'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const TAKE = 50 // API hard cap
const DELAY_MS = 100

const QUERY = `query ($skip: Int!, $take: Int!) {
  generativeTokens(skip: $skip, take: $take, sort: { mintOpensAt: "ASC" }) {
    id slug name flag supply iterationsCount createdAt mintOpensAt
    thumbnailUri displayUri generativeUri tags
    author { id name avatarUri description }
  }
}`

const args = process.argv.slice(2)
const limitArg = args.indexOf('--limit')
const LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity
const outArg = args.indexOf('--out')
const OUT = outArg >= 0 ? args[outArg + 1] : 'public/data'

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

const seen = new Set()
const rawTokens = []
for (let skip = 0; rawTokens.length < LIMIT; skip += TAKE) {
  const page = await fetchPage(skip)
  for (const t of page) if (!seen.has(t.id)) { seen.add(t.id); rawTokens.push(t) }
  if (skip % 2000 === 0) console.log(`fetched ${rawTokens.length}...`)
  if (page.length < TAKE) break
  await sleep(DELAY_MS)
}

const tokens = rawTokens.slice(0, LIMIT).map(leanToken)

// Refuse to overwrite a good catalog with a degraded one. The paging loop stops on a
// short page, which is exactly what a mid-run API failure looks like, so without this
// the workflow would happily commit a truncated snapshot over the good one and exit 0.
// A first run (no meta.json yet) is unaffected; partial `--limit` runs should be aimed
// at a scratch `--out` directory rather than at a real snapshot.
const prevMeta = await readFile(join(OUT, 'meta.json'), 'utf8').then(JSON.parse).catch(() => null)
if (isTruncatedSnapshot(tokens.length, prevMeta)) {
  console.error(
    `\nREFUSING TO WRITE: got ${tokens.length} tokens, but ${OUT}/meta.json has ` +
    `${prevMeta.tokenCount} — below the ${Math.round(MIN_RETAINED_RATIO * 100)}% floor.\n` +
    'A short page from a degraded API is indistinguishable from the end of the catalog, ' +
    'so this is treated as an incident: nothing was written and the existing snapshot ' +
    'stands. Re-run once the API is healthy, or use --out to write elsewhere.',
  )
  process.exit(1)
}

const shards = shardTokens(tokens)
const writeJson = (p, v) => writeFile(join(OUT, p), JSON.stringify(v))

await mkdir(join(OUT, 'tokens'), { recursive: true })
await mkdir(join(OUT, 'artists'), { recursive: true })
await Promise.all(shards.map((s, i) => writeJson(`tokens/index-${String(i).padStart(3, '0')}.json`, s)))
await writeJson('tokens/slug-index.json', buildSlugIndex(shards))
await writeJson('artists/index.json', buildArtists(rawTokens.slice(0, LIMIT)))
await writeJson('artists/tokens-map.json', buildTokensMap(tokens))
await writeJson('meta.json', buildMeta(tokens, shards.length, new Date().toISOString()))
console.log(`DONE: ${tokens.length} tokens, ${shards.length} shards -> ${OUT}`)
