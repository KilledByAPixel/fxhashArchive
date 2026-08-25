// Sculpture on plinths, for the one room big enough to have empty floor in it.
//
// The 20 m room reads as a field with pictures round the edge, so nine chamfered
// plinths stand in a 3 x 3 grid in the middle of it, each carrying a small object
// generated from a seed. Two generators, checkerboarded so neither clusters: a
// lathe VASE turned from a couple of sine curves, and a TERRACE — a square cut
// down after Frank's own Divide By Circle: rectangles split again and again with
// a disc scored through them, packed and domed inside it, scattered outside.
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
import { hsvToRgb255, linear, valueOf, type Tint } from './palette'
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

/**
 * The disc, as a fraction of the square's half-width.
 *
 * Divide By Circle draws this at 0.15 to 0.4 and gets away with it because a
 * print is read whole and head on. A 62 cm object is read obliquely from a metre
 * away, where a disc that small is a dimple rather than a subject, so it is drawn
 * larger here. The same idea at a different viewing distance.
 */
const CIRCLE_LO = 0.35
const CIRCLE_HI = 0.6

/**
 * The smallest a cell may be, according to where it falls.
 *
 * Three sizes rather than one, which is the whole trick: the field outside is
 * coarse, the disc inside is finer, and a cell the circle actually passes through
 * is finer still — that last one is what resolves a curve out of axis-aligned
 * rectangles. Divide By Circle forces the boundary to keep splitting whatever its
 * size and leans on a depth limit to stop it; a floor is the same rule with a
 * bound you can reason about, and it is what keeps the triangle count honest.
 */
const OUTSIDE_MIN = 0.095
const INSIDE_MIN = 0.072
export const EDGE_MIN = 0.022
/**
 * Cells the tree may make, counted whether or not they survive to be built — the
 * ring is cut fine and then thrown away, and it is the most expensive part of the
 * tree. This is a backstop against a pathological run, not the thing that shapes
 * the object: the three minimums above do that, and a terrace usually stops near
 * a hundred cells, well short of this.
 */
export const MAX_CELLS = 160
/** A depth limit as well, for a cell that goes thin instead of small. */
const MAX_DEPTH = 14
/** How far along its side a cut may land: never the middle, never a sliver. */
const SPLIT_LO = 0.1
const SPLIT_HI = 0.9
/** How often a cut takes both axes at once, quartering the cell. */
const QUARTER = 0.3
/**
 * How often a cell's height wanders from its parent's.
 *
 * Divide By Circle runs this at 0.005 across a tree of twenty thousand nodes,
 * which is what gives it plateaus of one height ending in a sudden cliff. This
 * tree has about a hundred nodes; at that rate it would mutate zero times and
 * come out a flat slab, so the rate is raised to buy the effect the constant was
 * there for. Crossing the shoreline always mutates besides, which hands the disc
 * a height family of its own for nothing.
 */
const MUTATE = 0.12
/** How far a height jumps when it does, as a fraction of the range. */
const JUMP_LO = 0.05
const JUMP_HI = 0.25
/**
 * How far a colour channel walks at a mutation, and how far the per-block jitter
 * moves it afterwards.
 *
 * Divide By Circle turns its per-block figure up to 0.15 when the palette is a
 * single colour, on the grounds that the jitter is then the only variation there
 * is. That is exactly the case here — one colour, taken from one painting — so
 * that is the number used.
 */
const SHADE_STEP = 0.25
const SHADE_TREE = 0.22
const SHADE_BLOCK = 0.15
/**
 * The same drift, where it is allowed to reach the hue, in degrees.
 *
 * Divide By Circle moves all three channels equally, which at these amounts is a
 * swing of about fifty degrees. That would break the one thing this room is built
 * on — a sculpture being the colour of the picture hanging six metres from it —
 * so the hue gets a fraction of it: enough that the blocks read as hand mixed,
 * not enough to change what colour the object is.
 */
export const HUE_TREE = 8
export const HUE_BLOCK = 6
/** How much of the field outside the disc is actually built. */
const OUTER_DENSITY = 0.5
/**
 * Wall left between neighbouring blocks, drawn per block rather than fixed, so
 * some sit snug and others stand alone. Wider outside, where the field is loose
 * anyway, than in the disc, which wants to read as one packed mass.
 */
const GAP_LO = 0.004
const GAP_INSIDE_HI = 0.01
const GAP_OUTSIDE_HI = 0.022
/** Height bands, in fractions of SCULPTURE_H: the field, then what the disc adds. */
const FIELD_LO = 0.18
const FIELD_SPAN = 0.35
const DISC_LIFT = 0.15
const DOME = 0.32

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
export interface Hsv { h: number; s: number; v: number }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const wrapHue = (h: number) => ((h % 360) + 360) % 360

/**
 * The object's colour in HSV, which is the space a terrace mutates its blocks in
 * — the same space Divide By Circle mutates in, and the reason this is kept apart
 * from the packed value below.
 *
 * A saturation of zero is the signal that the piece had no dominant hue, and it
 * is load bearing: a terrace reads it and refuses to drift its saturation, so a
 * greyscale picture cannot be handed a colour it never had.
 */
function objectHsv(tint: Tint | undefined, seed: number): Hsv {
  if (SCULPTURE_SAT <= 0) return { h: 0, s: 0, v: valueOf(SCULPTURE_COLOR) }
  const rand = mulberry32(seed ^ 0x9e3779b9)
  const value = between(rand, VALUE_LO, VALUE_HI)
  // A piece whose thumbnail had no dominant hue is greyscale art, and inventing
  // a colour for it would be making something up about the work. It still varies
  // — in lightness, which is the one thing a greyscale picture does say.
  if (!tint) return { h: 0, s: 0, v: value }
  return { h: tint.hue, s: Math.min(1, Math.max(SAT_MIN, tint.strength * SCULPTURE_SAT)), v: value }
}

/** That colour packed for a vertex buffer, which is what a vase wants. */
function objectColor(tint: Tint | undefined, seed: number): Rgb {
  const { h, s, v } = objectHsv(tint, seed)
  const [r, g, b] = hsvToRgb255(h, s, v)
  return linear((r << 16) | (g << 8) | b)
}

/**
 * One step of a colour channel's walk, held in [0, 1].
 *
 * After Divide By Circle's Color.mutate, including the part that is easy to miss:
 * the value is pulled off the rails before it is nudged. A channel sitting at 0
 * or 1 has nowhere to go, and without this the walk quietly dies there.
 */
function wander(v: number, rand: () => number): number {
  const room = Math.min(Math.max(v, SHADE_STEP), 1 - SHADE_STEP)
  return clamp01(room + between(rand, 0, SHADE_STEP) * (rand() < 0.5 ? -1 : 1))
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
    const rand = mulberry32(p.seed)
    if (p.kind === 'vase') vase(glazed, p.x, PLINTH_H, p.z, rand, objectColor(p.tint, p.seed))
    else terrace(matte, p.x, PLINTH_H, p.z, rand, objectHsv(p.tint, p.seed))
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
  /** The raw walk value, in [0, 1]; terrace() turns the set of them into metres. */
  height: number
  /**
   * The colour walk at this leaf, three channels in [0, 1]; terrace() decides
   * what they mean. Kept abstract so that subdivide stays a shape function.
   */
  shade: [number, number, number]
  /** Inside the disc — the packed, domed half of the sculpture. */
  inside: boolean
}

/** Does the disc about the origin reach into this rectangle at all? */
function circleHitsRect(r: number, x0: number, z0: number, x1: number, z1: number): boolean {
  // The rectangle's nearest point to the centre. When the centre is inside the
  // rectangle it is its own nearest point and the distance is zero — the case
  // where the whole disc is swallowed, which is still a hit and still a cell that
  // has to keep cutting.
  const qx = Math.min(Math.max(0, x0), x1)
  const qz = Math.min(Math.max(0, z0), z1)
  return qx * qx + qz * qz < r * r
}

/**
 * Cut a square into blocks, with a circle scored through it.
 *
 * After Divide By Circle, making the same four decisions in the same order. A
 * cell mutates its height, rarely — or always, if it just crossed the shoreline.
 * It takes a minimum size from where it falls. It cuts: both axes at once a third
 * of the time, otherwise one of them, at a point between SPLIT_LO and SPLIT_HI,
 * never the middle. And a cell too small to cut again is built, unless the circle
 * runs through it.
 *
 * That last exclusion is the whole picture. Cells the circle crosses refine to
 * EDGE_MIN and are then dropped, so the curve comes out as a clean ring of
 * nothing dividing two different countries: inside it every cell is built and
 * they dome up, outside it only OUTER_DENSITY of them are and they lie low.
 *
 * Heights come back raw, as a walk in [0, 1]. Turning them into metres is
 * terrace()'s job, because the dome has to be added after the walk is normalised
 * or normalising flattens it.
 */
export function subdivide(rand: () => number, side: number, radius: number): Block[] {
  const out: Block[] = []
  const r2 = radius * radius
  const inside = (x: number, z: number) => x * x + z * z < r2
  // Splitting a cell k ways turns one leaf into k, so it costs k - 1. Counting
  // leaves rather than blocks emitted is what makes the budget exact: a depth
  // first walk has not yet emitted the ones it is still inside, and the ring
  // cells it is about to throw away cost the same to reach as the ones it keeps.
  let leaves = 1

  const cut = (x0: number, z0: number, x1: number, z1: number, height: number, shade: [number, number, number], wasInside: boolean, depth: number): void => {
    const w = x1 - x0
    const d = z1 - z0
    const isInside = inside((x0 + x1) / 2, (z0 + z1) / 2)
    if (rand() < MUTATE || wasInside !== isInside) {
      const jump = between(rand, JUMP_LO, JUMP_HI) * (rand() < 0.5 ? -1 : 1)
      height = Math.min(1, Math.max(0, height + jump))
      // The colour walks at the same moments the height does, which is the whole
      // point of doing it here rather than per block: a plateau and a patch of
      // one colour are the same region of the tree, so their edges land together.
      // Crossing the shoreline mutates as well, and that is what hands the disc a
      // colour family of its own without anyone having to ask for one.
      shade = [wander(shade[0], rand), wander(shade[1], rand), wander(shade[2], rand)]
    }

    const allInside = inside(x0, z0) && inside(x1, z0) && inside(x1, z1) && inside(x0, z1)
    const onTheLine = !allInside && circleHitsRect(radius, x0, z0, x1, z1)
    const min = onTheLine ? EDGE_MIN : allInside ? INSIDE_MIN : OUTSIDE_MIN

    // A side may only be cut if both halves can clear the minimum, which is also
    // what keeps the clamp below a real range rather than an inverted one.
    const wok = w >= 2 * min
    const hok = d >= 2 * min
    // Drawn before the guards so that running out of budget cannot reshuffle the
    // stream for everything after it: one cell, one draw, whatever it decides.
    const quarters = rand() < QUARTER
    const spend = quarters && wok && hok ? 3 : 1
    if (depth < MAX_DEPTH && (wok || hok) && leaves + spend <= MAX_CELLS) {
      leaves += spend
      // Keep each cut far enough from both ends that neither half lands under the
      // minimum, then take the drawn fraction wherever it still can go.
      const at = (length: number) => {
        const edge = min / length
        return Math.min(Math.max(between(rand, SPLIT_LO, SPLIT_HI), edge), 1 - edge)
      }
      if (quarters && wok && hok) {
        const xm = x0 + w * at(w)
        const zm = z0 + d * at(d)
        cut(x0, z0, xm, zm, height, shade, isInside, depth + 1)
        cut(xm, z0, x1, zm, height, shade, isInside, depth + 1)
        cut(x0, zm, xm, z1, height, shade, isInside, depth + 1)
        cut(xm, zm, x1, z1, height, shade, isInside, depth + 1)
      } else if (wok && (!hok || rand() < 0.5)) {
        const xm = x0 + w * at(w)
        cut(x0, z0, xm, z1, height, shade, isInside, depth + 1)
        cut(xm, z0, x1, z1, height, shade, isInside, depth + 1)
      } else {
        const zm = z0 + d * at(d)
        cut(x0, z0, x1, zm, height, shade, isInside, depth + 1)
        cut(x0, zm, x1, z1, height, shade, isInside, depth + 1)
      }
      return
    }

    // Drawn either way, so that thinning the field cannot also reshuffle the disc.
    const keep = rand() < OUTER_DENSITY
    if (!onTheLine && (isInside || keep)) out.push({ x0, z0, x1, z1, height, shade, inside: isInside })
  }

  const h = side / 2
  cut(-h, -h, h, h, 0.5, [0.5, 0.5, 0.5], false, 0)
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
 *
 * The walk is normalised first and the disc's lift and dome added afterwards. The
 * other way round, one lucky block out in the field would scale the dome away —
 * the mound has to be a fact about the circle, not about the tallest cell.
 */
function terrace(m: MeshArrays, cx: number, y0: number, cz: number, rand: () => number, base: Hsv): void {
  const radius = (between(rand, CIRCLE_LO, CIRCLE_HI) * TERRACE_SIDE) / 2
  const blocks = subdivide(rand, TERRACE_SIDE, radius)
  let lo = Infinity, hi = -Infinity
  for (const b of blocks) { lo = Math.min(lo, b.height); hi = Math.max(hi, b.height) }
  const span = hi - lo || 1
  // A greyscale piece stays greyscale: it may move in value and nowhere else.
  // Drifting its saturation up from zero would invent a hue for a picture that
  // never had one, which is the thing objectHsv is careful not to do.
  const grey = base.s <= 0
  // Divide By Circle's per-block mutation, on top of wherever the tree walked to.
  // All three are drawn whether or not they get used, so that a piece with a hue
  // and a piece without one consume the stream alike and differ only in colour.
  const jitter = (amount: number) => between(rand, 0, amount) * (rand() < 0.5 ? -1 : 1)
  const unit = (v: number) => (v - 0.5) * 2
  /**
   * How much of the value drift this object can actually afford.
   *
   * Divide By Circle pulls a channel off the rails before nudging it, which works
   * there because every colour comes out of one curated palette and none of them
   * sit at an extreme. Here the base value is drawn per object across nearly the
   * whole range on purpose — a near-black terrace standing beside a pale one is
   * the spread the room was asked for — and pulling it to the middle would throw
   * that away. Scaling instead keeps both: a dark object still varies by as much
   * as it has room to, rather than being crushed flat against black.
   */
  const headroom = Math.min(1, Math.min(base.v, 1 - base.v) / (SHADE_TREE + SHADE_BLOCK))
  for (const b of blocks) {
    const mx = (b.x0 + b.x1) / 2
    const mz = (b.z0 + b.z1) / 2
    let h = FIELD_LO + FIELD_SPAN * ((b.height - lo) / span)
    if (b.inside) h += DISC_LIFT + DOME * (1 - Math.min(1, Math.hypot(mx, mz) / radius))
    h *= SCULPTURE_H
    const [jh, js, jv] = [jitter(HUE_BLOCK), jitter(SHADE_BLOCK), jitter(SHADE_BLOCK)]
    const hue = grey ? 0 : wrapHue(base.h + unit(b.shade[0]) * HUE_TREE + jh)
    const sat = grey ? 0 : clamp01(base.s + unit(b.shade[1]) * SHADE_TREE + js)
    const val = clamp01(base.v + (unit(b.shade[2]) * SHADE_TREE + jv) * headroom)
    const [cr, cg, cb] = hsvToRgb255(hue, sat, val)
    const rgb = linear((cr << 16) | (cg << 8) | cb)
    const paint = () => rgb
    const gap = between(rand, GAP_LO, b.inside ? GAP_INSIDE_HI : GAP_OUTSIDE_HI)
    const hx = Math.max(0.002, (b.x1 - b.x0) / 2 - gap / 2)
    const hz = Math.max(0.002, (b.z1 - b.z0) / 2 - gap / 2)
    m.box(mx, y0 + h / 2, mz, hx, h / 2, hz, paint)
  }
  translate(m, cx, cz)
}
