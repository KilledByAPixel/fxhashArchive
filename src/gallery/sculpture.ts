// Sculpture on plinths, for the one room big enough to have empty floor in it.
//
// The 20 m room reads as a field with pictures round the edge, so nine chamfered
// plinths stand in a 3 x 3 grid in the middle of it, each carrying a small object
// generated from a seed. Two generators, checkerboarded so neither clusters: a
// lathe VASE turned from a couple of sine curves, and a TERRACE — a square
// repeatedly quartered, each quarter nudged up or down by half as much as the
// last, which is the subdivided cube.
//
// Low poly and one draw call, both deliberate. Low poly means flat shading is the
// look rather than a compromise, so nothing here needs the smooth per-vertex
// normals a finer lathe would; a twelve-sided vase is meant to read as facets.
// One draw call means plinths and sculptures share a single material and tell
// themselves apart with vertex colours — the same attribute the walls use for
// their paint. Eighteen objects come to roughly three thousand triangles.
//
// The seeds are the room's own art: each plinth takes the fxhash project id of
// one of the pieces hanging around it, so the objects are generated from the
// work on the walls, and the room's contents are stable as long as its art is.

import { BufferGeometry, Color } from 'three'
import type { Gallery, Room } from './types'
import { MeshArrays, type Rgb } from './geometry'
import type { Obstacle } from './collide'

/** A room needs a shorter side this long before it gets sculpture: only the 20 m one does. */
export const SCULPTURE_MIN_SIDE = 12
/** Plinths per side of the grid. Nine of them: five vases, four terraces. */
export const GRID = 3
/** Metres between plinth centres. At 5 m on a 20 m room, 5 m stays clear to every wall. */
export const GRID_SPACING = 5

export const PLINTH_SIDE = 0.9
export const PLINTH_H = 0.9
/** How much is cut off the plinth's top edge. Enough to catch the light, not a bevelled cube. */
const CHAMFER = 0.07
/** Tallest a sculpture stands above its plinth: tops out near eye height. */
const SCULPTURE_H = 0.7

/** Plinth stone: a shade off the wall, so it reads as an object and not a growth. */
export const PLINTH_COLOR = 0xb9b3a9
/** The work itself, in plaster — lighter than its plinth so it carries. */
export const SCULPTURE_COLOR = 0xe4e1d9

const VASE_RADIAL = 12
const VASE_RINGS = 10
const VASE_R = 0.3
const TERRACE_DEPTH = 3
const TERRACE_SIDE = 0.62

export interface Plinth {
  x: number
  z: number
  seed: number
  kind: 'vase' | 'terrace'
}

/**
 * Deterministic, so a seed is the same object forever — including across a
 * rebuild, since the seeds are project ids and not positions.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const between = (rand: () => number, lo: number, hi: number) => lo + rand() * (hi - lo)

/**
 * Where the plinths stand and what each one carries.
 *
 * The rule is a size, not a name: any solo room whose shorter side reaches
 * SCULPTURE_MIN_SIDE. Only KilledByAPixel's qualifies today, and a rule
 * generalises where naming one artist in the source would not.
 */
export function plinths(gallery: Gallery): Plinth[] {
  const out: Plinth[] = []
  for (const room of gallery.rooms) {
    if (room.kind !== 'solo') continue
    if (Math.min(room.rect.w, room.rect.d) < SCULPTURE_MIN_SIDE) continue
    const seeds = seedsFor(gallery, room, GRID * GRID)
    const cx = room.rect.x + room.rect.w / 2
    const cz = room.rect.z + room.rect.d / 2
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        out.push({
          x: cx + (col - (GRID - 1) / 2) * GRID_SPACING,
          z: cz + (row - (GRID - 1) / 2) * GRID_SPACING,
          seed: seeds[row * GRID + col],
          // Checkerboard: the corners and the centre are vases, the edges terraces.
          kind: (row + col) % 2 === 0 ? 'vase' : 'terrace',
        })
      }
    }
  }
  return out
}

/** `n` project ids spread evenly through the room's own art, or 1..n if it has none. */
function seedsFor(gallery: Gallery, room: Room, n: number): number[] {
  const mine = gallery.paintings.filter((p) => p.room === room.id).map((p) => p.project).sort((a, b) => a - b)
  return Array.from({ length: n }, (_, i) => (mine.length ? mine[Math.floor((i * mine.length) / n)] : i + 1))
}

/** Circles for the collider: plinths are objects in open floor, not wall segments. */
export function plinthObstacles(list: Plinth[]): Obstacle[] {
  // The footprint is a square; a circle through its corners would stop you a
  // hand's width short of the faces, which reads as bumping into nothing.
  const r = PLINTH_SIDE / 2
  return list.map((p) => ({ x: p.x, z: p.z, r }))
}

export function buildSculptureGeometry(list: Plinth[]): BufferGeometry {
  const m = new MeshArrays()
  const asLinear = (hex: number): Rgb => {
    const c = new Color(hex)
    return [c.r, c.g, c.b]
  }
  const stone = asLinear(PLINTH_COLOR)
  const plaster = asLinear(SCULPTURE_COLOR)
  for (const p of list) {
    plinth(m, p.x, p.z, stone)
    const rand = mulberry32(p.seed)
    if (p.kind === 'vase') vase(m, p.x, PLINTH_H, p.z, rand, plaster)
    else terrace(m, p.x, PLINTH_H, p.z, rand, plaster)
  }
  return m.build()
}

/**
 * A box with its top edge cut off: four sides up to the chamfer, four bands
 * leaning in to the inset top, four triangles closing the corners between them,
 * and a lid. The underside is built too — it is never seen directly, but the
 * floor mirror looks at the room from below and would otherwise see straight
 * through into an open box.
 */
function plinth(m: MeshArrays, cx: number, cz: number, color: Rgb): void {
  const h = PLINTH_SIDE / 2
  const i = h - CHAMFER          // half-width of the inset top
  const y = PLINTH_H - CHAMFER   // where the sides stop and the chamfer starts
  const s: Array<[number, number]> = [[1, 1], [-1, 1], [-1, -1], [1, -1]]   // corners, counter-clockwise from above
  for (let k = 0; k < 4; k++) {
    const [ax, az] = s[k]
    const [bx, bz] = s[(k + 1) % 4]
    // The side, full width, floor to the chamfer.
    m.face([ax * h, 0, az * h], [bx * h, 0, bz * h], [bx * h, y, bz * h], [ax * h, y, az * h], color)
    // The chamfer band, leaning in to the lid.
    m.face([ax * h, y, az * h], [bx * h, y, bz * h], [bx * i, PLINTH_H, bz * i], [ax * i, PLINTH_H, az * i], color)
    // The corner it leaves open, as a triangle.
    m.face([ax * h, y, az * h], [ax * i, PLINTH_H, az * i], [ax * i, PLINTH_H, az * i], [ax * h, y, az * h], color)
  }
  // Lid and underside.
  m.face([-i, PLINTH_H, i], [i, PLINTH_H, i], [i, PLINTH_H, -i], [-i, PLINTH_H, -i], color)
  m.face([-h, 0, -h], [h, 0, -h], [h, 0, h], [-h, 0, h], color)
  translate(m, cx, cz)
}

/**
 * Move everything written since the last call to sit at (cx, cz). The generators
 * all build about the origin, which keeps their arithmetic readable; this is
 * cheaper than threading an offset through every corner of every face.
 */
function translate(m: MeshArrays, cx: number, cz: number): void {
  m.shift(cx, 0, cz)
}

/**
 * A lathe. The radius along the height is a constant plus two sines — the couple
 * of curves that make it a vase rather than a cylinder — clamped so it can never
 * pinch through itself, tapered to a foot at the bottom and closed with a small
 * lid at the top, because an open mouth on a single-sided material is a hole you
 * can see through.
 */
function vase(m: MeshArrays, cx: number, y0: number, cz: number, rand: () => number, color: Rgb): void {
  const a1 = between(rand, 0.10, 0.22)
  const f1 = between(rand, 0.6, 1.3)
  const p1 = between(rand, 0, Math.PI * 2)
  const a2 = between(rand, 0.04, 0.12)
  const f2 = between(rand, 1.6, 3.0)
  const p2 = between(rand, 0, Math.PI * 2)
  const height = between(rand, 0.5, SCULPTURE_H)
  const profile = (t: number) => {
    const r = VASE_R * (0.55 + a1 * Math.sin(2 * Math.PI * f1 * t + p1) + a2 * Math.sin(2 * Math.PI * f2 * t + p2))
    // A foot at the bottom and a closed shoulder at the top, so it stands on the
    // plinth and does not end in a rim.
    const ends = Math.min(1, t / 0.08) * Math.min(1, (1 - t) / 0.06 + 0.35)
    return Math.max(0.03, r * ends)
  }
  const at = (ring: number, seg: number): [number, number, number] => {
    const t = ring / VASE_RINGS
    const a = (seg / VASE_RADIAL) * Math.PI * 2
    const r = profile(t)
    return [Math.cos(a) * r, y0 + t * height, Math.sin(a) * r]
  }
  for (let ring = 0; ring < VASE_RINGS; ring++) {
    for (let seg = 0; seg < VASE_RADIAL; seg++) {
      const next = (seg + 1) % VASE_RADIAL
      m.face(at(ring, next), at(ring, seg), at(ring + 1, seg), at(ring + 1, next), color)
    }
  }
  // Lid: a fan of triangles over the top ring.
  const topY = y0 + height
  const topR = profile(1)
  for (let seg = 0; seg < VASE_RADIAL; seg++) {
    const next = (seg + 1) % VASE_RADIAL
    const a = (seg / VASE_RADIAL) * Math.PI * 2
    const b = (next / VASE_RADIAL) * Math.PI * 2
    const apex: [number, number, number] = [0, topY, 0]
    m.face(
      [Math.cos(a) * topR, topY, Math.sin(a) * topR],
      [Math.cos(b) * topR, topY, Math.sin(b) * topR],
      apex, apex, color,
    )
  }
  translate(m, cx, cz)
}

/**
 * The subdivided cube: a square quartered again and again, each quarter's height
 * nudged up or down by half as much as its parent's was, which leaves a terrace
 * of blocks agreeing with their neighbours at the coarse scale and arguing at the
 * fine one.
 *
 * Drawn as a heightfield rather than as boxes: one lid per cell, and a wall
 * between two cells only where one is taller than the other. That halves the
 * triangles and, more to the point, means no face is ever built inside the solid.
 */
function terrace(m: MeshArrays, cx: number, y0: number, cz: number, rand: () => number, color: Rgb): void {
  const n = 1 << TERRACE_DEPTH
  const h: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  const quarter = (x: number, z: number, size: number, base: number, amp: number) => {
    if (size === 1) { h[z][x] = base; return }
    const half = size / 2
    for (const [dx, dz] of [[0, 0], [half, 0], [0, half], [half, half]]) {
      quarter(x + dx, z + dz, half, base + (rand() * 2 - 1) * amp, amp / 2)
    }
  }
  quarter(0, 0, n, 1, 0.55)
  // Normalise into [0.2, 1] of the sculpture height, so one unlucky draw cannot
  // make a flat slab or a spike.
  let lo = Infinity, hi = -Infinity
  for (const row of h) for (const v of row) { lo = Math.min(lo, v); hi = Math.max(hi, v) }
  const span = hi - lo || 1
  const height = (x: number, z: number) =>
    x < 0 || z < 0 || x >= n || z >= n ? 0 : (0.2 + 0.8 * ((h[z][x] - lo) / span)) * SCULPTURE_H

  const cell = TERRACE_SIDE / n
  const edge = (i: number) => -TERRACE_SIDE / 2 + i * cell
  for (let z = 0; z < n; z++) {
    for (let x = 0; x < n; x++) {
      const y = y0 + height(x, z)
      const x0 = edge(x), x1 = edge(x + 1), z0 = edge(z), z1 = edge(z + 1)
      m.face([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], color)
      // One skirt per side, dropping only as far as the neighbour it faces, and
      // only where this cell is the taller of the two.
      const sides: Array<[number, number, [number, number, number], [number, number, number]]> = [
        [x + 1, z, [x1, 0, z0], [x1, 0, z1]],
        [x - 1, z, [x0, 0, z1], [x0, 0, z0]],
        [x, z + 1, [x1, 0, z1], [x0, 0, z1]],
        [x, z - 1, [x0, 0, z0], [x1, 0, z0]],
      ]
      for (const [nx, nz, a, b] of sides) {
        const below = y0 + height(nx, nz)
        if (below >= y) continue
        m.face([a[0], below, a[2]], [b[0], below, b[2]], [b[0], y, b[2]], [a[0], y, a[2]], color)
      }
    }
  }
  translate(m, cx, cz)
}
