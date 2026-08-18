import { test, expect } from 'vitest'
import { buildRanking, buildSummary, buildArchivedVolumeShare, buildFeatured, leanCard } from './summary-lib.mjs'

const volumes = new Map([[1, 500], [2, 300], [3, 200], [4, 0]])

test('buildRanking orders by volume desc and drops zero-volume projects', () => {
  expect(buildRanking(volumes)).toEqual([1, 2, 3])
})

test('buildRanking breaks ties by ascending id so output is stable', () => {
  expect(buildRanking(new Map([[9, 100], [2, 100], [5, 100]]))).toEqual([2, 5, 9])
})

test('buildSummary assembles counts, ranking, archived set and curve', () => {
  const s = buildSummary({
    projectCount: 4, artistCount: 2, iterationCount: 10, seedCount: 9,
    volumes, archivedIds: [3, 1], generatedAt: '2026-08-18T00:00:00.000Z',
  })
  expect(s.counts).toEqual({
    projects: 4, artists: 2, iterations: 10, seeds: 9, archived: 2,
    // ids 1 and 3 of the fixture hold 700 of its 1000 total volume
    archivedShareOfVolume: 70,
  })
  expect(s.ranked).toEqual([1, 2, 3])
  expect(s.archived).toEqual([1, 3]) // sorted ascending
  expect(s.generatedAt).toBe('2026-08-18T00:00:00.000Z')
})

test('buildArchivedVolumeShare reports what fraction of spending the archive covers', () => {
  // 1000 tez total; archiving ids 1 and 3 covers 500 + 200 = 700.
  expect(buildArchivedVolumeShare(volumes, [1, 3])).toBe(70)
})

test('buildArchivedVolumeShare ignores archived ids with no recorded volume', () => {
  // id 4 has zero volume and id 99 is not a project at all — neither adds share.
  expect(buildArchivedVolumeShare(volumes, [1, 4, 99])).toBe(50)
})

test('buildArchivedVolumeShare is 0 when nothing traded, rather than NaN', () => {
  expect(buildArchivedVolumeShare(new Map([[1, 0]]), [1])).toBe(0)
})

test('buildSummary exposes the archived share of spending', () => {
  const s = buildSummary({
    projectCount: 4, artistCount: 2, iterationCount: 10, seedCount: 9,
    volumes, archivedIds: [1, 3], generatedAt: '2026-08-18T00:00:00.000Z',
  })
  expect(s.counts.archivedShareOfVolume).toBe(70)
})

const tok = (id, over = {}) => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN',
  thumbnailUri: `ipfs://thumb${id}`, displayUri: 'ipfs://d', generativeUri: 'ipfs://g',
  supply: 1, iterationsCount: 0, createdAt: null, mintOpensAt: null, tags: [],
  author: { id: `tz${id}`, name: `A${id}`, avatarUri: 'ipfs://av' },
  ...over,
})

test('leanCard keeps only what a card renders, and carries the moderation flag', () => {
  expect(leanCard(tok(1))).toEqual({
    id: 1, slug: 'tok-1', name: 'Tok 1', flag: 'CLEAN',
    thumbnailUri: 'ipfs://thumb1',
    author: { id: 'tz1', name: 'A1' },
  })
})

test('leanCard tolerates a missing author and thumbnail', () => {
  const card = leanCard(tok(2, { author: null, thumbnailUri: null }))
  expect(card.author).toBeNull()
  expect(card.thumbnailUri).toBeNull()
})

test('buildFeatured takes the top ranked projects in rank order', () => {
  const tokens = [tok(1), tok(2), tok(3), tok(4)]
  const { top } = buildFeatured(tokens, [3, 1, 4], 2, 2)
  expect(top.map((c) => c.id)).toEqual([3, 1])
})

test('buildFeatured skips ranked ids with no visible project', () => {
  // id 9 was ranked but is hidden or absent, so it must not appear as a hole.
  const tokens = [tok(1), tok(2)]
  const { top } = buildFeatured(tokens, [9, 2, 1], 2, 2)
  expect(top.map((c) => c.id)).toEqual([2, 1])
})

test('buildFeatured spreads its sample across the whole catalog, not just the start', () => {
  const tokens = Array.from({ length: 100 }, (_, i) => tok(i))
  const { sample } = buildFeatured(tokens, [], 0, 5)
  // Evenly spaced endpoints included, so every era of the platform is represented.
  expect(sample.map((c) => c.id)).toEqual([0, 24, 49, 74, 99])
})

test('buildFeatured asks for no more than the catalog holds', () => {
  const { sample } = buildFeatured([tok(1), tok(2)], [], 0, 50)
  expect(sample).toHaveLength(2)
})

test('buildSummary includes featured cards and no longer emits a curve', () => {
  const s = buildSummary({
    projectCount: 3, artistCount: 1, iterationCount: 3, seedCount: 3,
    volumes: new Map([[1, 500], [2, 300]]), archivedIds: [1],
    generatedAt: '2026-08-18T00:00:00.000Z',
    visibleTokens: [tok(1), tok(2), tok(3)],
  })
  expect(s.featured.top.map((c) => c.id)).toEqual([1, 2])
  expect(s.featured.sample.length).toBe(3)
  expect(s.curve).toBeUndefined()
})
