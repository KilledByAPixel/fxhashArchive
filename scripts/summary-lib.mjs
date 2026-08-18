// Pure builders for public/data/summary.json. Kept free of I/O so they can be
// tested directly, mirroring scripts/snapshot-lib.mjs.

/** Percent positions sampled for the landing-page concentration curve. */
export const CURVE_POINTS = [0.25, 0.5, 1, 2, 3, 5, 10, 25, 50, 100]

/** Project ids, highest volume first. Zero-volume projects are not ranked at all. */
export function buildRanking(volumes) {
  return [...volumes.entries()]
    .filter(([, v]) => v > 0)
    // Ties broken by id so the file is byte-identical across runs; an unstable
    // ranking would show up as a spurious diff on every regeneration.
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([id]) => id)
}

export function buildCurve(volumes, points = CURVE_POINTS) {
  const ranked = buildRanking(volumes)
  const sorted = ranked.map((id) => volumes.get(id))
  const total = sorted.reduce((a, b) => a + b, 0)
  if (total === 0) return points.map((p) => ({ p, share: 0 }))
  return points.map((p) => {
    // At least one project: rounding 1% of a small catalog to zero would report
    // a 0% share, which reads as "the top projects hold nothing".
    const n = Math.max(1, Math.round((ranked.length * p) / 100))
    const share = sorted.slice(0, n).reduce((a, b) => a + b, 0)
    return { p, share: Math.round((1000 * share) / total) / 10 }
  })
}

/**
 * What percentage of all collector spending the archived projects account for.
 *
 * This is the number that justifies a selective archive: the archived set is a
 * fraction of the catalog by count, but most of it by engagement. Reported as a
 * percentage with one decimal, and 0 rather than NaN when nothing ever traded.
 */
export function buildArchivedVolumeShare(volumes, archivedIds) {
  let total = 0
  for (const v of volumes.values()) total += v
  if (total === 0) return 0
  let covered = 0
  for (const id of new Set(archivedIds)) covered += volumes.get(id) ?? 0
  return Math.round((1000 * covered) / total) / 10
}

export function buildSummary({
  projectCount, artistCount, iterationCount, seedCount, volumes, archivedIds, generatedAt,
}) {
  const archived = [...archivedIds].sort((a, b) => a - b)
  return {
    generatedAt,
    counts: {
      projects: projectCount,
      artists: artistCount,
      iterations: iterationCount,
      seeds: seedCount,
      archived: archived.length,
      archivedShareOfVolume: buildArchivedVolumeShare(volumes, archivedIds),
    },
    ranked: buildRanking(volumes),
    archived,
    curve: buildCurve(volumes),
  }
}
