// src/gallery/engine.ts
// The part that touches the DOM and the clock: a renderer on the canvas, a frame
// loop, input, raycasting, and the glide from wherever you are to square in front
// of a painting. Everything it decides comes from the tested modules it imports;
// this file only sequences them. React never reaches in — it gets events out.

import {
  ACESFilmicToneMapping, Mesh, PerspectiveCamera, Plane, PMREMGenerator, Raycaster, Texture,
  Vector2, Vector3, WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import type { Quality } from './load'
import type { Gallery, Painting, Pose, Room, Wall } from './types'
import { buildScene, hidden, type BuiltScene } from './scene'
import { makeLabelTexture } from './labels'
import { solidWalls, type Point } from './collide'
import {
  emptyKeys, fromPose, integrate, keyFor, look, toPose, walkToward, type Keys, type PlayerState,
} from './controls'
import { applyPose, easeInOut, lerpPose, projectedRect, viewingPose, type ScreenRect } from './approach'
import { CAPTION_RANGE, FOV, GLIDE_MS } from './constants'

export type Mode = 'walk' | 'glide' | 'view'

export interface EngineEvents {
  onHover(p: Painting | null): void
  onRoom(room: Room | null): void
  onLock(locked: boolean): void
  onMode(mode: Mode): void
  /** Arrived at the viewing pose; `rect` is where the painting is on screen, in CSS pixels. */
  onArrive(p: Painting, rect: ScreenRect): void
}

interface Glide { from: Pose; to: Pose; fromPitch: number; start: number; painting: Painting }
interface Touch { id: number; x: number; y: number; startX: number; startY: number; start: number; moved: boolean }

const TAP_MS = 300
const TAP_PX = 10
const TOUCH_LOOK = 0.004
const FLOOR = new Plane(new Vector3(0, 1, 0), 0)

export class GalleryEngine {
  private renderer: WebGLRenderer
  private camera: PerspectiveCamera
  private built: BuiltScene
  private walls: Wall[]
  private state: PlayerState
  private keys: Keys = emptyKeys()
  private mode: Mode = 'walk'
  private glide: Glide | null = null
  private walkTarget: Point | null = null
  private viewing: Painting | null = null
  private hovered: Painting | null = null
  private room: Room | null = null
  private touch: Touch | null = null
  private raycaster = new Raycaster()
  private readonly centerNdc = new Vector2(0, 0)
  private raf = 0
  private last = 0
  private labelTexture: Texture | null
  private cleanup: Array<() => void> = []
  private environment: Texture | null = null
  private composer: EffectComposer | null = null
  private quality: Quality

  constructor(
    private canvas: HTMLCanvasElement,
    private gallery: Gallery,
    private atlases: (Texture | null)[],
    small: boolean,
    quality: Quality,
    private events: EngineEvents,
  ) {
    this.quality = quality
    this.renderer = new WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // Filmic tone mapping for the room; the art opts out (toneMapped: false) and
    // stays the pixels the artist's program produced.
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.camera = new PerspectiveCamera(FOV, 1, 0.1, 200)
    const labels = makeLabelTexture(gallery.signs, small ? 2048 : 4096)
    this.labelTexture = labels?.texture ?? null
    this.built = buildScene(gallery, atlases, labels)
    // A generic lit room as the environment: what the polished floor reflects
    // and what fills in the walls' shading between the lights.
    const pmrem = new PMREMGenerator(this.renderer)
    this.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.built.scene.environment = this.environment
    this.built.scene.environmentIntensity = 0.5
    this.setQuality(quality)
    this.walls = solidWalls(gallery.walls)
    this.state = fromPose(gallery.spawn)
    this.listen()
  }

  start(pose: Pose): void {
    this.state = fromPose(pose)
    this.resize()
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Glide to the viewing pose. Pointer lock goes first: the piece needs the mouse. */
  approach(p: Painting): void {
    if (this.mode !== 'walk') return
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.walkTarget = null
    this.keys = emptyKeys()
    this.setHovered(null)
    this.glide = {
      from: toPose(this.state), to: viewingPose(p, FOV, this.camera.aspect),
      fromPitch: this.state.pitch, start: performance.now(), painting: p,
    }
    this.setMode('glide')
  }

  /** Back to walking, from where the viewing pose left the camera. Does not re-lock: that needs a gesture. */
  leaveView(): void {
    if (this.mode !== 'view') return
    this.viewing = null
    this.setMode('walk')
  }

  teleport(pose: Pose): void {
    this.viewing = null
    this.glide = null
    this.walkTarget = null
    this.state = fromPose(pose)
    this.setMode('walk')
  }

  /**
   * Rebuild the render path for a quality level. 'low' renders straight; 'high'
   * composes ambient occlusion and anti-aliasing; 'ultra' renders through
   * SSRPass instead of a plain RenderPass — it carries its own beauty pass and
   * paints the room's reflection onto the floor — and then the occlusion and
   * anti-aliasing exactly as 'high' does, so turning reflections on adds them
   * rather than trading the occlusion away.
   */
  setQuality(quality: Quality): void {
    this.quality = quality
    this.built.scene.traverse((o) => { if ((o as Mesh).isMesh && (o as Mesh).material) ((o as Mesh).material as { needsUpdate: boolean }).needsUpdate = true })
    this.composer?.dispose()
    this.composer = null
    if (quality === 'low') return
    const w = Math.max(1, this.canvas.clientWidth)
    const h = Math.max(1, this.canvas.clientHeight)
    const composer = new EffectComposer(this.renderer)
    if (quality === 'ultra') {
      // `selects` names the surfaces that reflect, not what they show: the floor
      // alone. (The first build listed the paintings and walls here — the things
      // meant to appear in the reflection — and so nothing reflected at all.)
      const ssr = new SSRPass({ renderer: this.renderer, scene: this.built.scene, camera: this.camera, width: w, height: h, groundReflector: null, selects: [this.built.floorsMesh] })
      ssr.opacity = 0.4
      ssr.maxDistance = 10   // metres of ray: a wall's pictures reach the floor a few metres out
      composer.addPass(ssr)
    } else {
      composer.addPass(new RenderPass(this.built.scene, this.camera))
    }
    // The occlusion pass takes its own depth and normals from the scene, and the
    // signs were in them: each quad's silhouette darkened the plaster behind it,
    // drawing a faint outline around every name and every plaque. They are out
    // of it now — the beauty pass has already drawn them, so the pass only needs
    // them gone while it measures the room.
    const gtao = new GTAOPass(this.built.scene, this.camera, w, h)
    const takeAo = gtao.render.bind(gtao)
    const signs = this.built.signsMesh
    gtao.render = (...args: Parameters<typeof takeAo>) => hidden(signs, () => takeAo(...args))
    composer.addPass(gtao)
    composer.addPass(new SMAAPass())
    composer.addPass(new OutputPass())
    this.composer = composer
  }

  /** Reflections on the floor: 'ultra' on, back to 'high' off. A 'low' device stays plain. */
  setReflections(on: boolean): void {
    if (this.quality === 'low') return
    this.setQuality(on ? 'ultra' : 'high')
  }

  requestLock(): void {
    // In Chrome this returns a promise that rejects if called again during the
    // ~1s cooldown after Escape released the lock; @types/three's lib.dom types it
    // as void, so the cast is only to reach the promise and swallow that rejection.
    void (this.canvas.requestPointerLock?.() as unknown as Promise<void> | undefined)?.catch?.(() => {})
  }

  resize(): void {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (w === 0 || h === 0) return
    this.renderer.setSize(w, h, false)
    this.composer?.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (this.mode === 'view' && this.viewing) {
      // The viewing distance depends on the aspect, so stand again and tell the overlay.
      this.state = fromPose(viewingPose(this.viewing, FOV, this.camera.aspect))
      applyPose(this.camera, toPose(this.state))
      this.events.onArrive(this.viewing, projectedRect(this.camera, this.viewing, w, h))
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.raf)
    for (const off of this.cleanup) off()
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.composer?.dispose()
    this.built.dispose()
    for (const t of this.atlases) t?.dispose()
    this.labelTexture?.dispose()
    this.environment?.dispose()
    this.renderer.dispose()
    // dispose() frees GL resources but keeps the context alive; without this, the
    // canvas holds one of the browser's few live WebGL contexts until it is GC'd,
    // which does not happen soon enough to survive visiting the gallery a few times.
    this.renderer.forceContextLoss()
  }

  // ---- frame loop ----

  private frame = (now: number): void => {
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now

    if (this.mode === 'walk') {
      this.state = integrate(this.state, this.keys, dt, this.walls)
      if (this.walkTarget) {
        const r = walkToward(this.state, this.walkTarget, dt, this.walls)
        this.state = r.state
        if (r.arrived) this.walkTarget = null
      }
      applyPose(this.camera, toPose(this.state), this.state.pitch)
      this.setHovered(this.paintingAt(this.centerNdc, CAPTION_RANGE))
    } else if (this.mode === 'glide' && this.glide) {
      const g = this.glide
      const t = easeInOut(Math.min(1, (now - g.start) / GLIDE_MS))
      applyPose(this.camera, lerpPose(g.from, g.to, t), g.fromPitch * (1 - t))
      if (t >= 1) {
        this.state = fromPose(g.to)
        this.viewing = g.painting
        this.glide = null
        this.setMode('view')
        this.events.onArrive(g.painting, projectedRect(this.camera, g.painting, this.canvas.clientWidth, this.canvas.clientHeight))
      }
    }

    this.setRoom(this.gallery.rooms.find((r) =>
      this.state.x >= r.rect.x && this.state.x <= r.rect.x + r.rect.w &&
      this.state.z >= r.rect.z && this.state.z <= r.rect.z + r.rect.d) ?? null)


    if (this.composer) this.composer.render()
    else this.renderer.render(this.built.scene, this.camera)
    this.raf = requestAnimationFrame(this.frame)
  }

  // ---- picking ----

  /**
   * The painting under a screen point (NDC), within `range` metres, or null.
   *
   * Walls are cast against too, purely to block: without them a painting in the
   * next room over could still be picked (and approached) straight through the
   * wall between. intersectObjects sorts by distance, so if the wall is nearer
   * than every painting it wins the hit and no painting is returned.
   */
  private paintingAt(ndc: Vector2, range = Infinity): Painting | null {
    this.raycaster.setFromCamera(ndc, this.camera)
    this.raycaster.far = range
    const hit = this.raycaster.intersectObjects([...this.built.paintingMeshes, this.built.wallsMesh], false)[0]
    if (!hit || hit.faceIndex === undefined) return null
    const f = this.built.paintingMeshes.indexOf(hit.object as Mesh)
    if (f === -1) return null   // nearest hit was the wall, not a painting
    return this.built.paintingIndex[f]?.[Math.floor(hit.faceIndex! / 2)] ?? null
  }

  private floorAt(ndc: Vector2): Point | null {
    this.raycaster.setFromCamera(ndc, this.camera)
    this.raycaster.far = Infinity
    const p = new Vector3()
    return this.raycaster.ray.intersectPlane(FLOOR, p) ? { x: p.x, z: p.z } : null
  }

  private ndcOf(clientX: number, clientY: number): Vector2 {
    const r = this.canvas.getBoundingClientRect()
    return new Vector2(((clientX - r.left) / r.width) * 2 - 1, -(((clientY - r.top) / r.height) * 2 - 1))
  }

  // ---- events out, deduplicated ----

  private setHovered(p: Painting | null): void {
    if (p?.project === this.hovered?.project) return
    this.hovered = p
    this.events.onHover(p)
  }

  private setRoom(r: Room | null): void {
    if (r?.id === this.room?.id) return
    this.room = r
    this.events.onRoom(r)
  }

  private setMode(m: Mode): void {
    if (m === this.mode) return
    this.mode = m
    this.events.onMode(m)
  }

  // ---- input ----

  private get locked(): boolean {
    return document.pointerLockElement === this.canvas
  }

  private listen(): void {
    const on = <K extends keyof DocumentEventMap>(target: Document, type: K, fn: (e: DocumentEventMap[K]) => void) => {
      target.addEventListener(type, fn)
      this.cleanup.push(() => target.removeEventListener(type, fn))
    }
    const onWin = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) => {
      window.addEventListener(type, fn)
      this.cleanup.push(() => window.removeEventListener(type, fn))
    }
    const onCanvas = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      this.canvas.addEventListener(type, fn)
      this.cleanup.push(() => this.canvas.removeEventListener(type, fn))
    }

    // Mouse. Unlocked, a click only locks; locked, it approaches what the crosshair is on.
    onCanvas('click', (e) => {
      if ((e as MouseEvent & { pointerType?: string }).pointerType === 'touch') return
      if (this.mode === 'view') { this.leaveView(); this.requestLock(); return }
      if (this.mode !== 'walk') return
      if (this.locked && this.hovered) this.approach(this.hovered)
      else if (!this.locked) this.requestLock()
    })
    on(document, 'pointerlockchange', () => this.events.onLock(this.locked))
    on(document, 'mousemove', (e) => {
      if (this.locked && this.mode === 'walk') this.state = look(this.state, e.movementX, e.movementY)
    })

    // Keys. While viewing, a move key is the way out; the overlay owns arrows and Escape.
    onWin('keydown', (e) => {
      // Enter on a HUD control (the Rooms button, say) must only activate that
      // control, not also approach whatever the crosshair happens to be on.
      if (
        e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) return
      const k = keyFor(e.code)
      if (this.mode === 'view') {
        if (k && k !== 'run' && !e.code.startsWith('Arrow')) this.leaveView()
        return
      }
      if (this.mode !== 'walk') return
      if ((e.code === 'Enter' || e.code === 'KeyE') && this.hovered) { this.approach(this.hovered); return }
      if (!k) return
      this.keys[k] = true
      this.walkTarget = null
      if (e.code.startsWith('Arrow')) e.preventDefault()
    })
    onWin('keyup', (e) => {
      const k = keyFor(e.code)
      if (k) this.keys[k] = false
    })
    onWin('blur', () => { this.keys = emptyKeys() })

    // Touch: drag looks, a tap on the floor walks there, a tap on a painting approaches it.
    onCanvas('pointerdown', (e) => {
      if (e.pointerType !== 'touch' || this.touch) return
      this.touch = { id: e.pointerId, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, start: performance.now(), moved: false }
    })
    onCanvas('pointermove', (e) => {
      const t = this.touch
      if (!t || e.pointerId !== t.id) return
      if (Math.hypot(e.clientX - t.startX, e.clientY - t.startY) > TAP_PX) t.moved = true
      if (t.moved && this.mode === 'walk') this.state = look(this.state, e.clientX - t.x, e.clientY - t.y, TOUCH_LOOK)
      t.x = e.clientX
      t.y = e.clientY
    })
    const endTouch = (e: PointerEvent) => {
      const t = this.touch
      if (!t || e.pointerId !== t.id) return
      this.touch = null
      if (t.moved || performance.now() - t.start > TAP_MS) return
      if (this.mode === 'view') { this.leaveView(); return }
      if (this.mode !== 'walk') return
      const ndc = this.ndcOf(e.clientX, e.clientY)
      const p = this.paintingAt(ndc)
      if (p) { this.approach(p); return }
      this.walkTarget = this.floorAt(ndc)
    }
    onCanvas('pointerup', endTouch)
    onCanvas('pointercancel', endTouch)

    onWin('resize', () => this.resize())
  }
}
