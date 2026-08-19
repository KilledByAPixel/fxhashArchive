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
 *
 * `collaborations` is byProject from public/data/collaborations.json. 31 of the
 * 240 landing-page cards are collaborations, whose recorded author is the contract
 * they minted through — so without this the front page credits a third of its
 * highest-value work, Richter included, to "KT1CzKMTA6JyL4gnsh4Ziqd7Z8dxDDBphua5".
 * The name is resolved here rather than in the browser so the landing page stays a
 * single small fetch.
 */
export function leanCard(t, collaborations = {}) {
  const credit = collaborations[t.id]?.collaborators
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    flag: t.flag,
    thumbnailUri: t.thumbnailUri ?? null,
    // id stays the contract, because that is what the record says. Only the display
    // name is filled in, from the people the contract itself names on chain.
    author: t.author
      ? { id: t.author.id, name: credit ? creditLine(credit) : t.author.name ?? null }
      : null,
  }
}

/** Mirrors bylineLabel in src/components/Byline.tsx: cards have room for one line. */
export function creditLine(collaborators) {
  const names = collaborators.map((c) => c.name ?? `${c.id.slice(0, 8)}…${c.id.slice(-4)}`)
  if (names.length === 0) return null
  if (names.length <= 2) return names.join(' and ')
  return `${names[0]} and ${names.length - 1} others`
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
  collaborations = {},
) {
  const byId = new Map(tokens.map((t) => [t.id, t]))
  const top = []
  for (const id of ranked) {
    if (top.length >= topCount) break
    const t = byId.get(id)
    if (t) top.push(leanCard(t, collaborations))
  }

  const sample = []
  const n = Math.min(sampleCount, sampleFrom.length)
  for (let i = 0; i < n; i++) {
    sample.push(
      leanCard(sampleFrom[Math.floor((i * (sampleFrom.length - 1)) / Math.max(1, n - 1))], collaborations),
    )
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
  visibleTokens = [], thumbs = {}, collaborations = {}, runnerIds = [],
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
    /**
     * Archived projects that have a generated `_run.html` to be run through rather
     * than the artist's own entry point, because the viewer's sandbox takes away
     * APIs they need. See scripts/sandbox-shim.mjs. A short list of ids, so it
     * rides along here instead of costing the client a second fetch.
     */
    runners: [...runnerIds].sort((a, b) => a - b),
    featured: buildFeatured(visibleTokens, ranked, archivedTokens, FEATURED_TOP, FEATURED_SAMPLE, collaborations),
    /**
     * Project id -> the preview image saved under public/data/thumbs.
     * Present only for archived projects; everything else still streams its
     * preview from IPFS.
     */
    thumbs,
  }
}
