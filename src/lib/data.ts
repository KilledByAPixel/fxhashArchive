import type { LeanToken, Artist, SnapshotMeta } from './types'

const BASE = `${import.meta.env.BASE_URL}data/`
const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

export const isVisible = (t: LeanToken) => !HIDDEN_FLAGS.has(t.flag)

let cache = new Map<string, Promise<unknown>>()

/** Test hook — clears memoized fetches. */
export const _resetCache = () => { cache = new Map() }

function getJson<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    cache.set(path, fetch(BASE + path).then((res) => {
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
      return res.json()
    }))
  }
  return cache.get(path) as Promise<T>
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

export async function findTokenBySlug(slug: string): Promise<LeanToken | null> {
  const index = await getJson<Record<string, number>>('tokens/slug-index.json')
  const shardIdx = index[slug]
  if (shardIdx === undefined) return null
  const shard = await loadShard(shardIdx)
  return shard.find((t) => t.slug === slug) ?? null
}
