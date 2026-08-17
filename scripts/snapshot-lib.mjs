export const SHARD_SIZE = 1000

export function leanToken(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    flag: raw.flag ?? 'NONE',
    supply: raw.supply ?? 0,
    iterationsCount: raw.iterationsCount ?? 0,
    createdAt: raw.createdAt ?? null,
    mintOpensAt: raw.mintOpensAt ?? null,
    thumbnailUri: raw.thumbnailUri ?? null,
    displayUri: raw.displayUri ?? null,
    generativeUri: raw.generativeUri ?? null,
    tags: raw.tags ?? [],
    author: raw.author
      ? { id: raw.author.id, name: raw.author.name ?? null, avatarUri: raw.author.avatarUri ?? null }
      : null,
  }
}

export function shardTokens(tokens, size = SHARD_SIZE) {
  const shards = []
  for (let i = 0; i < tokens.length; i += size) shards.push(tokens.slice(i, i + size))
  return shards
}

export function buildSlugIndex(shards) {
  const index = {}
  shards.forEach((shard, i) => shard.forEach((t) => { index[t.slug] = i }))
  return index
}

export function buildArtists(rawTokens) {
  const byId = new Map()
  for (const t of rawTokens) {
    const a = t.author
    if (!a) continue
    const cur = byId.get(a.id) ?? {
      id: a.id, name: a.name ?? null, avatarUri: a.avatarUri ?? null,
      description: a.description ?? null, tokenCount: 0,
    }
    cur.tokenCount += 1
    byId.set(a.id, cur)
  }
  return [...byId.values()].sort((x, y) => y.tokenCount - x.tokenCount)
}

export function buildTokensMap(tokens) {
  const map = {}
  for (const t of tokens) {
    if (!t.author) continue
    ;(map[t.author.id] ??= []).push(t.id)
  }
  return map
}

export function buildMeta(tokens, shardCount, generatedAt) {
  return { generatedAt, tokenCount: tokens.length, shardCount, shardSize: SHARD_SIZE }
}

/** How much of the previous catalog a refresh must still contain to be trusted. */
export const MIN_RETAINED_RATIO = 0.95

/**
 * Does this run look like a degraded API rather than a real catalog?
 *
 * The fetch loop stops when a page comes back short, which is indistinguishable from
 * the API hiccuping mid-run — and the result would be committed over a good snapshot,
 * exit 0, deleting projects from the live site with no signal. Losing more than 5% of
 * the catalog in a week is not something the real fxhash archive does; it is an
 * incident, and the caller should fail loudly instead of writing.
 *
 * A first run (no previous meta.json, or one without a usable count) is not truncated.
 */
export function isTruncatedSnapshot(tokenCount, prevMeta) {
  const prev = prevMeta?.tokenCount
  if (typeof prev !== 'number' || !Number.isFinite(prev) || prev <= 0) return false
  return tokenCount < prev * MIN_RETAINED_RATIO
}
