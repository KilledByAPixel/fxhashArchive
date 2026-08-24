import { test, expect } from 'vitest'
import {
  leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta,
  isTruncatedSnapshot, MIN_RETAINED_RATIO,
} from './snapshot-lib.mjs'

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
