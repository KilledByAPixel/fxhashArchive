import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { REPO_URL } from '../lib/links'
import type { AboutPanel, Room } from './types'
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
  /** The lobby's wall text. No text, no About button — old gallery.json has none. */
  about?: AboutPanel[]
}

/**
 * The little that sits over the canvas. Everything is pointer-events: none except
 * the controls, so the canvas still gets the clicks that lock the pointer.
 */
export default function Hud({ rooms, roomTitle, caption, locked, mode, touch, onTeleport, about }: Props) {
  // Both panels hang off the same corner, so at most one is ever open.
  const [panel, setPanel] = useState<'rooms' | 'about' | null>(null)
  const open = panel === 'rooms'
  /**
   * Whether the visitor has done anything yet. The opening hint stands until
   * they have, then goes for good.
   *
   * On a mouse that is the pointer locking, which is what the first click does.
   * A touch screen never locks the pointer — the engine returns early for a
   * touch pointerType on purpose — so waiting on `locked` there meant waiting
   * forever, and the hint written for touch readers was the one hint no touch
   * reader could dismiss. A tap is the touch equivalent of that first click, and
   * any tap counts: the HUD is pointer-events: none but for its buttons, so the
   * taps that matter land on the canvas and only a window listener sees them.
   */
  const [acted, setActed] = useState(false)
  useEffect(() => { if (locked) setActed(true) }, [locked])
  useEffect(() => {
    if (!touch || acted) return
    const done = () => setActed(true)
    window.addEventListener('pointerdown', done, { once: true })
    return () => window.removeEventListener('pointerdown', done)
  }, [touch, acted])
  // Clicking back into the room takes the mouse pointer, and with it any way to
  // close a panel you left open. So the room closes it for you.
  useEffect(() => { if (locked) setPanel(null) }, [locked])

  const eras = rooms.filter((r) => r.kind === 'era')
  const artists = rooms.filter((r) => r.kind === 'solo').sort((a, b) => a.title.localeCompare(b.title))
  const go = (r: Room) => { onTeleport(r); setPanel(null) }

  return (
    <div className="gallery-hud">
      <div className="gallery-hud-top">
        {/* Where you are, and nothing else. A "← fxhash archive" link used to lead
            here, in the strongest position on the screen, repeating the name of the
            site on every frame of a walk through it — and on a phone it pushed the
            room name off the row entirely. It is in the About panel now. */}
        <span className="gallery-room">{roomTitle}</span>
        <button className="load-more gallery-rooms-button" onClick={() => setPanel((p) => (p === 'rooms' ? null : 'rooms'))} aria-expanded={open}>
          Rooms
        </button>
        {about && about.length > 0 && (
          <button className="load-more gallery-rooms-button" onClick={() => setPanel((p) => (p === 'about' ? null : 'about'))} aria-expanded={panel === 'about'}>
            About
          </button>
        )}
      </div>

      {open && (
        <nav className="gallery-rooms" aria-label="Rooms">
          <h4>Eras</h4>
          <ul>{eras.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
          <h4>Artists</h4>
          <ul>{artists.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
        </nav>
      )}

      {panel === 'about' && about && (
        <aside className="gallery-rooms gallery-about" aria-label="About">
          {about.map((p) => (
            <section key={p.heading}>
              <h4>{p.heading}</h4>
              {/* The lines are broken to fit a 7 m wall; run together they are the
                  sentences they always were. On a touch screen the controls block
                  has its own wording — the wall's copy names keys this reader has
                  none of — and every other block reads the same either way. */}
              <p>{(touch && p.touch ? p.touch : p.lines).join(' ')}</p>
            </section>
          ))}
          {/* The way out of the building. It used to be a link in the top-left
              corner, which spent the best position on the screen saying the same
              thing throughout a walk; here it is out of sight until wanted. In
              place, not a new tab — leaving is the one thing that should. */}
          <p><Link to="/">Leave the gallery for the rest of the archive</Link></p>
          <p><a href={REPO_URL} target="_blank" rel="noreferrer noopener">The source, and the archive behind it</a></p>
        </aside>
      )}

      {mode === 'walk' && locked && <div className="gallery-crosshair" aria-hidden="true" />}
      {mode === 'walk' && caption && <p className="gallery-caption">{caption}</p>}
      {mode === 'walk' && !touch && !locked && <p className="gallery-hint">Click to look around</p>}
      {/* One opening hint each, in the reader's own controls, and both gone the
          moment they do anything. See `acted` for why touch cannot use `locked`. */}
      {mode === 'walk' && !acted && (
        <p className="gallery-hint gallery-hint-bottom">
          {touch
            ? 'Drag to look · tap the floor to walk · tap a painting to see it run'
            : 'WASD to walk · click a painting to see it run'}
        </p>
      )}
    </div>
  )
}
