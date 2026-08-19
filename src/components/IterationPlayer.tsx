import { useEffect, useState } from 'react'
import { loadProjectIteration, type LocalIteration } from '../lib/data'
import { ipfsToHttp } from '../lib/ipfs'
import PieceFrame, { archivedSrc } from './PieceFrame'

/**
 * Steps through a project's edition, playing each piece.
 *
 * Two sources, one control surface. When the project's generator is archived here,
 * the piece is rebuilt from that code and its seed and touches no network at all —
 * the payoff of the whole preservation effort. When it is not, the same seed data
 * still holds the piece's artifact URI, so it streams from an IPFS gateway instead.
 *
 * The important part is that *both* work with no indexer. Every iteration id, seed
 * and artifact address in this catalog is a file in this repository, so browsing an
 * edition never depended on TzKT — it just used to be written as though it did, and
 * the player only appeared for archived projects. A visitor should not have to know
 * which projects those are to press Next.
 *
 * The seed is what makes either source honest. A generator alone renders *a* piece,
 * not *the* piece — the seed selects the one that was actually minted, and it exists
 * nowhere on chain.
 */

interface Props {
  projectId: number
  /** For labelling only — iterations are named "<project> #<n>", as fxhash named them. */
  projectName: string
  /** Minted iteration ids for this project, as `FX{version}-{tokenId}`. */
  iterationIds: string[]
  /** Whether this project's generator code is stored in this repository. */
  archived: boolean
}

export default function IterationPlayer({ projectId, projectName, iterationIds, archived }: Props) {
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

  // Archived wins when it exists: it is the same artwork without the network, and
  // without a gateway that might be rate-limiting or gone. A project that is not
  // archived falls back to the address the piece has always had on IPFS.
  const liveSrc = local?.artifact ? ipfsToHttp(local.artifact) : null
  const playable = Boolean(local?.seed)
  const useArchived = playable && archived
  const src = !playable
    ? null
    : useArchived
    ? archivedSrc(projectId, local!.seed!, local!.query)
    : liveSrc

  return (
    <section className="archived-player">
      <h3>{archived ? 'Archived copy' : 'Play this edition'}</h3>
      <p className="muted">
        {archived ? (
          <>
            This project's generator is stored in this repository. What you see below is
            rebuilt from that code and the piece's original seed — no IPFS, no Tezos, no
            network of any kind.
          </>
        ) : (
          <>
            This project's code is not archived here, so each piece is streamed from
            IPFS. The edition list and every seed still come from this repository, so
            stepping through the edition works even with no indexer.
          </>
        )}
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
        ) : src ? (
          <PieceFrame src={src} label={label} source={useArchived ? 'archived' : 'ipfs'} />
        ) : local?.seed ? (
          // A seed but nowhere to run it: not archived, and no artifact address.
          <div className="archived-blank">
            <p>No artifact address was recorded for this piece, so it cannot be played.</p>
          </div>
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
