// Turns gallery.json into vertex buffers. Everything is merged by hand into flat
// arrays — a quad is six vertices — so the whole building is a handful of draw
// calls and nothing from three/examples is needed.

import { BufferGeometry, Float32BufferAttribute } from 'three'
import type { AtlasMeta, Painting, Room, Sign, Wall } from './types'
import { PAINTING, EYE_Y, WALL_T, WALL_H } from './constants'
import { POOL_W, POOL_H, POOL_BACK } from './pools'

export interface TileUv { u0: number; u1: number; v0: number; v1: number }
const FULL: TileUv = { u0: 0, u1: 1, v0: 0, v1: 1 }

type Vec = [number, number, number]
/** A vertex colour, linear, as three.js consumes a `color` attribute. */
export type Rgb = [number, number, number]
/**
 * What colour a single face of a wall should be, asked per face so that a wall
 * between two rooms can be one colour on the room side and another on the
 * corridor side — they are different faces of the same box. Null means "leave
 * it the material's own colour".
 */
export type FaceColor = (centre: Vec, normal: Vec) => Rgb | null
/**
 * A FaceColor that always paints. The walls are described entirely by their
 * attribute — untinted faces included — so their painter never declines, and
 * saying so spares every caller a null check it would never take.
 */
export type SolidFaceColor = (centre: Vec, normal: Vec) => Rgb

/**
 * Where a tile's image sits in its atlas, as texture coordinates. Textures load
 * with flipY, so the image's top row is v = 1 — `v1` is the top edge. The gutter
 * is excluded: it exists for the sampler, not for the quad.
 */
export function tileUv(tile: number, atlas: AtlasMeta, aspect = 1): TileUv {
  const perFile = atlas.cols * atlas.cols
  const i = tile % perFile
  const col = i % atlas.cols
  const row = Math.floor(i / atlas.cols)
  const cell = atlas.tile + 2 * atlas.gutter
  const u0 = (col * cell + atlas.gutter) / atlas.size
  const top = (row * cell + atlas.gutter) / atlas.size
  const span = atlas.tile / atlas.size
  // The preview was fitted inside its square tile (contain, on black); a wide one
  // leaves black above and below, a tall one either side. Crop to the picture.
  const cropV = aspect >= 1 ? (span * (1 - 1 / aspect)) / 2 : 0
  const cropU = aspect < 1 ? (span * (1 - aspect)) / 2 : 0
  return { u0: u0 + cropU, u1: u0 + span - cropU, v0: 1 - top - span + cropV, v1: 1 - top - cropV }
}

export const atlasFile = (tile: number, atlas: AtlasMeta) => Math.floor(tile / (atlas.cols * atlas.cols))

/** A painting's normal, into the room. */
const normalOf = (p: { yaw: number }): Vec => [Math.sin(p.yaw), 0, Math.cos(p.yaw)]
/** A painting's right as a visitor facing it sees it. */
const rightOf = (p: { yaw: number }): Vec => [Math.cos(p.yaw), 0, -Math.sin(p.yaw)]
const scale = (v: Vec, k: number): Vec => [v[0] * k, v[1] * k, v[2] * k]

export class MeshArrays {
  private positions: number[] = []
  private normals: number[] = []
  private uvs: number[] = []
  private colors: number[] = []
  /** Whether any quad has asked for a colour. Until one does, no attribute is built. */
  private tinted = false

  /**
   * A quad from its centre and half-extent vectors, facing `normal`. Corners wind
   * counter-clockwise as seen from the front, which is what three.js culls by.
   */
  quad(c: Vec, right: Vec, up: Vec, normal: Vec, uv: TileUv = FULL, color: Rgb | null = null): void {
    const at = (sx: number, sy: number): Vec => [
      c[0] + right[0] * sx + up[0] * sy,
      c[1] + right[1] * sx + up[1] * sy,
      c[2] + right[2] * sx + up[2] * sy,
    ]
    const bl = at(-1, -1), br = at(1, -1), tr = at(1, 1), tl = at(-1, 1)
    const verts: Array<[Vec, number, number]> = [
      [bl, uv.u0, uv.v0], [br, uv.u1, uv.v0], [tr, uv.u1, uv.v1],
      [bl, uv.u0, uv.v0], [tr, uv.u1, uv.v1], [tl, uv.u0, uv.v1],
    ]
    for (const [v, u, w] of verts) {
      this.positions.push(...v)
      this.normals.push(...normal)
      this.uvs.push(u, w)
    }
    if (color) {
      // The first coloured quad may arrive after plain ones. Backfill those with
      // white so the attribute lines up with the positions vertex for vertex.
      if (!this.tinted) {
        this.tinted = true
        while (this.colors.length < this.positions.length - 18) this.colors.push(1)
      }
      for (let i = 0; i < 6; i++) this.colors.push(color[0], color[1], color[2])
    } else if (this.tinted) {
      for (let i = 0; i < 6; i++) this.colors.push(1, 1, 1)
    }
  }

  /**
   * An axis-aligned box from its centre and half-extents. `colorOf` is asked once
   * per face, with that face's own centre and outward normal, so the six sides of
   * a wall can differ — which is what lets one merged mesh carry a different
   * colour of paint on each side of the same wall.
   */
  box(cx: number, cy: number, cz: number, hx: number, hy: number, hz: number, colorOf?: FaceColor): void {
    const faces: Array<[Vec, Vec, Vec, Vec]> = [
      [[cx + hx, cy, cz], [0, 0, -hz], [0, hy, 0], [1, 0, 0]],
      [[cx - hx, cy, cz], [0, 0, hz], [0, hy, 0], [-1, 0, 0]],
      [[cx, cy, cz + hz], [hx, 0, 0], [0, hy, 0], [0, 0, 1]],
      [[cx, cy, cz - hz], [-hx, 0, 0], [0, hy, 0], [0, 0, -1]],
      [[cx, cy + hy, cz], [hx, 0, 0], [0, 0, -hz], [0, 1, 0]],
      [[cx, cy - hy, cz], [hx, 0, 0], [0, 0, hz], [0, -1, 0]],
    ]
    for (const [c, right, up, normal] of faces) {
      this.quad(c, right, up, normal, FULL, colorOf ? colorOf(c, normal) : null)
    }
  }

  build(): BufferGeometry {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(this.positions, 3))
    g.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    g.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
    if (this.tinted) {
      while (this.colors.length < this.positions.length) this.colors.push(1)
      g.setAttribute('color', new Float32BufferAttribute(this.colors, 3))
    }
    return g
  }
}

/** One quad per painting whose tile lives in atlas `file`, UV-mapped into its tile. */
export function buildPaintingGeometry(paintings: Painting[], atlas: AtlasMeta, file: number): BufferGeometry {
  const m = new MeshArrays()
  for (const p of paintings) {
    if (atlasFile(p.tile, atlas) !== file) continue
    m.quad([p.x, EYE_Y, p.z], scale(rightOf(p), p.w / 2), [0, p.h / 2, 0], normalOf(p), tileUv(p.tile, atlas, p.w / p.h))
  }
  return m.build()
}

/** A dark quad 0.06 proud of the painting on every side, halfway between it and the wall. */
export function buildFrameGeometry(paintings: Painting[]): BufferGeometry {
  const m = new MeshArrays()
  for (const p of paintings) {
    const n = normalOf(p)
    m.quad([p.x - n[0] * 0.01, EYE_Y, p.z - n[2] * 0.01], scale(rightOf(p), p.w / 2 + 0.06), [0, p.h / 2 + 0.06, 0], n)
  }
  return m.build()
}

/**
 * Every segment as a box WALL_T thick, lengthened by half a thickness at each end
 * so two walls meeting at a corner close it instead of leaving a notch.
 */
export function buildWallGeometry(walls: Wall[], colorOf?: FaceColor): BufferGeometry {
  const m = new MeshArrays()
  for (const w of walls) {
    m.box(
      (w.x1 + w.x2) / 2, (w.y0 + w.y1) / 2, (w.z1 + w.z2) / 2,
      Math.abs(w.x2 - w.x1) / 2 + WALL_T / 2, (w.y1 - w.y0) / 2, Math.abs(w.z2 - w.z1) / 2 + WALL_T / 2,
      colorOf,
    )
  }
  return m.build()
}

/** A floor at y = 0 facing up, per room. Ceilings are their own mesh so they can take their own colour. */
export function buildFloorGeometry(rooms: Room[]): BufferGeometry {
  const m = new MeshArrays()
  for (const { rect } of rooms) {
    m.quad([rect.x + rect.w / 2, 0, rect.z + rect.d / 2], [rect.w / 2, 0, 0], [0, 0, -rect.d / 2], [0, 1, 0])
  }
  return m.build()
}

/** A ceiling facing down, per room, at that room's own height. */
export function buildCeilingGeometry(rooms: Room[]): BufferGeometry {
  const m = new MeshArrays()
  for (const { rect, h } of rooms) {
    m.quad([rect.x + rect.w / 2, h ?? WALL_H, rect.z + rect.d / 2], [rect.w / 2, 0, 0], [0, 0, rect.d / 2], [0, -1, 0])
  }
  return m.build()
}

/**
 * The pool of light behind each painting: a POOL_W × POOL_H quad on the wall,
 * POOL_BACK behind the painting plane — past the frame (0.01 back) and short of
 * the wall face, so it reads as lit wall and never as a glow over the picture.
 */
export function buildPoolGeometry(paintings: Painting[]): BufferGeometry {
  const m = new MeshArrays()
  for (const p of paintings) {
    const n = normalOf(p)
    m.quad([p.x - n[0] * POOL_BACK, EYE_Y, p.z - n[2] * POOL_BACK], scale(rightOf(p), POOL_W / 2), [0, POOL_H / 2, 0], n)
  }
  return m.build()
}

/** Signs as quads of their own size; `uvs[i]` is where sign `i` was drawn in the label atlas. */
export function buildSignGeometry(signs: Sign[], uvs: TileUv[]): BufferGeometry {
  const m = new MeshArrays()
  signs.forEach((s, i) => {
    m.quad([s.x, s.y, s.z], scale(rightOf(s), s.w / 2), [0, s.h / 2, 0], normalOf(s), uvs[i])
  })
  return m.build()
}

/** One strip per this many metres of room width, so wide rooms get a rank of them. */
export const STRIP_SPACING = 6
/** However wide the room, never more than this many strips. */
const STRIP_MAX = 4

/**
 * Strips of light along each room's ceiling: thin white boxes running the long
 * way, a metre short of each end, hung just under that room's own ceiling. The
 * lamps the lighting pretends to have, made visible.
 *
 * There used to be exactly one, on the centreline, whatever the room. That is
 * right for an 8 m corridor and wrong for a 20 m room, which got a single lamp
 * down the middle of a space wide enough for three and read as flat and empty
 * because of it. Rooms narrower than STRIP_SPACING × 2 still get their one.
 */
export function buildLightStripGeometry(rooms: Room[]): BufferGeometry {
  const m = new MeshArrays()
  for (const { rect, h } of rooms) {
    const alongZ = rect.d >= rect.w
    const across = alongZ ? rect.w : rect.d
    const half = (alongZ ? rect.d : rect.w) / 2 - 1
    if (half <= 0) continue
    const y = (h ?? WALL_H) - 0.06
    const n = Math.max(1, Math.min(STRIP_MAX, Math.floor(across / STRIP_SPACING)))
    for (let i = 0; i < n; i++) {
      // Evenly spread across the short axis; a single strip lands on the centreline.
      const off = ((i + 0.5) / n - 0.5) * across
      m.box(
        rect.x + rect.w / 2 + (alongZ ? off : 0), y, rect.z + rect.d / 2 + (alongZ ? 0 : off),
        alongZ ? 0.15 : half, 0.04, alongZ ? half : 0.15,
      )
    }
  }
  return m.build()
}
