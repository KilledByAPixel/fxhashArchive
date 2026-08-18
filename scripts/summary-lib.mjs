// Pure builders for public/data/summary.json. Kept free of I/O so they can be
// tested directly, mirroring scripts/snapshot-lib.mjs.

/**
 * How many cards the landing page ships with, so it never has to fetch the
 * 16.5 MB catalog just to show two strips of artwork. `top` feeds the
 * most-collected strip, `sample` the random one — the sample is larger than the
 * strip so the shuffle has something to vary between visits.
 */
export const FEATURED_TOP = 40
export const FEATURED_SAMPLE = 200

/**
 * The subset of a project's fields a card actually renders: thumbnail, name,
 * author, and a link. `thumbnailUri` is an ipfs:// pointer of about fifty
 * characters, not image data — the images still load from IPFS as before.
 *
 * `flag` is carried so the client can still apply its own moderation check
 * rather than trusting that this file was built with one.
 */
export function leanCard(t) {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    flag: t.flag,
    thumbnailUri: t.thumbnailUri ?? null,
    author: t.author ? { id: t.author.id, name: t.author.name ?? null } : null,
  }
}

/**
 * Cards for the landing page: the highest-ranked projects, plus a spread to
 * shuffle for the random strip.
 *
 * `sampleFrom` is deliberately a different set from `tokens`. The random strip
 * draws only from fully-archived projects, because those are the ones whose
 * preview images are stored here — sampling the whole catalog gave a row of
 * empty tiles the moment IPFS was unreachable, on a page whose entire purpose
 * is to show that the archive survives without it. The breadth lost is real:
 * the strip can no longer surface any of the 27,430, only the archived few
 * hundred.
 *
 * The spread is taken at even intervals rather than at random so the file is
 * byte-identical between runs, and so it covers every era of the platform
 * instead of clustering wherever a PRNG landed.
 *
 * Both sets must already be filtered to visible projects.
 */
export function buildFeatured(
  tokens,
  ranked,
  sampleFrom = tokens,
  topCount = FEATURED_TOP,
  sampleCount = FEATURED_SAMPLE,
) {
  const byId = new Map(tokens.map((t) => [t.id, t]))
  const top = []
  for (const id of ranked) {
    if (top.length >= topCount) break
    const t = byId.get(id)
    if (t) top.push(leanCard(t))
  }

  const sample = []
  const n = Math.min(sampleCount, sampleFrom.length)
  for (let i = 0; i < n; i++) {
    sample.push(leanCard(sampleFrom[Math.floor((i * (sampleFrom.length - 1)) / Math.max(1, n - 1))]))
  }
  return { top, sample }
}

/** Project ids, highest volume first. Zero-volume projects are not ranked at all. */
export function buildRanking(volumes) {
  return [...volumes.entries()]
    .filter(([, v]) => v > 0)
    // Ties broken by id so the file is byte-identical across runs; an unstable
    // ranking would show up as a spurious diff on every regeneration.
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([id]) => id)
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
  visibleTokens = [], thumbs = {},
}) {
  const archived = [...archivedIds].sort((a, b) => a - b)
  const ranked = buildRanking(volumes)
  const archivedSet = new Set(archived)
  const archivedTokens = visibleTokens.filter((t) => archivedSet.has(t.id))
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
    ranked,
    archived,
    featured: buildFeatured(visibleTokens, ranked, archivedTokens),
    /**
     * Project id -> the preview image saved under public/data/thumbs.
     * Present only for archived projects; everything else still streams its
     * preview from IPFS.
     */
    thumbs,
  }
}
