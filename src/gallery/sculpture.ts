// Sculpture on plinths, for the one room big enough to have empty floor in it.
//
// The 20 m room reads as a field with pictures round the edge, so nine chamfered
// plinths stand in a 3 x 3 grid in the middle of it, each carrying a small object
// generated from a seed. Two generators, checkerboarded so neither clusters: a
// lathe VASE turned from a couple of sine curves, and a TERRACE — a square
// repeatedly quartered, each quarter nudged up or down by half as much as the
// last, which is the subdivided cube.
//
// Low poly and one draw call, both deliberate. One draw call means plinths and
// sculptures share a single material and tell themselves apart with vertex
// colours — the same attribute the walls use for their paint. Eighteen objects
// come to roughly three thousand triangles.
//
// Shading is split, and on purpose. The plinths and the terrace are flat-shaded,
// because their facets ARE the shape: a terrace of blocks wants every edge to
// read. The vase is smooth-shaded from the analytic normal of a surface of
// revolution, because a vase is a turned thing and twelve visible flats make it
// a prism instead. Low poly is the silhouette, not an excuse to fake the normals.
//
// The seeds are the room's own art: each plinth takes the fxhash project id of
// one of the pieces hanging around it, so the objects are generated from the
// work on the walls, and the room's contents are stable as long as its art is.
// Each object is then coloured by that same piece, so a vase is the colour of
// the picture it came from — which is hanging a few metres away.

import { BufferGeometry } from 'three'
import type { Gallery, Room } from './types'
import { MeshArrays, type Rgb } from './geometry'
import { hsvToRgb255, linear, type Tint } from './palette'
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
/**
 * How much colour a sculpture takes from the piece it was generated from.
 *
 * A wall is a background and wants a wash you would struggle to name. An object
 * at arm's length is the opposite: it wants to be a colour you could name out
 * loud. At 0.4 on near-white plaster this was a pastel you had to be told about;
 * these are glazed, not whitewashed. Set to 0 and they all go back to plaster.
 */
export const SCULPTURE_SAT = 0.95
/**
 * How dark or light an object is allowed to be, independent of its hue.
 *
 * Hue alone gave nine objects at one lightness, which reads as one material in
 * nine flavours. Drawing the value per object is what puts a near-black vase
 * beside a red one and a pale one — the range Frank asked for — while the hue
 * still comes from the picture the object was generated from.
 */
const VALUE_LO = 0.10
const VALUE_HI = 0.92
/**
 * The least saturation a piece with a hue may give its object.
 *
 * `strength` is how dominant a hue was in the thumbnail, and a near-monochrome
 * picture scores very low — four of the nine objects in the room came from
 * pieces at 0.11 to 0.18, which multiplied out to grey however high SCULPTURE_SAT
 * went. An object is a *reading* of its picture, not a copy of it: if the piece
 * has a hue at all, the object wears it properly. Drop this to 0 to go back to
 * letting a washed-out picture make a washed-out vase.
 */
const SAT_MIN = 0.5

/** The smallest a block may be, and the most blocks a terrace may spend. */
export const MIN_BLOCK = 0.078
export const MAX_BLOCKS = 14
/** How far along its side a cut may land: never the middle, never a sliver. */
const SPLIT_LO = 0.1
const SPLIT_HI = 0.9
/** Wall left between neighbouring blocks, so each one reads as its own. */
const BLOCK_GAP = 0.006

const VASE_RADIAL = 12
const VASE_RINGS = 10
const VASE_R = 0.3
export const TERRACE_SIDE = 0.62

export interface Plinth {
  x: number
  z: number
  seed: number
  kind: 'vase' | 'terrace'
  /** The colour of the piece this was generated from; absent leaves it plaster. */
  tint?: Tint
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
    const tintOf = new Map(gallery.paintings.filter((p) => p.tint).map((p) => [p.project, p.tint!]))
    const cx = room.rect.x + room.rect.w / 2
    const cz = room.rect.z + room.rect.d / 2
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const seed = seeds[row * GRID + col]
        out.push({
          x: cx + (col - (GRID - 1) / 2) * GRID_SPACING,
          z: cz + (row - (GRID - 1) / 2) * GRID_SPACING,
          seed,
          // Checkerboard: the corners and the centre are vases, the edges terraces.
          kind: (row + col) % 2 === 0 ? 'vase' : 'terrace',
          // The seed is a project id, so the object is coloured by the very piece
          // it was generated from — which is hanging on a wall a few metres away.
          tint: tintOf.get(seed),
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

/**
 * The colour of one object: the hue of the piece it came from, at a saturation
 * and a lightness of its own.
 *
 * Drawn from a stream of its own rather than the one that shapes it, so changing
 * the palette later does not reshape every vase in the room.
 */
function objectColor(tint: Tint | undefined, seed: number): Rgb {
  if (SCULPTURE_SAT <= 0) return linear(SCULPTURE_COLOR)
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const value = between(rand, VALUE_LO, VALUE_HI)
  // A piece whose thumbnail had no dominant hue is greyscale art, and inventing
  // a colour for it would be making something up about the work. It still varies
  // — in lightness, which is the one thing a greyscale picture does say.
  if (!tint) {
    const v = Math.round(value * 255)
    return linear((v << 16) | (v << 8) | v)
  }
  const sat = Math.min(1, Math.max(SAT_MIN, tint.strength * SCULPTURE_SAT))
  const [r, g, b] = hsvToRgb255(tint.hue, sat, value)
  return linear((r << 16) | (g << 8) | b)
}

/**
 * The room's furniture, in two meshes.
 *
 * Split because the materials genuinely differ: a vase is glazed and holds a
 * highlight, while the plinths are stone and the terraces are cut blocks, and
 * one roughness cannot be both. Two draw calls for eighteen objects is a price
 * worth paying for a vase that looks fired.
 */
export function buildSculptureGeometry(list: Plinth[]): { matte: BufferGeometry; glazed: BufferGeometry } {
  const matte = new MeshArrays()
  const glazed = new MeshArrays()
  // The plinths stay one stone throughout: they are furniture, and nine coloured
  // pedestals under nine coloured objects would be a fight rather than a room.
  const stone = linear(PLINTH_COLOR)
  for (const p of list) {
    plinth(matte, p.x, p.z, stone)
    const color = objectColor(p.tint, p.seed)
    const rand = mulberry32(p.seed)
    if (p.kind === 'vase') vase(glazed, p.x, PLINTH_H, p.z, rand, color)
    else terrace(matte, p.x, PLINTH_H, p.z, rand, color)
  }
  return { matte: matte.build(), glazed: glazed.build() }
}

/**
 * A box with its top edge cut off: four sides up to the chamfer, four bands
 * leaning in to the inset top, and a lid. The underside is built too — it is
 * never seen directly, but the floor mirror looks at the room from below and
 * would otherwise see straight through into an open box.
 */
function plinth(m: MeshArrays, cx: number, cz: number, color: Rgb): void {
  const h = PLINTH_SIDE / 2
  const i = h - CHAMFER          // half-width of the inset top
  const y = PLINTH_H - CHAMFER   // where the sides stop and the chamfer starts
  // Corners, clockwise seen from above — which is what winds each side face
  // outward. Anticlockwise turns the plinth inside out: the lid and the underside
  // are built separately and stay right, so what you see is a box with its walls
  // missing and the inside of the far ones showing through.
  const s: Array<[number, number]> = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
  for (let k = 0; k < 4; k++) {
    const [ax, az] = s[k]
    const [bx, bz] = s[(k + 1) % 4]
    // The side, full width, floor to the chamfer.
    m.face([ax * h, 0, az * h], [bx * h, 0, bz * h], [bx * h, y, bz * h], [ax * h, y, az * h], color)
    // The chamfer band, leaning in to the lid. No corner piece is needed between
    // consecutive bands: inset by the same amount in x and z, each band ends on
    // exactly the edge the next one begins on, so the four of them already close
    // the ring. There used to be a triangle here trying to fill a gap that does
    // not exist, and it was built with two of its corners doubled — no area, no
    // normal, and a NaN waiting for anything that normalises one.
    m.face([ax * h, y, az * h], [bx * h, y, bz * h], [bx * i, PLINTH_H, bz * i], [ax * i, PLINTH_H, az * i], color)
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
  /**
   * The true normal of a surface of revolution, so the vase shades as a turned
   * thing rather than a twelve-sided prism: the outward radial direction, tilted
   * by how fast the profile is opening or closing. The slope is measured rather
   * than differentiated, because `profile` clamps at both ends and a numerical
   * difference does not care where the analytic one would go undefined.
   */
  const normalAt = (ring: number, seg: number): [number, number, number] => {
    const t = ring / VASE_RINGS
    const a = (seg / VASE_RADIAL) * Math.PI * 2
    const d = 1e-4
    const slope = ((profile(Math.min(1, t + d)) - profile(Math.max(0, t - d))) / (Math.min(1, t + d) - Math.max(0, t - d))) / height
    const n: [number, number, number] = [Math.cos(a), -slope, Math.sin(a)]
    const len = Math.hypot(n[0], n[1], n[2]) || 1
    return [n[0] / len, n[1] / len, n[2] / len]
  }
  for (let ring = 0; ring < VASE_RINGS; ring++) {
    for (let seg = 0; seg < VASE_RADIAL; seg++) {
      const next = (seg + 1) % VASE_RADIAL
      m.smoothFace(
        [at(ring, next), at(ring, seg), at(ring + 1, seg), at(ring + 1, next)],
        [normalAt(ring, next), normalAt(ring, seg), normalAt(ring + 1, seg), normalAt(ring + 1, next)],
        color,
      )
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

/** One leaf of the subdivision: a rectangle of the square, and how tall it stands. */
export interface Block {
  x0: number
  z0: number
  x1: number
  z1: number
  /** Raw, in the units the tree walked in; terrace() normalises the set. */
  height: number
}

/**
 * Cut a square into blocks.
 *
 * Not a grid and not a quartering. One cut at a time, across whichever side is
 * longer — which is what keeps the blocks rectangles rather than slivers — at a
 * point drawn between SPLIT_LO and SPLIT_HI of the way along, never the middle.
 * Each cut hands its two halves the parent's height nudged apart, and the nudge
 * halves at every level, so neighbours agree at the coarse scale and argue at
 * the fine one: the finished shape is a picture of the tree that made it.
 *
 * Two limits stop it, whichever comes first — a block too small to cut again,
 * and a budget of blocks. The budget is spent depth first, so an unlucky run of
 * cuts costs the later branches their detail rather than costing the room its
 * frame rate; some sculptures come out coarser on one side, which is the point.
 */
export function subdivide(rand: () => number, side: number): Block[] {
  const out: Block[] = []
  // Every cut turns one block into two, so the tree ends with cuts + 1 blocks.
  // Counting the cuts is what makes the budget exact; counting the blocks already
  // emitted does not, because a depth-first walk has not emitted the ones it is
  // still inside.
  let cuts = 0
  const cut = (x0: number, z0: number, x1: number, z1: number, height: number, amp: number): void => {
    const w = x1 - x0
    const d = z1 - z0
    const long = Math.max(w, d)
    if (long < 2 * MIN_BLOCK || cuts >= MAX_BLOCKS - 1) {
      out.push({ x0, z0, x1, z1, height })
      return
    }
    cuts++
    // Keep the cut far enough from both ends that neither half is under the
    // minimum, then take the drawn fraction wherever it still can go.
    const edge = MIN_BLOCK / long
    const f = Math.min(Math.max(between(rand, SPLIT_LO, SPLIT_HI), edge), 1 - edge)
    const nudge = () => height + (rand() * 2 - 1) * amp
    if (w >= d) {
      const xm = x0 + w * f
      cut(x0, z0, xm, z1, nudge(), amp / 2)
      cut(xm, z0, x1, z1, nudge(), amp / 2)
    } else {
      const zm = z0 + d * f
      cut(x0, z0, x1, zm, nudge(), amp / 2)
      cut(x0, zm, x1, z1, nudge(), amp / 2)
    }
  }
  const h = side / 2
  cut(-h, -h, h, h, 1, 0.55)
  return out
}

/**
 * The subdivided cube, built from those blocks: each one a closed box, standing
 * at its own height, with a hair of wall left between it and its neighbours.
 *
 * Closed boxes rather than a heightfield because the blocks no longer line up on
 * a grid, so there is no neighbour to measure a skirt against; and the gap
 * because two abutting boxes would otherwise share a face exactly, which is a
 * z-fight. The gap earns its keep besides — it is what makes the cuts legible.
 */
function terrace(m: MeshArrays, cx: number, y0: number, cz: number, rand: () => number, color: Rgb): void {
  const blocks = subdivide(rand, TERRACE_SIDE)
  // Normalise into [0.25, 1] of the sculpture height, so one unlucky tree cannot
  // come out a flat slab or a spike.
  let lo = Infinity, hi = -Infinity
  for (const b of blocks) { lo = Math.min(lo, b.height); hi = Math.max(hi, b.height) }
  const span = hi - lo || 1
  const paint = () => color
  for (const b of blocks) {
    const h = (0.25 + 0.75 * ((b.height - lo) / span)) * SCULPTURE_H
    const hx = Math.max(0.002, (b.x1 - b.x0) / 2 - BLOCK_GAP / 2)
    const hz = Math.max(0.002, (b.z1 - b.z0) / 2 - BLOCK_GAP / 2)
    m.box((b.x0 + b.x1) / 2, y0 + h / 2, (b.z0 + b.z1) / 2, hx, h / 2, hz, paint)
  }
  translate(m, cx, cz)
}
