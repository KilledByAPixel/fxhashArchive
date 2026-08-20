/**
 * One generative artwork, running in a sandbox.
 *
 * Every place on the site that executes a piece goes through here — the project
 * page's player and the iteration page, each of which may be running either the
 * copy archived in this repository or the original streamed from IPFS. The two
 * sources differ only in the URL; the sandbox must not differ at all, which is why
 * there is one component rather than one per source.
 */

import { ipfsToHttp } from '../lib/ipfs'

/** Every archived generator unpacks with this entry point; see scripts/archive-generators.mjs. */
const ENTRY = 'index.html'

/**
 * The derived entry point, generated for every archived project. Identical to the
 * artist's document apart from one script in front of it, which puts back the
 * handful of browser APIs the sandbox's opaque origin takes away — CORS on the
 * piece's own images, storage, cookies and workers — without which 272 of the 420
 * throw instead of rendering. Built by scripts/build-runners.mjs; the artist's
 * file is never modified, and index.html beside it is still exactly what they
 * shipped.
 */
const RUNNER_ENTRY = '_run.html'

/**
 * Prefer the exact query fxhash used over one rebuilt from the seed.
 *
 * `?fxhash=<seed>` alone is enough for most pieces, but it silently drops
 * `fxiteration` and `fxminter`, which some generators read — and for the 11,818
 * fx(params) iterations it drops the parameters the minter chose, which ride in
 * the URL fragment. Those would render the artist's defaults instead of the
 * piece that was actually minted: right generator, right seed, wrong artwork.
 */
export function archivedSrc(
  projectId: number,
  seed: string,
  query?: string | null,
  useRunner = false,
) {
  const suffix = query ?? `?fxhash=${encodeURIComponent(seed)}`
  const entry = useRunner ? RUNNER_ENTRY : ENTRY
  return `${import.meta.env.BASE_URL}data/generators/${projectId}/${entry}${suffix}`
}

/**
 * The URL that runs a piece from IPFS, repaired.
 *
 * A captured artifact URI is not usable as-is. Two faults, measured across all
 * 1,802,387 iterations, leave only 12.7% of them working untouched:
 *
 *   73.9% carry `?fxhash=…` with no `/` before the `?`. Gateways answer that with
 *          a 301 to the directory and drop the query on the way, so the piece loads
 *          with no seed at all — `fxhash.slice` throws and `fxrand` never exists.
 *   13.4% carry no query whatsoever, mostly the older eras.
 *
 * Both are repaired from data this repository already holds: the trailing slash
 * stops the redirect, and the seed is the one captured for this very token. An
 * fxhash artifact reads its seed from the URL, so getting the URL wrong is the
 * difference between the minted piece and a crash.
 */
export function liveArtifactSrc(artifact: string, seed: string | null): string | null {
  const url = ipfsToHttp(artifact)
  if (!url) return null

  const hashAt = url.indexOf('#')
  const fragment = hashAt >= 0 ? url.slice(hashAt) : ''
  const withoutFragment = hashAt >= 0 ? url.slice(0, hashAt) : url

  const queryAt = withoutFragment.indexOf('?')
  let path = queryAt >= 0 ? withoutFragment.slice(0, queryAt) : withoutFragment
  let query = queryAt >= 0 ? withoutFragment.slice(queryAt + 1) : ''

  // Only a directory needs the slash. A URI naming an actual file — anything whose
  // last segment has an extension — must be left alone, or it stops resolving.
  const last = path.slice(path.lastIndexOf('/') + 1)
  if (last && !last.includes('.')) path += '/'

  // Append rather than rebuild: the captured query also carries fxiteration,
  // fxminter and fxchain, and re-encoding a string a generator parses itself is
  // a risk with no upside.
  if (seed && !/[?&]fxhash=/.test(`?${query}`)) {
    const pair = `fxhash=${encodeURIComponent(seed)}`
    query = query ? `${query}&${pair}` : pair
  }

  return `${path}${query ? `?${query}` : ''}${fragment}`
}

/**
 * The same repair, wrapped so the piece also gets the sandbox shim.
 *
 * A streamed piece runs in the identical opaque origin as an archived one and
 * breaks in the identical ways — tainted canvas, storage that throws, workers
 * refused — but the fix for an archived piece is a script we put in a file we own,
 * and a gateway's document is not ours to edit. `public/live.html` is a file we do
 * own: it fetches the artifact, splices the shim in ahead of the artist's scripts,
 * and writes the result into itself.
 *
 * The seed is why this is a page at a real URL rather than an `srcdoc` document.
 * A generator reads `?fxhash=` out of `window.location.search`, and `about:srcdoc`
 * has no query at all — so the wrapper carries the piece's own query, and only
 * appends `fxsrc` for itself. Last in the string, so `fxhash` stays first for
 * anything parsing it loosely.
 */
export function liveWrapperSrc(gatewayUrl: string | null): string | null {
  if (!gatewayUrl) return null

  const hashAt = gatewayUrl.indexOf('#')
  const fragment = hashAt >= 0 ? gatewayUrl.slice(hashAt) : ''
  const rest = hashAt >= 0 ? gatewayUrl.slice(0, hashAt) : gatewayUrl

  const queryAt = rest.indexOf('?')
  const artifact = queryAt >= 0 ? rest.slice(0, queryAt) : rest
  const query = queryAt >= 0 ? rest.slice(queryAt + 1) : ''

  const fxsrc = `fxsrc=${encodeURIComponent(artifact)}`
  return `${import.meta.env.BASE_URL}live.html?${query ? `${query}&` : ''}${fxsrc}${fragment}`
}

/**
 * Permissions granted to a running piece.
 *
 * Sandboxing and Permissions Policy are separate systems, and only one of them was
 * being set. `autoplay`'s default allowlist is `self`; an opaque-origin frame is
 * not `self`, so audio was blocked outright — not "blocked until a click", but
 * unavailable, since the permission was never delegated. Klangteppich is driven by
 * its own soundtrack (`Music(config, bpm, changeView)`), so with the Transport
 * unable to start, nothing moved and the piece read as broken.
 *
 * This grants nothing that weakens the sandbox: the origin stays opaque, storage
 * stays unreachable, and a piece still cannot see anything of ours. Sound is part
 * of the work for a good number of these, and an archive that silences them is
 * preserving the wrong thing.
 *
 * Deliberately not granted: the motion and orientation sensors, which p5 asks for
 * on every startup. Those are a fingerprinting surface, they only matter on a
 * phone, and no piece needs them to render — unlike audio, which for some of these
 * *is* the piece.
 */
export const FRAME_ALLOW = 'autoplay'

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
      allow={FRAME_ALLOW}
    />
  )
}
