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
  /** For labelling only — iterations are named "<project> #<n>", as fxhash named them. */
  projectName: string
  /** Minted iteration ids for this project, as `FX{version}-{tokenId}`. */
  iterationIds: string[]
}

export default function ArchivedPlayer({ projectId, projectName, iterationIds }: Props) {
  const [index, setIndex] = useState(0)
  const [local, setLocal] = useState<LocalIteration | null | undefined>(undefined)

  const current = iterationIds[index]
  const tokenId = current ? Number(current.split('-')[1]) : NaN
  /**
   * Iteration number, taken from the position in the id list.
   *
   * Verified rather than assumed: across a 1,550-project sample, all 8,173
   * iterations whose captured artifact URI carries an authoritative
   * `fxiteration=` matched their position exactly, unsigned mints included —
   * those still consume a number. This is what lets the piece be named offline.
   */
  const label = `${projectName} #${index + 1}`

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

  const step = (delta: number) =>
    setIndex((i) => (i + delta + iterationIds.length) % iterationIds.length)

  return (
    <section className="archived-player">
      <h3>Archived copy</h3>
      <p className="muted">
        This project's generator is stored in this repository. What you see below is
        rebuilt from that code and the piece's original seed — no IPFS, no Tezos, no
        network of any kind.
      </p>

      {/*
        The stage keeps its size whatever it holds. Stepping through an edition
        lands on unsigned mints and on seeds still loading, and if those collapsed
        the box, everything below them — including the button being clicked —
        jumped up the page mid-click.
      */}
      <div className="archived-stage">
        {local === undefined ? (
          <div className="archived-blank"><p>Loading seed…</p></div>
        ) : local?.seed ? (
          <ArchivedFrame
            projectId={projectId}
            seed={local.seed}
            query={local.query}
            label={label}
          />
        ) : (
          <div className="archived-blank">
            <p>
              This mint was never signed by fxhash, so no seed was ever assigned and
              no artwork was generated for it.
            </p>
          </div>
        )}
      </div>

      <div className="archived-nav">
        {iterationIds.length > 1 && (
          <button className="load-more" onClick={() => step(-1)}>‹ Previous</button>
        )}
        <span className="archived-counter">
          {label} <span className="muted">of {iterationIds.length}</span>
        </span>
        {iterationIds.length > 1 && (
          <button className="load-more" onClick={() => step(1)}>Next ›</button>
        )}
      </div>

      {/* Last on purpose: this is the only line whose height varies, so its reflow
          cannot move the controls above it. */}
      <p className="muted archived-caption">
        <code>{current}</code>
        {local?.seed && <> · seed <code>{local.seed}</code></>}
      </p>
    </section>
  )
}
