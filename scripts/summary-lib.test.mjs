import { test, expect } from 'vitest'
import { buildRanking, buildCurve, buildSummary, buildArchivedVolumeShare, CURVE_POINTS } from './summary-lib.mjs'

const volumes = new Map([[1, 500], [2, 300], [3, 200], [4, 0]])

test('buildRanking orders by volume desc and drops zero-volume projects', () => {
  expect(buildRanking(volumes)).toEqual([1, 2, 3])
})

test('buildRanking breaks ties by ascending id so output is stable', () => {
  expect(buildRanking(new Map([[9, 100], [2, 100], [5, 100]]))).toEqual([2, 5, 9])
})

test('buildCurve reports the share of volume held by the top p percent', () => {
  // 4 ranked projects of 100 each; the top 50% hold half the volume.
  const even = new Map([[1, 100], [2, 100], [3, 100], [4, 100]])
  const curve = buildCurve(even, [50, 100])
  expect(curve).toEqual([{ p: 50, share: 50 }, { p: 100, share: 100 }])
})

test('buildCurve always counts at least one project so small p is never empty', () => {
  const curve = buildCurve(volumes, [1])
  // top 1% of 3 ranked projects rounds to 0 — must still report the leader, 500/1000.
  expect(curve).toEqual([{ p: 1, share: 50 }])
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
  expect(s.curve.length).toBe(CURVE_POINTS.length)
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
