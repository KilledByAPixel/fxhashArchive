import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Room } from './types'
import type { Mode } from './engine'

interface Props {
  rooms: Room[]
  roomTitle?: string
  /** What the crosshair is on: "Name — Artist, Year", or null. */
  caption: string | null
  locked: boolean
  mode: Mode
  /** A coarse pointer: no pointer lock, different hints. */
  touch: boolean
  onTeleport: (room: Room) => void
}

/**
 * The little that sits over the canvas. Everything is pointer-events: none except
 * the controls, so the canvas still gets the clicks that lock the pointer.
 */
export default function Hud({ rooms, roomTitle, caption, locked, mode, touch, onTeleport }: Props) {
  const [open, setOpen] = useState(false)
  const [everLocked, setEverLocked] = useState(false)
  useEffect(() => { if (locked) setEverLocked(true) }, [locked])

  const eras = rooms.filter((r) => r.kind === 'era')
  const artists = rooms.filter((r) => r.kind === 'solo').sort((a, b) => a.title.localeCompare(b.title))
  const go = (r: Room) => { onTeleport(r); setOpen(false) }

  return (
    <div className="gallery-hud">
      <div className="gallery-hud-top">
        <Link to="/" className="gallery-back">← fxhash archive</Link>
        <span className="gallery-room">{roomTitle}</span>
        <button className="load-more gallery-rooms-button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          Rooms
        </button>
      </div>

      {open && (
        <nav className="gallery-rooms" aria-label="Rooms">
          <h4>Eras</h4>
          <ul>{eras.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
          <h4>Artists</h4>
          <ul>{artists.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
        </nav>
      )}

      {mode === 'walk' && locked && <div className="gallery-crosshair" aria-hidden="true" />}
      {mode === 'walk' && caption && <p className="gallery-caption">{caption}</p>}
      {mode === 'walk' && !touch && !locked && <p className="gallery-hint">Click to look around</p>}
      {mode === 'walk' && touch && !everLocked && (
        <p className="gallery-hint gallery-hint-bottom">Drag to look · tap the floor to walk · tap a painting to see it run</p>
      )}
      {mode === 'walk' && !touch && !everLocked && (
        <p className="gallery-hint gallery-hint-bottom">WASD to walk · click a painting to see it run</p>
      )}
    </div>
  )
}
