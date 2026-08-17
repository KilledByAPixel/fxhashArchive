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
