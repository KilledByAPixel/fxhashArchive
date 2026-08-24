// src/gallery/GalleryView.tsx
// The museum itself. This is the lazy chunk: it is the only place three.js is
// reached from, and it is only imported once GalleryPage has found WebGL.

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadGallery } from '../lib/data'
import LoadError from '../components/LoadError'
import type { Gallery, Painting, Pose, Room } from './types'
import { GalleryEngine, type Mode } from './engine'
import { chooseQuality, chooseSmall, loadAtlases, probeCapabilities } from './load'
import { standingPose, type ScreenRect } from './approach'
import { parseGalleryQuery } from './query'
import Hud from './Hud'
import Viewer from './Viewer'

/** Where a visit begins: in front of the linked painting, inside the linked room, or in the lobby. */
export function spawnFor(gallery: Gallery, search: string): Pose {
  const q = parseGalleryQuery(search)
  const painting = q.project !== undefined ? gallery.paintings.find((p) => p.project === q.project) : undefined
  if (painting) return standingPose(painting)
  const room = q.room ? gallery.rooms.find((r) => r.id === q.room) : undefined
  return room ? room.entry : gallery.spawn
}

export default function GalleryView() {
  const [search] = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GalleryEngine | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [hovered, setHovered] = useState<Painting | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [locked, setLocked] = useState(false)
  const [mode, setMode] = useState<Mode>('walk')
  const [view, setView] = useState<{ painting: Painting; rect: ScreenRect } | null>(null)
  const [reflections, setReflections] = useState(false)
  const [quality, setQuality] = useState<'low' | 'high' | 'ultra'>('low')
  const touch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    loadGallery().then(
      (g) => { if (!cancelled) setGallery(g) },
      () => { if (!cancelled) setStatus('error') },
    )
    return () => { cancelled = true }
  }, [attempt])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!gallery || !canvas) return
    let cancelled = false
    let engine: GalleryEngine | null = null
    ;(async () => {
      try {
        const caps = probeCapabilities()
        const small = chooseSmall(caps.maxTextureSize, Math.min(window.screen.width, window.screen.height))
      const chosen = chooseQuality(touch, caps.maxTextureSize)
      setQuality(chosen)
        const atlases = await loadAtlases(gallery, small, caps.maxAnisotropy)
        if (cancelled) { for (const t of atlases) t?.dispose(); return }
        engine = new GalleryEngine(canvas, gallery, atlases, small, chosen, {
          onHover: setHovered,
          onRoom: setRoom,
          onLock: setLocked,
          onMode: (m) => { setMode(m); if (m !== 'view') setView(null) },
          onArrive: (painting, rect) => setView({ painting, rect }),
        })
        engineRef.current = engine
        engine.start(spawnFor(gallery, `?${search.toString()}`))
        setStatus('ready')
      } catch (err) {
        // WebGLRenderer construction, a shader compile, anything in loadAtlases —
        // all of it can throw. Without this the page is stuck on "Loading…" forever
        // instead of offering the retry LoadError already gives every other view.
        if (!cancelled) {
          console.warn('gallery: failed to start the engine', err)
          setStatus('error')
        }
      }
    })()
    return () => {
      cancelled = true
      engine?.dispose()
      engineRef.current = null
    }
    // The query is read once, when the visit starts; editing the URL later does not teleport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery])

  return (
    <div className="gallery">
      <canvas ref={canvasRef} className="gallery-canvas" />
      {status === 'loading' && <p className="gallery-loading">Loading the gallery…</p>}
      {status === 'error' && (
        <div className="gallery-loading"><LoadError what="the gallery" onRetry={() => setAttempt((a) => a + 1)} /></div>
      )}
      {gallery && status === 'ready' && (
        <Hud
          rooms={gallery.rooms}
          roomTitle={room?.title}
          caption={hovered ? `${hovered.name} — ${hovered.artist}, ${hovered.year}` : null}
          locked={locked}
          mode={mode}
          touch={touch}
          onTeleport={(r) => engineRef.current?.teleport(r.entry)}
          reflections={reflections}
          onReflections={quality === 'low' ? undefined : (on) => { setReflections(on); engineRef.current?.setReflections(on) }}
        />
      )}
      {view && <Viewer painting={view.painting} rect={view.rect} onBack={() => engineRef.current?.leaveView()} />}
    </div>
  )
}
