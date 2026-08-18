import type { LeanToken, Artist, SnapshotMeta } from './types'

const BASE = `${import.meta.env.BASE_URL}data/`
const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

export const isVisible = (t: LeanToken) => !HIDDEN_FLAGS.has(t.flag)

let cache = new Map<string, Promise<unknown>>()

/** Test hook — clears memoized fetches. */
export const _resetCache = () => { cache = new Map() }

function getJson<T>(path: string): Promise<T> {
  const hit = cache.get(path)
  if (hit) return hit as Promise<T>

  let entry: Promise<unknown> | undefined
  entry = fetch(BASE + path)
    .then((res) => {
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
      return res.json()
    })
    .catch((err) => {
      // Evict failures. Memoizing a rejection means one transient error fetching, say,
      // tokens/slug-index.json makes every project deep link on the site answer
      // "not found" for the rest of the session, with no retry short of a reload.
      // Successes stay cached; only the failed attempt is forgotten.
      if (cache.get(path) === entry) cache.delete(path)
      throw err
    })

  cache.set(path, entry)
  return entry as Promise<T>
}

export const loadMeta = () => getJson<SnapshotMeta>('meta.json')
export const loadShard = (i: number) =>
  getJson<LeanToken[]>(`tokens/index-${String(i).padStart(3, '0')}.json`)
export const loadArtists = () => getJson<Artist[]>('artists/index.json')
export const loadTokensMap = () => getJson<Record<string, number[]>>('artists/tokens-map.json')

export async function loadAllTokens(): Promise<LeanToken[]> {
  const meta = await loadMeta()
  const shards = await Promise.all(Array.from({ length: meta.shardCount }, (_, i) => loadShard(i)))
  return shards.flat()
}

/** Which `tokens/index-NNN.json` shard holds this project, or undefined if unknown. */
async function shardIndexForSlug(slug: string): Promise<number | undefined> {
  const index = await getJson<Record<string, number>>('tokens/slug-index.json')
  return index[slug]
}

/**
 * Look a project up by slug — the single entry point every deep link goes through.
 *
 * Moderation is enforced *here*, not only where grids are built: a flagged project
 * (fxhash's own plagiarism/abuse flags) must be as unreachable from `#/token/<slug>`
 * as it is from the browse grid, or the promise made to users is a lie and the site
 * offers a "Run live" button on abusive code. A flagged slug resolves to not-found.
 */
export async function findTokenBySlug(slug: string): Promise<LeanToken | null> {
  const shardIdx = await shardIndexForSlug(slug)
  if (shardIdx === undefined) return null
  const shard = await loadShard(shardIdx)
  const token = shard.find((t) => t.slug === slug)
  return token && isVisible(token) ? token : null
}

/**
 * Project -> minted iteration ids, sharded to mirror `tokens/index-NNN.json`.
 * Captured from fxhash's own API, so it covers the launch-era tokens that carry
 * no `metadata.generatorUri` on chain and are therefore invisible to the TzKT join.
 */
export const loadIterationMap = (i: number) =>
  getJson<Record<string, string[]>>(`iterations/map-${String(i).padStart(3, '0')}.json`)

/**
 * The authoritative iteration ids for a project, as `FX{version}-{tokenId}`.
 *
 * Three outcomes, deliberately distinct — conflating any two of them recreates the
 * bug this exists to fix (claiming art was never minted when we simply cannot tell):
 *   - `string[]` (possibly empty) — we know; empty means genuinely never minted.
 *   - `null`                      — we do not know (no such project in the index).
 *   - rejection                   — we could not load the mapping at all.
 */
export async function loadIterationIds(slug: string, projectId: number): Promise<string[] | null> {
  const shardIdx = await shardIndexForSlug(slug)
  if (shardIdx === undefined) return null
  const map = await loadIterationMap(shardIdx)
  return map[String(projectId)] ?? null
}

/** `iterations/contracts.json`: the contract list, plus one index per project. */
interface IterationContracts {
  contracts: string[]
  byProject: Record<string, number>
}

/**
 * Which gentk contract each project's iterations live on, captured alongside the id
 * mapping. One small file for the whole catalog, so it is fetched once and memoized.
 */
export const loadIterationContracts = () => getJson<IterationContracts>('iterations/contracts.json')

/**
 * The gentk contract holding a project's iterations, or null when unknown.
 *
 * This cannot be inferred from anything else we hold. The `FX{n}` prefix of an
 * iteration id is the *issuer* version, not the contract; token id ranges overlap
 * across contracts; and all three contracts contain tokens without a `generatorUri`.
 * So the only honest answers are "this address" or null — callers must fall back
 * rather than guess, because a wrong contract renders another project's artwork.
 *
 * A project with no entry is one with no iterations at all; an out-of-range index
 * means the file is corrupt, which is likewise "we do not know", not `undefined`
 * smuggled into a TzKT URL.
 */
export async function loadIterationContract(projectId: number): Promise<string | null> {
  const { contracts, byProject } = await loadIterationContracts()
  const index = byProject[String(projectId)]
  if (index === undefined) return null
  return contracts[index] ?? null
}
