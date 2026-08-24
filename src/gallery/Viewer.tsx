import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PieceFrame, { archivedSrc } from '../components/PieceFrame'
import { loadIterationIds, loadProjectIteration, loadSummary, type LocalIteration } from '../lib/data'
import type { Painting } from './types'
import type { ScreenRect } from './approach'

interface Props {
  painting: Painting
  /** Where the painting is on screen; the frame is put exactly there. */
  rect: ScreenRect
  onBack: () => void
}

/**
 * The piece, running on the wall.
 *
 * Once the camera is square to a painting its image is an axis-aligned rectangle,
 * so the same sandboxed PieceFrame the project page uses is simply positioned over
 * it. Underneath, the painting quad stays — a heavy piece shows its preview while
 * it boots. Stepping walks the real edition: ids and seeds from this repository,
 * as on the project page, so every piece shown was minted.
 */
export default function Viewer({ painting, rect, onBack }: Props) {
  const [ids, setIds] = useState<string[] | null | undefined>(undefined)
  const [hasRunner, setHasRunner] = useState(false)
  const [index, setIndex] = useState(0)
  const [local, setLocal] = useState<LocalIteration | null | undefined>(undefined)
  const [raw, setRaw] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIds(undefined)
    setIndex(0)
    setRaw(false)
    loadSummary().then(
      (s) => { if (!cancelled) setHasRunner(s.runners.includes(painting.project)) },
      () => { if (!cancelled) setHasRunner(false) },
    )
    loadIterationIds(painting.slug, painting.project).then(
      (r) => { if (!cancelled) setIds(r) },
      () => { if (!cancelled) setIds(null) },
    )
    return () => { cancelled = true }
  }, [painting.project, painting.slug])

  const current = ids?.[index]
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

  const count = ids?.length ?? 0
  const step = (delta: number) => { if (count) setIndex((i) => (i + delta + count) % count) }
  const random = () => { if (count) setIndex(Math.floor(Math.random() * count)) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') step(-1)
      else if (e.code === 'ArrowRight') step(1)
      else if (e.code === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const label = `${painting.name} #${index + 1}`
  const src = local?.seed ? archivedSrc(painting.project, local.seed, local.query, hasRunner && !raw) : null
  const box = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }

  return (
    <div className="gallery-viewer">
      <div className="gallery-frame" style={box}>
        {ids === undefined || (current && local === undefined) ? (
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
      <div className="gallery-bar" style={{ left: rect.left, top: rect.top + rect.height + 4, width: rect.width }}>
        <span>
          <strong>{label}</strong>{count > 0 && <span className="muted"> of {count}</span>}
          {' · '}{painting.artist} · {painting.year}
        </span>
        {count > 1 && <button className="load-more" onClick={() => step(-1)} aria-label="‹">‹</button>}
        {count > 1 && <button className="load-more" onClick={() => step(1)} aria-label="›">›</button>}
        {count > 1 && <button className="load-more" onClick={random}>Random</button>}
        <Link to={`/token/${painting.slug}`}>Project page</Link>
        {hasRunner && src && (
          <button className="link-button" onClick={() => setRaw((r) => !r)}>
            {raw ? 'put the compatibility script back' : "run the artist's file untouched"}
          </button>
        )}
        <button className="load-more" onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
