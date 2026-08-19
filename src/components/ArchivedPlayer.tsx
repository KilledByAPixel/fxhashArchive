import { useEffect, useState } from 'react'
import { loadProjectIteration, type LocalIteration } from '../lib/data'
import ArchivedFrame from './ArchivedFrame'

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

interface Props {
  projectId: number
  /** Minted iteration ids for this project, as `FX{version}-{tokenId}`. */
  iterationIds: string[]
}

export default function ArchivedPlayer({ projectId, iterationIds }: Props) {
  const [index, setIndex] = useState(0)
  const [local, setLocal] = useState<LocalIteration | null | undefined>(undefined)

  const current = iterationIds[index]
  const tokenId = current ? Number(current.split('-')[1]) : NaN

  useEffect(() => {
    if (!Number.isFinite(tokenId)) return
    let cancelled = false
    setLocal(undefined)
    loadProjectIteration(projectId, tokenId).then(
      (r) => { if (!cancelled) setLocal(r) },
      () => { if (!cancelled) setLocal(null) },
    )
    return () => { cancelled = true }
  }, [projectId, tokenId])

  if (iterationIds.length === 0) return null


  return (
    <section className="archived-player">
      <h3>Archived copy</h3>
      <p className="muted">
        This project's generator is stored in this repository. What you see below is
        rebuilt from that code and the piece's original seed — no IPFS, no Tezos, no
        network of any kind.
      </p>

      {local === undefined && <p>Loading seed…</p>}
      {local !== undefined && !local?.seed && (
        <p>
          This mint was never signed by fxhash, so no seed was ever assigned and no
          artwork was generated for it.
        </p>
      )}
      {local?.seed && (
        <>
          <ArchivedFrame
            projectId={projectId}
            seed={local.seed}
            query={local.query}
            label={`iteration ${current}`}
          />
          <p className="muted">
            <code>{current}</code> · seed <code>{local.seed}</code>
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
