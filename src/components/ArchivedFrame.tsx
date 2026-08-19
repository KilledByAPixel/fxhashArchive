/**
 * One archived generator, running from this repository.
 *
 * Shared by the project page's player and the iteration page so both build the
 * same URL and carry the same sandbox — the two places a visitor can run
 * preserved art, and the only places on the site that touch neither IPFS nor
 * Tezos.
 */

/** Every archived generator unpacks with this entry point; see scripts/archive-generators.mjs. */
const ENTRY = 'index.html'

/**
 * Prefer the exact query fxhash used over one rebuilt from the seed.
 *
 * `?fxhash=<seed>` alone is enough for most pieces, but it silently drops
 * `fxiteration` and `fxminter`, which some generators read — and for the 11,818
 * fx(params) iterations it drops the parameters the minter chose, which ride in
 * the URL fragment. Those would render the artist's defaults instead of the
 * piece that was actually minted: right generator, right seed, wrong artwork.
 */
export function archivedSrc(projectId: number, seed: string, query?: string | null) {
  const suffix = query ?? `?fxhash=${encodeURIComponent(seed)}`
  return `${import.meta.env.BASE_URL}data/generators/${projectId}/${ENTRY}${suffix}`
}

export default function ArchivedFrame({
  projectId,
  seed,
  query,
  label,
}: {
  projectId: number
  seed: string
  query?: string | null
  label: string
}) {
  const src = archivedSrc(projectId, seed, query)
  return (
    <iframe
      key={src}
      className="archived-frame"
      src={src}
      title={`Archived generator for ${label}`}
      // Scripts yes, same-origin never. These generators are served from our own
      // origin rather than a gateway, which makes withholding allow-same-origin
      // matter more here than it did when they were remote.
      sandbox="allow-scripts"
    />
  )
}
