// Turns gallery.json into vertex buffers. Everything is merged by hand into flat
// arrays — a quad is six vertices — so the whole building is a handful of draw
// calls and nothing from three/examples is needed.

import { BufferGeometry, Float32BufferAttribute } from 'three'
import type { AtlasMeta, Painting, Room, Sign, Wall } from './types'
import { PAINTING, EYE_Y, WALL_T, WALL_H } from './constants'

export interface TileUv { u0: number; u1: number; v0: number; v1: number }
const FULL: TileUv = { u0: 0, u1: 1, v0: 0, v1: 1 }

type Vec = [number, number, number]

/**
 * Where a tile's image sits in its atlas, as texture coordinates. Textures load
 * with flipY, so the image's top row is v = 1 — `v1` is the top edge. The gutter
 * is excluded: it exists for the sampler, not for the quad.
 */
export function tileUv(tile: number, atlas: AtlasMeta): TileUv {
  const perFile = atlas.cols * atlas.cols
  const i = tile % perFile
  const col = i % atlas.cols
  const row = Math.floor(i / atlas.cols)
  const cell = atlas.tile + 2 * atlas.gutter
  const u0 = (col * cell + atlas.gutter) / atlas.size
  const top = (row * cell + atlas.gutter) / atlas.size
  const span = atlas.tile / atlas.size
  return { u0, u1: u0 + span, v0: 1 - top - span, v1: 1 - top }
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

  /**
   * A quad from its centre and half-extent vectors, facing `normal`. Corners wind
   * counter-clockwise as seen from the front, which is what three.js culls by.
   */
  quad(c: Vec, right: Vec, up: Vec, normal: Vec, uv: TileUv = FULL): void {
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
  }

  /** An axis-aligned box from its centre and half-extents. */
  box(cx: number, cy: number, cz: number, hx: number, hy: number, hz: number): void {
    this.quad([cx + hx, cy, cz], [0, 0, -hz], [0, hy, 0], [1, 0, 0])
    this.quad([cx - hx, cy, cz], [0, 0, hz], [0, hy, 0], [-1, 0, 0])
    this.quad([cx, cy, cz + hz], [hx, 0, 0], [0, hy, 0], [0, 0, 1])
    this.quad([cx, cy, cz - hz], [-hx, 0, 0], [0, hy, 0], [0, 0, -1])
    this.quad([cx, cy + hy, cz], [hx, 0, 0], [0, 0, -hz], [0, 1, 0])
    this.quad([cx, cy - hy, cz], [hx, 0, 0], [0, 0, hz], [0, -1, 0])
  }

  build(): BufferGeometry {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(this.positions, 3))
    g.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    g.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
    return g
  }
}

/** One quad per painting whose tile lives in atlas `file`, UV-mapped into its tile. */
export function buildPaintingGeometry(paintings: Painting[], atlas: AtlasMeta, file: number): BufferGeometry {
  const m = new MeshArrays()
  for (const p of paintings) {
    if (atlasFile(p.tile, atlas) !== file) continue
    m.quad([p.x, EYE_Y, p.z], scale(rightOf(p), PAINTING / 2), [0, PAINTING / 2, 0], normalOf(p), tileUv(p.tile, atlas))
  }
  return m.build()
}

/** A dark quad 0.06 proud of the painting on every side, halfway between it and the wall. */
export function buildFrameGeometry(paintings: Painting[]): BufferGeometry {
  const m = new MeshArrays()
  const half = PAINTING / 2 + 0.06
  for (const p of paintings) {
    const n = normalOf(p)
    m.quad([p.x - n[0] * 0.01, EYE_Y, p.z - n[2] * 0.01], scale(rightOf(p), half), [0, half, 0], n)
  }
  return m.build()
}

/**
 * Every segment as a box WALL_T thick, lengthened by half a thickness at each end
 * so two walls meeting at a corner close it instead of leaving a notch.
 */
export function buildWallGeometry(walls: Wall[]): BufferGeometry {
  const m = new MeshArrays()
  for (const w of walls) {
    m.box(
      (w.x1 + w.x2) / 2, (w.y0 + w.y1) / 2, (w.z1 + w.z2) / 2,
      Math.abs(w.x2 - w.x1) / 2 + WALL_T / 2, (w.y1 - w.y0) / 2, Math.abs(w.z2 - w.z1) / 2 + WALL_T / 2,
    )
  }
  return m.build()
}

/** A floor at y = 0 facing up and a ceiling at WALL_H facing down, per room. */
export function buildFloorGeometry(rooms: Room[]): BufferGeometry {
  const m = new MeshArrays()
  for (const { rect } of rooms) {
    const cx = rect.x + rect.w / 2
    const cz = rect.z + rect.d / 2
    m.quad([cx, 0, cz], [rect.w / 2, 0, 0], [0, 0, -rect.d / 2], [0, 1, 0])
    m.quad([cx, WALL_H, cz], [rect.w / 2, 0, 0], [0, 0, rect.d / 2], [0, -1, 0])
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
