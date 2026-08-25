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

/**
 * Kept in step with HIDDEN_FLAGS in src/lib/data.ts, and with the copies in
 * build-summary.mjs, gallery-lib.mjs and archive-generators.mjs. snapshot-lib.test.mjs
 * checks this one against gallery-lib's, so at least one pair cannot drift in silence.
 */
export const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

/**
 * Restate each artist's project count as the number their own page shows, and drop
 * the rows that name nobody.
 *
 * The directory used to count a project only under `token.author.id`, over every
 * token including the moderated ones. Neither half of that matched the artist page,
 * which shows their own projects *and* their collaborations, moderated work excluded
 * — so the two disagreed for 1,574 artists, in both directions. Measured against the
 * real catalog: 339 undercounted because collaborations are authored by a KT1
 * contract rather than by a person, and 1,235 overcounted because nothing filtered
 * flagged work. 860 of those had nothing visible at all, one of them promising 48
 * projects and opening on a page that showed none.
 *
 * Two kinds of row are dropped. A contract is not an artist: the 427 collaboration
 * contracts were listed with a null name and a bare KT1 address, holding a count that
 * belongs to the people, who are credited by name on every byline. And an artist
 * whose work is entirely moderated has a page reading "No visible projects from this
 * artist", so a row pointing at it promises work that cannot be shown.
 *
 * This does not *add* anyone. Someone who only ever collaborated has no row here and
 * gains none — their page is built from the collaboration record when it is asked for.
 *
 * @param artists      rows carrying identity: id, name, avatarUri, description
 * @param tokens       the catalog, lean or raw; needs id, flag and author
 * @param collaborations  collaborations.json — its byArtist credits and byProject contracts
 */
export function reviseArtists(artists, tokens, collaborations = {}) {
  const { byArtist = {}, byProject = {} } = collaborations
  const contracts = new Set(Object.values(byProject).map((c) => c.contract))

  // Sets, not counters: an artist listed as a collaborator on a project they also
  // authored must not be credited with it twice.
  const credited = new Map()
  const credit = (id, project) => {
    if (!id) return
    const seen = credited.get(id) ?? new Set()
    seen.add(project)
    credited.set(id, seen)
  }

  const visible = new Set()
  for (const t of tokens) {
    if (HIDDEN_FLAGS.has(t.flag)) continue
    visible.add(t.id)
    credit(t.author?.id, t.id)
  }
  // A collaboration credit is only worth a count if the project itself can be seen.
  for (const [id, projects] of Object.entries(byArtist)) {
    for (const p of projects) if (visible.has(p)) credit(id, p)
  }

  return artists
    .filter((a) => !contracts.has(a.id))
    .map((a) => ({ ...a, tokenCount: credited.get(a.id)?.size ?? 0 }))
    .filter((a) => a.tokenCount > 0)
    .sort((x, y) => y.tokenCount - x.tokenCount)
}

export function buildArtists(rawTokens, collaborations = {}) {
  const byId = new Map()
  for (const t of rawTokens) {
    const a = t.author
    if (!a || byId.has(a.id)) continue
    byId.set(a.id, {
      id: a.id, name: a.name ?? null, avatarUri: a.avatarUri ?? null,
      description: a.description ?? null, tokenCount: 0,
    })
  }
  return reviseArtists([...byId.values()], rawTokens, collaborations)
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

/**
 * What fxhash ran a project's preview with, as the query the archived generator takes.
 *
 * The thumbnail of every project is one iteration the artist chose at mint, from a
 * hash that is not any minted token's. Metadata from 0.2 on records it as
 * `previewHash`, and the project's own `artifactUri` carries the whole query fxhash
 * used — `?fxhash=…&fxiteration=…&fxminter=…` and, for fx(params) work, the chosen
 * parameters in a `#0x…` fragment. That query is kept whole, as scripts/snapshot-seeds.mjs
 * keeps it for iterations; the hash alone when the URI has no query; and nothing for
 * the first metadata format, which never recorded which hash the preview came from.
 */
export function previewQueryOf(metadata) {
  const md = metadata ?? {}
  const uri = typeof md.artifactUri === 'string' ? md.artifactUri : ''
  const mark = uri.indexOf('?')
  if (mark >= 0 && uri.slice(mark).includes('fxhash=')) return uri.slice(mark)
  const hash = typeof md.previewHash === 'string' && md.previewHash.trim()
  return hash ? `?fxhash=${hash}` : null
}
