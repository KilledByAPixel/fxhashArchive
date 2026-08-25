import { test, expect } from 'vitest'
import {
  leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta,
  isTruncatedSnapshot, MIN_RETAINED_RATIO, reviseArtists, HIDDEN_FLAGS,
} from './snapshot-lib.mjs'
import { HIDDEN_FLAGS as GALLERY_HIDDEN_FLAGS } from './gallery-lib.mjs'

const raw = (id, over = {}) => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN',
  supply: 10, iterationsCount: 5, createdAt: '2022-01-01T00:00:00.000Z',
  mintOpensAt: '2022-01-01T00:00:00.000Z',
  thumbnailUri: 'ipfs://thumb', displayUri: 'ipfs://disp', generativeUri: 'ipfs://gen',
  tags: ['a'], author: { id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio' },
  ...over,
})

test('leanToken keeps fields, drops author description', () => {
  const t = leanToken(raw(1))
  expect(t.slug).toBe('tok-1')
  expect(t.author).toEqual({ id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av' })
})

test('leanToken tolerates nulls (old/collab tokens)', () => {
  const t = leanToken(raw(2, { tags: null, author: null, thumbnailUri: null, flag: null }))
  expect(t.tags).toEqual([])
  expect(t.author).toBeNull()
  expect(t.thumbnailUri).toBeNull()
  expect(t.flag).toBe('NONE')
})

test('shardTokens splits into fixed-size shards', () => {
  const shards = shardTokens([1, 2, 3, 4, 5].map((i) => leanToken(raw(i))), 2)
  expect(shards.map((s) => s.length)).toEqual([2, 2, 1])
})

test('buildSlugIndex maps slug to shard index', () => {
  const shards = shardTokens([1, 2, 3].map((i) => leanToken(raw(i))), 2)
  expect(buildSlugIndex(shards)).toEqual({ 'tok-1': 0, 'tok-2': 0, 'tok-3': 1 })
})

test('buildArtists aggregates by author, sorted by tokenCount desc', () => {
  const tokens = [raw(1), raw(2), raw(3, { author: { id: 'tz1x', name: 'Bob', avatarUri: null, description: null } })]
  const artists = buildArtists([...tokens, raw(4, { author: null })])
  expect(artists).toEqual([
    { id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio', tokenCount: 2 },
    { id: 'tz1x', name: 'Bob', avatarUri: null, description: null, tokenCount: 1 },
  ])
})

// --- the count has to be the one the artist's own page shows -------------------
// It was neither half of that. A collaboration is authored by its *contract*, so
// grouping on author.id credited those projects to nobody; and nothing filtered
// moderated work, so a directory row could promise 48 projects and open on a page
// that showed none. Both were measured across the real catalog: 339 artists
// undercounted, 1,235 overcounted, 860 of them by everything they had.

const collabToken = (id, contract) => raw(id, {
  author: { id: contract, name: null, avatarUri: null, description: null },
})

/** collaborations.json, as the two builders read it. */
const collabs = (byArtist, contract = 'KT1collab') => ({
  byArtist,
  byProject: Object.fromEntries(
    [...new Set(Object.values(byArtist).flat())].map((p) => [String(p), { contract, collaborators: [] }]),
  ),
})

test('buildArtists counts collaborative projects for each collaborator', () => {
  const tokens = [raw(1), collabToken(2, 'KT1collab')]
  const artists = buildArtists(tokens, collabs({ tz1abc: [2], tz1bob: [2] }))
  // Alice: her own #1 plus the collaboration.
  expect(artists.find((a) => a.id === 'tz1abc').tokenCount).toBe(2)
  // Bob only ever collaborated, so he has no row in the directory and gains none —
  // his page is built from the collaboration record when someone asks for it.
  expect(artists.some((a) => a.id === 'tz1bob')).toBe(false)
  // And the contract that minted the collaboration is not an artist at all.
  expect(artists.some((a) => a.id === 'KT1collab')).toBe(false)
})

test('buildArtists leaves moderated projects out of the count', () => {
  const artists = buildArtists([raw(1), raw(2, { flag: 'MALICIOUS' }), raw(3, { flag: 'REPORTED' })])
  expect(artists.find((a) => a.id === 'tz1abc').tokenCount).toBe(1)
})

test('buildArtists drops an artist whose every project is moderated', () => {
  const spam = { id: 'tz1spam', name: 'Copyminter', avatarUri: null, description: null }
  const artists = buildArtists([raw(1), raw(2, { flag: 'MALICIOUS', author: spam })])
  // Their page says "No visible projects from this artist", so a directory row
  // pointing at it is a promise of work that cannot be shown.
  expect(artists.map((a) => a.id)).toEqual(['tz1abc'])
})

test('buildArtists sorts by the corrected count, not the raw one', () => {
  const bob = { id: 'tz1x', name: 'Bob', avatarUri: null, description: null }
  const tokens = [
    raw(1, { flag: 'MALICIOUS' }), raw(2, { flag: 'MALICIOUS' }), raw(3),
    raw(4, { author: bob }), raw(5, { author: bob }),
  ]
  // Alice has more projects; Bob has more that can be seen.
  expect(buildArtists(tokens).map((a) => a.id)).toEqual(['tz1x', 'tz1abc'])
})

test('reviseArtists keeps who an artist is and only restates how much they made', () => {
  const listed = [{ id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio', tokenCount: 99 }]
  // The identity fields cannot be rebuilt from a lean token — descriptions are not
  // in one — so a revision has to carry them through untouched.
  expect(reviseArtists(listed, [leanToken(raw(1)), leanToken(collabToken(2, 'KT1collab'))], collabs({ tz1abc: [2] })))
    .toEqual([{ id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio', tokenCount: 2 }])
})

test('reviseArtists ignores a collaboration id that names no project in the catalog', () => {
  const listed = [{ id: 'tz1abc', name: 'Alice', avatarUri: null, description: null, tokenCount: 1 }]
  expect(reviseArtists(listed, [leanToken(raw(1))], collabs({ tz1abc: [404] }))[0].tokenCount).toBe(1)
})

test('the visibility rule matches the one the gallery build uses', () => {
  // Five copies of this set exist across the scripts, each with a comment saying it
  // is kept in step with the others. This is the only one that checks.
  expect([...HIDDEN_FLAGS].sort()).toEqual([...GALLERY_HIDDEN_FLAGS].sort())
})

test('buildTokensMap maps author id to token ids', () => {
  const tokens = [1, 2].map((i) => leanToken(raw(i)))
  expect(buildTokensMap(tokens)).toEqual({ tz1abc: [1, 2] })
})

test('buildMeta summarizes snapshot', () => {
  expect(buildMeta([leanToken(raw(1))], 1, 'T')).toEqual({ generatedAt: 'T', tokenCount: 1, shardCount: 1, shardSize: 1000 })
})

// --- truncation guard --------------------------------------------------------
// The paging loop stops on a short page, so a mid-run API degradation looks exactly
// like "the end of the catalog". Committing that over a good snapshot silently
// deletes projects from the site, and the job would still go green.

test('isTruncatedSnapshot rejects a run that lost more than 5% of the catalog', () => {
  expect(isTruncatedSnapshot(20000, { tokenCount: 27430 })).toBe(true)
  expect(isTruncatedSnapshot(0, { tokenCount: 27430 })).toBe(true)
  expect(isTruncatedSnapshot(Math.floor(27430 * MIN_RETAINED_RATIO) - 1, { tokenCount: 27430 })).toBe(true)
})

test('isTruncatedSnapshot accepts growth, parity, and normal churn', () => {
  expect(isTruncatedSnapshot(27430, { tokenCount: 27430 })).toBe(false)
  expect(isTruncatedSnapshot(27500, { tokenCount: 27430 })).toBe(false)
  expect(isTruncatedSnapshot(Math.ceil(27430 * MIN_RETAINED_RATIO), { tokenCount: 27430 })).toBe(false)
})

test('isTruncatedSnapshot lets a legitimate first run through', () => {
  // No previous meta.json to compare against, or an unusable one.
  expect(isTruncatedSnapshot(27430, null)).toBe(false)
  expect(isTruncatedSnapshot(27430, undefined)).toBe(false)
  expect(isTruncatedSnapshot(27430, {})).toBe(false)
  expect(isTruncatedSnapshot(27430, { tokenCount: 'lots' })).toBe(false)
  expect(isTruncatedSnapshot(27430, { tokenCount: 0 })).toBe(false)
})

// ---- the preview seed --------------------------------------------------------------
// The thumbnail of every project is one particular iteration, run from a hash the
// artist chose at mint; what fxhash used is in the project metadata's artifactUri.
import { previewQueryOf } from './snapshot-lib.mjs'

test('previewQueryOf keeps what fxhash ran the preview with: the query, and the params fragment', () => {
  expect(previewQueryOf({
    previewHash: 'oozQ4d', artifactUri: 'ipfs://Qmecuq/?fxhash=oozQ4d&fxiteration=35&fxminter=tz1vm#0x82ffb4',
  })).toBe('?fxhash=oozQ4d&fxiteration=35&fxminter=tz1vm#0x82ffb4')
  expect(previewQueryOf({ previewHash: 'ooWF8d', artifactUri: 'ipfs://Qmd951/?fxhash=ooWF8d&fxiteration=1&fxminter=tz1Ng' }))
    .toBe('?fxhash=ooWF8d&fxiteration=1&fxminter=tz1Ng')
})

test('previewQueryOf falls back to the hash alone, and to nothing for the first metadata format', () => {
  expect(previewQueryOf({ previewHash: 'ooABC', artifactUri: 'ipfs://QmX' })).toBe('?fxhash=ooABC')
  expect(previewQueryOf({ artifactUri: 'ipfs://QmV17Zn' })).toBeNull()   // 2021: no preview hash was ever recorded
  expect(previewQueryOf({})).toBeNull()
  expect(previewQueryOf(null)).toBeNull()
})
