import { test, expect } from 'vitest'
import { leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta } from './snapshot-lib.mjs'

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
