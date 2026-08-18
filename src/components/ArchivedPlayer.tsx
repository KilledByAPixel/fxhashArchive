import { useEffect, useState } from 'react'
import { loadProjectSeed } from '../lib/data'

/**
 * Runs a project's archived generator entirely from this repository.
 *
 * This is the payoff of the whole preservation effort, and the only part of the
 * site that touches neither IPFS nor Tezos. Everywhere else, an artwork is
 * fetched: the image from IPFS, the iteration's details from a public indexer.
 * Here the generator is a file in this repo and the seed came out of the captured
 * seed data, so the piece is reconstructed rather than retrieved. Unplug the
 * network and this still draws.
 *
 * The seed is the reason it works. A generator alone renders *a* piece, not *the*
 * piece — the seed is what selects the one that was actually minted, and it exists
 * nowhere on chain.
 */

/** Every archived generator unpacks with this entry point; see scripts/archive-generators.mjs. */
const ENTRY = 'index.html'

interface Props {
  projectId: number
  /** Minted iteration ids for this project, as `FX{version}-{tokenId}`. */
  iterationIds: string[]
}

export default function ArchivedPlayer({ projectId, iterationIds }: Props) {
  const [index, setIndex] = useState(0)
  const [seed, setSeed] = useState<string | null | undefined>(undefined)

  const current = iterationIds[index]
  const tokenId = current ? Number(current.split('-')[1]) : NaN

  useEffect(() => {
    if (!Number.isFinite(tokenId)) return
    let cancelled = false
    setSeed(undefined)
    loadProjectSeed(projectId, tokenId).then(
      (s) => { if (!cancelled) setSeed(s) },
      () => { if (!cancelled) setSeed(null) },
    )
    return () => { cancelled = true }
  }, [projectId, tokenId])

  if (iterationIds.length === 0) return null

  const src = seed
    ? `${import.meta.env.BASE_URL}data/generators/${projectId}/${ENTRY}?fxhash=${encodeURIComponent(seed)}`
    : null

  return (
    <section className="archived-player">
      <h3>Archived copy</h3>
      <p className="muted">
        This project's generator is stored in this repository. What you see below is
        rebuilt from that code and the piece's original seed — no IPFS, no Tezos, no
        network of any kind.
      </p>

      {seed === undefined && <p>Loading seed…</p>}
      {seed === null && (
        <p>
          This mint was never signed by fxhash, so no seed was ever assigned and no
          artwork was generated for it.
        </p>
      )}
      {src && (
        <>
          {/* Same sandbox as the live view: scripts, but no same-origin. The generator
              is served from our own origin here, so withholding allow-same-origin is
              what stops archived third-party code from reading this site's storage. */}
          <iframe
            key={src}
            className="archived-frame"
            src={src}
            title={`Archived generator for project ${projectId}, iteration ${current}`}
            sandbox="allow-scripts"
          />
          <p className="muted">
            <code>{current}</code> · seed <code>{seed}</code>
          </p>
        </>
      )}

      {iterationIds.length > 1 && (
        <button
          className="load-more"
          onClick={() => setIndex((i) => (i + 1) % iterationIds.length)}
        >
          Next iteration ({index + 1} of {iterationIds.length})
        </button>
      )}
    </section>
  )
}
