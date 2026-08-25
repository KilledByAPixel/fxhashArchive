import { test, expect } from 'vitest'
import {
  plinths, plinthObstacles, buildSculptureGeometry, subdivide,
  GRID, GRID_SPACING, PLINTH_SIDE, PLINTH_H, SCULPTURE_MIN_SIDE,
  EDGE_MIN, MAX_CELLS, TERRACE_SIDE, PLINTH_COLOR, HUE_TREE, HUE_BLOCK,
} from './sculpture'
import { linear } from './palette'
import { FrontSide, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three'
import { resolve } from './collide'
import { PLAYER_RADIUS } from './constants'
import type { Gallery, Painting, Room } from './types'

const room = (id: string, side: number): Room => ({
  id, kind: 'solo', title: id, rect: { x: -side / 2, z: 100, w: side, d: side },
  entry: { x: 0, z: 101, yaw: 0 }, h: 5.94,
})
const painting = (project: number, roomId: string): Painting => ({
  project, slug: `p${project}`, name: `P${project}`, artist: 'A', year: 2022,
  room: roomId, x: 0, z: 100, yaw: 0, tile: project, w: 1.2, h: 1.2,
})

const gallery = (rooms: Room[], paintings: Painting[]): Gallery => ({
  generatedAt: 'T',
  counts: { paintings: paintings.length, artists: 1, soloRooms: rooms.length, years: [2021, 2024] },
  atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: ['a'], small: ['b'] },
  spawn: { x: 0, z: 4, yaw: 0 },
  rooms, walls: [], paintings, signs: [],
})

const BIG = room('big', 20)
const ART = Array.from({ length: 31 }, (_, i) => painting(1000 + i * 7, 'big'))
const G = gallery([BIG, room('small', 8)], [...ART, painting(5, 'small')])

test('only a room with floor to spare gets sculpture, and it gets nine', () => {
  const list = plinths(G)
  expect(list.length).toBe(GRID * GRID)
  // The rule is a size, not an artist's name: the 8 m room is left alone.
  expect(plinths(gallery([room('small', SCULPTURE_MIN_SIDE - 1)], []))).toEqual([])
  expect(plinths(gallery([room('just', SCULPTURE_MIN_SIDE)], [])).length).toBe(GRID * GRID)
  // A hall the same size is still a corridor, not a room to put things in.
  expect(plinths(gallery([{ ...BIG, kind: 'hall' }], ART))).toEqual([])
})

test('the two kinds checkerboard, five vases to four terraces', () => {
  const list = plinths(G)
  expect(list.filter((p) => p.kind === 'vase').length).toBe(5)
  expect(list.filter((p) => p.kind === 'terrace').length).toBe(4)
  // Corners and centre are vases, edges terraces — so no two of a kind are
  // orthogonally adjacent.
  expect(list.map((p) => p.kind[0]).join('')).toBe('vtvtvtvtv')
})

test('every plinth stands inside its room, clear of the walls the art hangs on', () => {
  // Three by three about the room's centre, so each offset is one of -5, 0, +5 —
  // the middle plinth stands dead centre and is offset from it by neither.
  const offsets = new Set<number>()
  for (const p of plinths(G)) {
    const dx = p.x - (BIG.rect.x + BIG.rect.w / 2)
    const dz = p.z - (BIG.rect.z + BIG.rect.d / 2)
    for (const d of [dx, dz]) {
      expect(Math.abs(Math.abs(d) - GRID_SPACING) < 1e-6 || Math.abs(d) < 1e-6).toBe(true)
      offsets.add(Math.round(d))
    }
  }
  expect([...offsets].sort((a, b) => a - b)).toEqual([-GRID_SPACING, 0, GRID_SPACING])
  // Clearance to the wall: half a room, less the ring, less the plinth itself.
  const clear = BIG.rect.w / 2 - GRID_SPACING - PLINTH_SIDE / 2
  expect(clear).toBeGreaterThan(2)   // room to stand back and look at a picture
})

test('seeds are the room\'s own art, so the objects come from the work around them', () => {
  const list = plinths(G)
  const ids = new Set(ART.map((p) => p.project))
  for (const p of list) expect(ids.has(p.seed)).toBe(true)
  expect(new Set(list.map((p) => p.seed)).size).toBe(GRID * GRID)   // nine different pieces
  // A room whose art went missing still gets objects rather than nine identical ones.
  const bare = plinths(gallery([room('bare', 20)], []))
  expect(new Set(bare.map((p) => p.seed)).size).toBe(GRID * GRID)
})

test('two meshes: the vases are glazed, and everything else is not', () => {
  const { matte, glazed } = buildSculptureGeometry(plinths(G))
  for (const g of [matte, glazed]) {
    const verts = g.getAttribute('position').count
    expect(verts % 3).toBe(0)
    expect(verts).toBeGreaterThan(0)
    // Each is still one attribute set: within a mesh, stone and object differ by
    // vertex colour rather than by material.
    expect(g.getAttribute('color').count).toBe(verts)
    expect(g.getAttribute('normal').count).toBe(verts)
    expect(g.groups.length).toBe(0)
  }
  const tris = (matte.getAttribute('position').count + glazed.getAttribute('position').count) / 3
  expect(tris).toBeLessThan(5000)     // low poly is still the brief; measures 4320
  expect(tris).toBeGreaterThan(500)
  // The split is exactly the vases: they stand on plinths, so nothing in the
  // glazed mesh reaches the floor, while the matte one has the plinth undersides.
  const lowest = (g: { getAttribute: (n: string) => { array: ArrayLike<number> } }) => {
    const pos = g.getAttribute('position').array
    let lo = Infinity
    for (let i = 1; i < pos.length; i += 3) lo = Math.min(lo, pos[i])
    return lo
  }
  expect(lowest(matte)).toBeCloseTo(0, 6)
  expect(lowest(glazed)).toBeGreaterThanOrEqual(PLINTH_H - 1e-6)
})

test('the objects are properly coloured, and not nine shades of the same plaster', () => {
  // Nine different pictures, nine different hues — which is the case the room has.
  const art = ART.map((p, i) => ({ ...p, tint: { hue: (i * 37) % 360, strength: 0.9 } }))
  const { glazed } = buildSculptureGeometry(plinths(gallery([BIG], art)))
  const c = glazed.getAttribute('color').array
  const seen = new Set<string>()
  for (let i = 0; i < c.length; i += 3) seen.add(`${c[i].toFixed(3)},${c[i + 1].toFixed(3)},${c[i + 2].toFixed(3)}`)
  expect(seen.size).toBeGreaterThanOrEqual(4)    // five vases from five pictures
  // and they are colours: at least one is a long way from grey, where a wash of
  // 0.4 saturation on near-white plaster never got past "faintly warm".
  let spread = 0
  for (const k of seen) {
    const [r, g, b] = k.split(',').map(Number)
    spread = Math.max(spread, Math.max(r, g, b) - Math.min(r, g, b))
  }
  expect(spread).toBeGreaterThan(0.15)
})

// Frank: the terrace should subdivide like a real one — a square cut in two at a
// point between a tenth and nine tenths of the way along, each half nudged in
// height, and each half cut again, until the pieces are too small or there are
// enough of them. Quartering at the middle made a grid; this does not.
//
// Then: make it more like Divide By Circle. So the cuts now take both axes at
// once a third of the time, heights sit in plateaus rather than wandering at
// every level, and a disc is scored through the square — packed and domed inside
// it, thinned out beyond it, and a ring of nothing where the circle falls.

/** A dependable stream for the tests, so a failure is a failure and not a draw. */
const lcg = (seed: number) => {
  let a = seed >>> 0
  return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296 }
}

/** The radius the terraces are built at, mid-range. */
const R = 0.45 * TERRACE_SIDE / 2

test('the blocks stay in the square, never overlap, and never go under the minimum', () => {
  for (let seed = 1; seed <= 25; seed++) {
    const blocks = subdivide(lcg(seed), TERRACE_SIDE, R)
    expect(blocks.length).toBeGreaterThan(1)
    // They no longer tile the square — the ring and the thinned field are gaps on
    // purpose — so the guarantee is the other one: no block covers another.
    let area = 0
    for (const b of blocks) {
      const w = b.x1 - b.x0, d = b.z1 - b.z0
      expect(w).toBeGreaterThanOrEqual(EDGE_MIN - 1e-9)
      expect(d).toBeGreaterThanOrEqual(EDGE_MIN - 1e-9)
      expect(b.x0).toBeGreaterThanOrEqual(-TERRACE_SIDE / 2 - 1e-9)
      expect(b.x1).toBeLessThanOrEqual(TERRACE_SIDE / 2 + 1e-9)
      expect(b.z0).toBeGreaterThanOrEqual(-TERRACE_SIDE / 2 - 1e-9)
      expect(b.z1).toBeLessThanOrEqual(TERRACE_SIDE / 2 + 1e-9)
      area += w * d
    }
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i], b = blocks[j]
        const overlap = a.x0 < b.x1 - 1e-9 && b.x0 < a.x1 - 1e-9 && a.z0 < b.z1 - 1e-9 && b.z0 < a.z1 - 1e-9
        expect(overlap).toBe(false)
      }
    }
    // And they are a subdivision of the square, not a scattering across it.
    expect(area).toBeLessThanOrEqual(TERRACE_SIDE * TERRACE_SIDE + 1e-9)
    expect(area).toBeGreaterThan(TERRACE_SIDE * TERRACE_SIDE * 0.3)
  }
})

test('the circle is cut clean: nothing straddles it, and it has two sides', () => {
  let insideTotal = 0, outsideTotal = 0
  for (let seed = 1; seed <= 25; seed++) {
    const blocks = subdivide(lcg(seed), TERRACE_SIDE, R)
    for (const b of blocks) {
      // No surviving block has the circle running through it: every corner is on
      // the same side of it as every other. That is what makes the ring a ring
      // and not a fringe of blocks half in and half out.
      const corners = [[b.x0, b.z0], [b.x1, b.z0], [b.x1, b.z1], [b.x0, b.z1]]
      const within = corners.map(([x, z]) => Math.hypot(x, z) < R)
      expect(new Set(within).size).toBe(1)
      // and the flag agrees with the geometry it was derived from
      expect(b.inside).toBe(within[0])
      if (b.inside) insideTotal++; else outsideTotal++
    }
  }
  expect(insideTotal).toBeGreaterThan(20)     // there is a disc
  expect(outsideTotal).toBeGreaterThan(20)    // and there is a field
})

test('the disc is packed and the field is not', () => {
  // Inside the circle every cell is built, outside only half of them are, so the
  // disc covers far more of its own area than the field covers of its.
  let inArea = 0, outArea = 0
  for (let seed = 1; seed <= 25; seed++) {
    for (const b of subdivide(lcg(seed), TERRACE_SIDE, R)) {
      const a = (b.x1 - b.x0) * (b.z1 - b.z0)
      if (b.inside) inArea += a; else outArea += a
    }
  }
  const discArea = Math.PI * R * R * 25
  const fieldArea = TERRACE_SIDE * TERRACE_SIDE * 25 - discArea
  expect(inArea / discArea).toBeGreaterThan(outArea / fieldArea + 0.2)
})

test('no cut lands in the middle, and the blocks are not all one size', () => {
  const half = TERRACE_SIDE / 2
  let interior = 0
  let centred = 0
  const widths = new Set<string>()
  for (let seed = 1; seed <= 40; seed++) {
    for (const b of subdivide(lcg(seed), TERRACE_SIDE, R)) {
      widths.add((b.x1 - b.x0).toFixed(4))
      for (const v of [b.x0, b.x1, b.z0, b.z1]) {
        if (Math.abs(Math.abs(v) - half) < 1e-9) continue   // the outer edge, not a cut
        interior++
        if (Math.abs(v) < 1e-9) centred++                   // dead centre is what a grid does
      }
    }
  }
  expect(interior).toBeGreaterThan(50)
  expect(centred).toBe(0)
  expect(widths.size).toBeGreaterThan(4)
})

test('heights come back as plateaus, not as noise', () => {
  // The point of a low mutation rate: neighbours mostly inherit one height and
  // the shape reads as terraces, so there are far fewer distinct heights than
  // there are blocks. Nudging at every level, as this used to, gives one height
  // per block and a heap of rubble.
  let blocks = 0, levels = 0
  for (let seed = 1; seed <= 25; seed++) {
    const hs = subdivide(lcg(seed), TERRACE_SIDE, R).map((b) => b.height)
    blocks += hs.length
    levels += new Set(hs.map((h) => h.toFixed(6))).size
    for (const h of hs) {
      expect(Number.isFinite(h)).toBe(true)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThanOrEqual(1)
    }
  }
  expect(levels).toBeGreaterThan(25)          // it is not one flat slab either
  expect(levels).toBeLessThan(blocks * 0.6)   // most blocks share a height with a neighbour
})

test('a terrace never makes more cells than its budget allows', () => {
  for (let seed = 1; seed <= 40; seed++) {
    // Built blocks are only the survivors, so the budget is the looser bound —
    // what it really guards is the ring, which is cut fine and then discarded.
    expect(subdivide(lcg(seed), TERRACE_SIDE, R).length).toBeLessThanOrEqual(MAX_CELLS)
  }
})

test('nothing floats and nothing sinks: every object sits on its own plinth', () => {
  const list = plinths(G)
  const built = buildSculptureGeometry(list)
  const pos = [
    ...Array.from(built.matte.getAttribute('position').array),
    ...Array.from(built.glazed.getAttribute('position').array),
  ]
  let lo = Infinity, hi = -Infinity
  for (let i = 1; i < pos.length; i += 3) { lo = Math.min(lo, pos[i]); hi = Math.max(hi, pos[i]) }
  expect(lo).toBeCloseTo(0, 6)                    // plinth undersides rest on the floor
  expect(hi).toBeGreaterThan(PLINTH_H)            // something stands on top of them
  expect(hi).toBeLessThan(PLINTH_H + 0.8)         // and it is a sculpture, not a column
  // Horizontally, everything is inside the ring of plinths plus a little overhang.
  const reach = GRID_SPACING + PLINTH_SIDE
  for (let i = 0; i < pos.length; i += 3) {
    expect(Math.abs(pos[i] - 0)).toBeLessThan(reach)
    expect(Math.abs(pos[i + 2] - (BIG.rect.z + BIG.rect.d / 2))).toBeLessThan(reach)
  }
})

test('the same seed is the same object, forever', () => {
  const shape = (list: ReturnType<typeof plinths>) => {
    const b = buildSculptureGeometry(list)
    return [
      ...Array.from(b.matte.getAttribute('position').array),
      ...Array.from(b.glazed.getAttribute('position').array),
    ]
  }
  expect(shape(plinths(G))).toEqual(shape(plinths(G)))
  // And a different seed is a different object, or the generator is not generating.
  const other = plinths(G).map((p, i) => ({ ...p, seed: p.seed + 1 + i }))
  expect(shape(other)).not.toEqual(shape(plinths(G)))
})

test('you cannot walk through a plinth', () => {
  const list = plinths(G)
  const obstacles = plinthObstacles(list)
  expect(obstacles.length).toBe(list.length)
  const target = list[0]
  // Walk straight at the middle of one and end up outside it.
  const out = resolve({ x: target.x, z: target.z }, [], undefined, obstacles)
  expect(Math.hypot(out.x - target.x, out.z - target.z)).toBeGreaterThanOrEqual(PLAYER_RADIUS)
  // Standing well clear of every one of them, nothing moves you.
  const clear = { x: target.x, z: target.z + GRID_SPACING / 2 }
  expect(resolve(clear, [], undefined, obstacles)).toEqual(clear)
})

/**
 * Raycast the mesh with a front-facing material, which is how the renderer sees
 * it: a face wound inside out is culled, so a ray from outside passes straight
 * through and hits nothing. This is the check that would have caught the plinths
 * and the terrace skirts being built backwards — every normal was a sensible
 * length pointing a sensible way, they were simply pointing in.
 */
const hits = (geo: ReturnType<typeof buildSculptureGeometry>, from: [number, number, number], to: [number, number, number]) => {
  const meshes = [geo.matte, geo.glazed].map((g) => new Mesh(g, new MeshBasicMaterial({ side: FrontSide })))
  for (const m of meshes) m.updateMatrixWorld()
  const mesh = meshes[0]
  const origin = new Vector3(...from)
  const dir = new Vector3(...to).sub(origin).normalize()
  return new Raycaster(origin, dir, 0, 200).intersectObject(mesh, false).length
}

test('every face is wound outwards, so nothing is inside out', () => {
  const list = plinths(G)
  const geo = buildSculptureGeometry(list)
  const p = list[0]
  const roomZ = BIG.rect.z + BIG.rect.d / 2

  // At the plinth's own height, from outside the room, straight at it.
  expect(hits(geo, [p.x - 8, PLINTH_H / 2, p.z], [p.x, PLINTH_H / 2, p.z])).toBeGreaterThan(0)
  // Its underside, which only the floor mirror ever looks at.
  expect(hits(geo, [p.x, -3, p.z], [p.x, 0, p.z])).toBeGreaterThan(0)
  // Its lid, and whatever stands on it.
  expect(hits(geo, [p.x, 6, p.z], [p.x, PLINTH_H, p.z])).toBeGreaterThan(0)

  // Both kinds of sculpture, side on, just above the plinth they stand on: a
  // terrace's boundary cells always skirt the whole way down to the plinth top,
  // and a vase is at its widest well below its shoulder.
  for (const kind of ['vase', 'terrace'] as const) {
    const s = list.find((q) => q.kind === kind)!
    expect(hits(geo, [s.x - 8, PLINTH_H + 0.06, s.z], [s.x, PLINTH_H + 0.06, s.z])).toBeGreaterThan(0)
    expect(hits(geo, [s.x, PLINTH_H + 3, s.z], [s.x, PLINTH_H + 0.06, s.z])).toBeGreaterThan(0)
  }
  expect(roomZ).toBeGreaterThan(0)
})

test('vases shade smooth and everything else shades flat', () => {
  const list = plinths(G)
  const geo = buildSculptureGeometry(list)
  // Every normal is a unit vector, however it was arrived at — in both meshes.
  for (const g of [geo.matte, geo.glazed]) {
    const u = g.getAttribute('normal')
    for (let i = 0; i < u.count; i++) {
      expect(Math.hypot(u.getX(i), u.getY(i), u.getZ(i))).toBeCloseTo(1, 5)
    }
  }
  const n = geo.glazed.getAttribute('normal')
  // A flat triangle has one normal repeated; a smooth one does not. The lathe is
  // the only smooth thing here, so some triangles must disagree with themselves
  // and plenty must not.
  let varied = 0, uniform = 0
  for (let t = 0; t < n.count; t += 3) {
    const same = [1, 2].every((k) =>
      Math.abs(n.getX(t) - n.getX(t + k)) < 1e-6 &&
      Math.abs(n.getY(t) - n.getY(t + k)) < 1e-6 &&
      Math.abs(n.getZ(t) - n.getZ(t + k)) < 1e-6)
    if (same) uniform++
    else varied++
  }
  expect(varied).toBeGreaterThan(100)    // the vases
  expect(uniform).toBeGreaterThan(100)   // the plinths and the terraces
})

test('a sculpture is the colour of the piece it was generated from', () => {
  const tinted = ART.map((p, i) => (i % 3 === 0 ? { ...p, tint: { hue: 210, strength: 1 } } : p))
  const list = plinths(gallery([BIG], tinted))
  expect(list.some((p) => p.tint)).toBe(true)
  const colours = (built: ReturnType<typeof buildSculptureGeometry>) => {
    const seen = new Set<string>()
    for (const g of [built.matte, built.glazed]) {
      const c = g.getAttribute('color')
      for (let i = 0; i < c.count; i++) seen.add(`${c.getX(i).toFixed(4)},${c.getY(i).toFixed(4)},${c.getZ(i).toFixed(4)}`)
    }
    return seen
  }
  // Plinth stone, plaster for the untinted, and colour for the tinted: three at least.
  expect(colours(buildSculptureGeometry(list)).size).toBeGreaterThanOrEqual(3)
  // With no tints at all nothing is coloured: greyscale art gets greys, which is
  // the one thing a picture with no dominant hue does tell you. Inventing a hue
  // for it would be making something up about the work.
  // Read off the vases alone: the plinth stone is warm by design and is not an
  // object's colour at all.
  const plainVases = buildSculptureGeometry(plinths(gallery([BIG], ART))).glazed.getAttribute('color')
  const greys = new Set();
  for (let i = 0; i < plainVases.count; i++) {
    const [r, g, b2] = [plainVases.getX(i), plainVases.getY(i), plainVases.getZ(i)]
    expect(Math.max(r, g, b2) - Math.min(r, g, b2)).toBeLessThan(0.02)
    greys.add(r.toFixed(4))
  }
  expect(greys.size).toBeGreaterThan(1)              // and they are not all one grey
})

// Frank: "how can I vary the colour more?" The hues were already spread across
// the wheel; what flattened them was strength — how dominant a hue was in the
// thumbnail — which for near-monochrome pieces multiplied any saturation down to
// grey. Four of the room's nine objects were coming out colourless that way.

test('a washed-out picture still makes a properly coloured object', () => {
  const faint = ART.map((p, i) => ({ ...p, tint: { hue: (i * 53) % 360, strength: 0.12 } }))
  const { glazed } = buildSculptureGeometry(plinths(gallery([BIG], faint)))
  const c = glazed.getAttribute('color')
  let spread = 0
  for (let i = 0; i < c.count; i++) {
    spread = Math.max(spread, Math.max(c.getX(i), c.getY(i), c.getZ(i)) - Math.min(c.getX(i), c.getY(i), c.getZ(i)))
  }
  // At 0.12 strength these used to land at 0.11 saturation — grey in all but name.
  expect(spread).toBeGreaterThan(0.15)
})

// Frank: "would it cost anything extra to apply colour to these? ... maybe we
// could also do the colour mutation effect that it has where it does a tiny
// mutation of colour every time it does a subdivide." It costs nothing — the
// colour attribute was already allocated and already being written, one Rgb per
// vertex, so this puts different numbers in slots that were being filled anyway.

/** Every colour in the matte mesh, in the linear space a vertex colour is stored in. */
const matteColours = (built: ReturnType<typeof buildSculptureGeometry>) => {
  const c = built.matte.getAttribute('color')
  const seen = new Set<string>()
  for (let i = 0; i < c.count; i++) seen.add(`${c.getX(i).toFixed(4)},${c.getY(i).toFixed(4)},${c.getZ(i).toFixed(4)}`)
  return seen
}

/**
 * Back out of the linear space a vertex colour is stored in.
 *
 * Hue does not survive that conversion: sRGB to linear is a curve applied to each
 * channel separately, so it moves the ratios between them and takes the hue with
 * them. Reading a hue straight off the buffer reports drift the generator never
 * applied — about nine degrees of it here, on top of a real fourteen.
 */
const srgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

/** The shortest way round the wheel between two hues, which is not |a - b|. */
const hueArc = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

test('the colour and the height are the same tree', () => {
  // They mutate inside one branch, so a block's shade decides its height: the
  // number of distinct shades and the number of distinct (height, shade) pairs
  // have to be equal. If colour were drawn per block instead, there would be one
  // shade per block and this would come apart immediately.
  let blocks = 0, shades = 0, pairs = 0
  for (let seed = 1; seed <= 25; seed++) {
    const bs = subdivide(lcg(seed), TERRACE_SIDE, R)
    const key = (b: (typeof bs)[number]) => b.shade.map((v) => v.toFixed(6)).join()
    blocks += bs.length
    shades += new Set(bs.map(key)).size
    pairs += new Set(bs.map((b) => b.height.toFixed(6) + '|' + key(b))).size
    for (const b of bs) {
      expect(b.shade.length).toBe(3)
      for (const v of b.shade) {
        expect(Number.isFinite(v)).toBe(true)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
    }
  }
  expect(pairs).toBe(shades)
  // And the colour plateaus the same way the height does: neighbours share.
  expect(shades).toBeGreaterThan(25)
  expect(shades).toBeLessThan(blocks)
})

test('every block of a terrace is its own colour, and still the object\'s colour', () => {
  // One hue for all the art, so any spread seen on a terrace is the mutation and
  // not a difference between the pictures the objects came from.
  const HUE = 210
  const art = ART.map((p) => ({ ...p, tint: { hue: HUE, strength: 0.9 } }))
  const list = plinths(gallery([BIG], art))
  const built = buildSculptureGeometry(list)
  const pos = built.matte.getAttribute('position')
  const col = built.matte.getAttribute('color')

  const terraceSeen = new Set<string>()
  let worstArc = 0
  for (const p of list.filter((q) => q.kind === 'terrace')) {
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getX(i) - p.x) > TERRACE_SIDE / 2 + 0.01) continue
      if (Math.abs(pos.getZ(i) - p.z) > TERRACE_SIDE / 2 + 0.01) continue
      if (pos.getY(i) < PLINTH_H + 0.02) continue        // the plinth, not the sculpture
      const [r, g, b] = [srgb(col.getX(i)), srgb(col.getY(i)), srgb(col.getZ(i))]
      terraceSeen.add(`${r.toFixed(4)},${g.toFixed(4)},${b.toFixed(4)}`)
      const v = Math.max(r, g, b), lo = Math.min(r, g, b)
      // Only where there is enough colour left for a hue to mean anything: a
      // block mutated very dark or very pale has no reliable one to read.
      if (v < 0.05 || (v - lo) / v < 0.25) continue
      const d = v - lo
      const raw = r === v ? ((g - b) / d) % 6 : g === v ? (b - r) / d + 2 : (r - g) / d + 4
      worstArc = Math.max(worstArc, hueArc((((raw * 60) % 360) + 360) % 360, HUE))
    }
  }
  // Every block differs from its neighbours — which is the Divide By Circle look
  // when the palette is a single colour, and the reason it turns its per-block
  // mutation up in that case.
  expect(terraceSeen.size).toBeGreaterThan(40)
  // But the object is still the colour of the picture it came from: the drift is
  // capped at HUE_TREE + HUE_BLOCK, and the slack is for reading a hue back out of
  // a colour that was rounded to eight bits a channel on the way in.
  expect(worstArc).toBeGreaterThan(1)                        // it did drift
  expect(worstArc).toBeLessThan(HUE_TREE + HUE_BLOCK + 2)    // but not far
})

test('a picture with no hue still gets no hue, however much its blocks mutate', () => {
  // The saturation drift must not invent a colour for greyscale art. It is not
  // enough that the base is grey: the mutation has to decline to move it.
  const built = buildSculptureGeometry(plinths(gallery([BIG], ART)))
  const stone = linear(PLINTH_COLOR).map((v) => v.toFixed(4)).join(',')
  const notStone = [...matteColours(built)].filter((k) => k !== stone)
  expect(notStone.length).toBeGreaterThan(40)      // the terraces did vary
  for (const k of notStone) {
    const [r, g, b] = k.split(',').map(Number)
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBe(0)   // and every one is grey
  }
})

test('no block is driven to pure black, however dark the object', () => {
  // The value drift is scaled to the room the object's own value leaves, so a
  // near-black terrace varies in proportion instead of crushing flat against
  // zero and losing the block structure that is the whole point of it.
  const dark = ART.map((p) => ({ ...p, tint: { hue: 30, strength: 0.9 } }))
  for (const art of [dark, ART]) {
    const built = buildSculptureGeometry(plinths(gallery([BIG], art)))
    const c = built.matte.getAttribute('color')
    let lit = 0
    for (let i = 0; i < c.count; i++) {
      if (Math.max(c.getX(i), c.getY(i), c.getZ(i)) > 0.002) lit++
    }
    expect(lit).toBe(c.count)
  }
})
