/**
 * One generative artwork, running in a sandbox.
 *
 * Every place on the site that executes a piece goes through here — the project
 * page's player and the iteration page, each of which may be running either the
 * copy archived in this repository or the original streamed from IPFS. The two
 * sources differ only in the URL; the sandbox must not differ at all, which is why
 * there is one component rather than one per source.
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

interface Props {
  src: string
  /** The piece's name, e.g. "fxVase #12". */
  label: string
  /**
   * Where the code being run came from. Stated in the frame's accessible name
   * because the two are visually identical and a visitor — or a screen reader, or
   * a test — otherwise has no way to tell a preserved copy from a live stream.
   */
  source: 'archived' | 'ipfs'
}

export default function PieceFrame({ src, label, source }: Props) {
  return (
    <iframe
      key={src}
      className="archived-frame"
      src={src}
      title={`${label} (${source === 'archived' ? 'archived copy' : 'streamed from IPFS'})`}
      // Scripts yes, same-origin never. An archived generator is served from our own
      // origin rather than a gateway, which makes withholding allow-same-origin
      // matter more than it did when every piece was remote.
      sandbox="allow-scripts"
    />
  )
}
