import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta } from './snapshot-lib.mjs'

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
