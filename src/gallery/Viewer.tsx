import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PieceFrame, { archivedSrc } from '../components/PieceFrame'
import TzktLink from '../components/ChainLinks'
import { loadIterationContract, loadIterationIds, loadProjectIteration, loadSummary, type LocalIteration } from '../lib/data'
import { fetchOwner, type Owner } from '../lib/tzkt'
import type { Painting } from './types'
import { coverRect, type ScreenRect } from './approach'

interface Props {
  painting: Painting
  /** Where the painting is on screen; the frame is put exactly there. */
  rect: ScreenRect
  onBack: () => void
}

/** The hash inside a captured `?fxhash=…` query; '' if it carries none. */
const hashOf = (query: string) => new URLSearchParams(query.split('#')[0].slice(1)).get('fxhash') ?? ''

/**
 * The piece, running on the wall.
 *
 * Once the camera is square to a painting its image is an axis-aligned rectangle,
 * so the same sandboxed PieceFrame the project page uses is simply positioned over
 * it. Underneath, the painting quad stays — a heavy piece shows its preview while
 * it boots.
 *
 * Positions run #0, #1 … #N. #0 is the preview: the iteration fxhash's thumbnail
 * shows, run from the query the artist minted it with, so the piece opens on the
 * very image you walked up to — when the archive holds that query; the first
 * metadata format never recorded it, and those open on #1. From #1 on, stepping
 * walks the minted editions: ids and seeds from this repository, as on the
 * project page. Random picks among the editions only.
 */
export default function Viewer({ painting, rect, onBack }: Props) {
  const preview = painting.preview ?? null
  const first = preview ? 0 : 1
  const [ids, setIds] = useState<string[] | null | undefined>(undefined)
  // undefined until the summary answers: the frame waits for it, or the preview
  // would load once from the artist's file and again through the runner.
  const [hasRunner, setHasRunner] = useState<boolean | undefined>(undefined)
  const [pos, setPos] = useState(first)
  const [local, setLocal] = useState<LocalIteration | null | undefined>(undefined)
  const [owner, setOwner] = useState<Owner | null>(null)

  useEffect(() => {
    let cancelled = false
    setIds(undefined)
    setHasRunner(undefined)
    setPos(first)
    loadSummary().then(
      (s) => { if (!cancelled) setHasRunner(s.runners.includes(painting.project)) },
      () => { if (!cancelled) setHasRunner(false) },
    )
    loadIterationIds(painting.slug, painting.project).then(
      (r) => { if (!cancelled) setIds(r) },
      () => { if (!cancelled) setIds(null) },
    )
    return () => { cancelled = true }
  }, [painting.project, painting.slug, first])

  const current = pos >= 1 ? ids?.[pos - 1] : undefined
  const tokenId = current ? Number(current.split('-')[1]) : NaN

  useEffect(() => {
    if (!Number.isFinite(tokenId)) return
    let cancelled = false
    setLocal(undefined)
    loadProjectIteration(painting.project, tokenId).then(
      (r) => { if (!cancelled) setLocal(r) },
      () => { if (!cancelled) setLocal(null) },
    )
    return () => { cancelled = true }
  }, [painting.project, tokenId])

  // Who holds this edition right now — the one fact on the wall this repository
  // cannot keep, because it is only true at the moment it is asked. So it is
  // fetched on its own, after the piece is already running, and every failure is
  // silent: the museum works with no chain, no IPFS and no network at all, and
  // the bar has to be complete without it. The preview has no owner to look up.
  useEffect(() => {
    setOwner(null)
    if (!Number.isFinite(tokenId)) return
    let cancelled = false
    loadIterationContract(painting.project)
      .then((contract) => (contract ? fetchOwner(contract, String(tokenId)) : null))
      .then((found) => { if (!cancelled) setOwner(found) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [painting.project, tokenId])

  const count = ids?.length ?? 0
  const positions = count - first + 1                      // #first … #count
  const step = (delta: number) => {
    if (positions > 1) setPos((p) => first + ((((p - first + delta) % positions) + positions) % positions))
  }
  const random = () => { if (count) setPos(1 + Math.floor(Math.random() * count)) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') step(-1)
      else if (e.code === 'ArrowRight') step(1)
      else if (e.code === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const label = `${painting.name} #${pos}`
  const useRunner = hasRunner === true
  const src = hasRunner === undefined ? null
    : pos === 0 && preview ? archivedSrc(painting.project, hashOf(preview), preview, useRunner)
    : local?.seed ? archivedSrc(painting.project, local.seed, local.query, useRunner) : null
  // Grown to whole pixels so no sliver of the painting underneath survives at an edge.
  const box = coverRect(rect)

  return (
    <div className="gallery-viewer">
      <div className="gallery-frame" style={box}>
        {pos === 0 && src ? (
          <PieceFrame src={src} label={label} source="archived" />
        ) : hasRunner === undefined || ids === undefined || (current && local === undefined) ? (
          <div className="gallery-frame-note">Loading seed…</div>
        ) : ids === null || count === 0 ? (
          <div className="gallery-frame-note">No editions are recorded for this project, so there is nothing to run.</div>
        ) : src ? (
          <PieceFrame src={src} label={label} source="archived" />
        ) : (
          <div className="gallery-frame-note">
            This mint was never signed by fxhash, so no seed was ever assigned and no artwork was generated for it.
          </div>
        )}
      </div>

      {/* 4 px under the frame: inside the black mat the frame quad draws around the
          painting. At 12 px the text sat half over the lit wall below and read as
          spilling off the picture. */}
      {/* Two rows, deliberately: what the piece is, then what you can do with it.
          One wrapping row put the ‹ beside the title and the › on the line below,
          which read as though the arrows belonged to different things. There is no
          Back button — clicking anywhere off the piece leaves, and so does Escape. */}
      <div className="gallery-bar" style={{ left: box.left, top: box.top + box.height + 4, width: box.width }}>
        <div className="gallery-bar-title">
          <strong>{label}</strong>
          {pos === 0 && <span className="muted"> · the preview</span>}
          {count > 0 && <span className="muted"> of {count}</span>}
          {' · '}{painting.artist} · {painting.year}
        </div>
        <div className="gallery-bar-actions">
          {positions > 1 && <button className="load-more" onClick={() => step(-1)} aria-label="‹">‹</button>}
          {positions > 1 && <button className="load-more" onClick={() => step(1)} aria-label="›">›</button>}
          {count > 1 && <button className="load-more" onClick={random}>Random</button>}
          {/* A new tab, because following this one from inside the gallery would
              cost you the place you were standing — and a WebGL context that took
              a moment to build. The one link that does leave in place is the HUD's
              "← fxhash archive", which is the way out and means to be. */}
          <Link to={`/token/${painting.slug}`} target="_blank" rel="noopener">Project page</Link>
          {owner && <span className="muted">held by <TzktLink address={owner.address} alias={owner.alias} /></span>}
        </div>
      </div>
    </div>
  )
}
