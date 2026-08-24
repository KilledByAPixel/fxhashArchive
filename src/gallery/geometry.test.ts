import { test, expect } from 'vitest'
import {
  tileUv, atlasFile, buildPaintingGeometry, buildFrameGeometry, buildWallGeometry, buildFloorGeometry, buildCeilingGeometry,
  buildSignGeometry, buildPoolGeometry, buildLightStripGeometry, type FaceColor,
} from './geometry'
import { POOL_W, POOL_H } from './pools'
import type { AtlasMeta, Painting, Room, Sign, Wall } from './types'
import { EYE_Y, PAINTING, WALL_T, WALL_H } from './constants'

const atlas: AtlasMeta = { size: 4096, tile: 256, gutter: 4, cols: 15, files: ['a', 'b'], small: ['c', 'd'] }
// A wall at x = -4 has its inside face at -4 + WALL_T/2 = -3.85; the painting
// stands WALL_OFFSET (WALL_T/2 + 0.02 = 0.17) off the rectangle edge at x = -4,
// i.e. 0.02 clear of that inside face, at -4 + 0.17 = -3.83. See gallery-lib.mjs.
const painting = (tile: number, over: Partial<Painting> = {}): Painting => ({
  project: tile, slug: 'p', name: 'P', artist: 'A', year: 2022, room: 'r', x: -3.83, z: 20, yaw: Math.PI / 2, tile,
  w: PAINTING, h: PAINTING, ...over,
})
// Buffers are Float32, so 2.2 comes back as 2.2000000477; compare to 5 places.
const bounds = (g: { getAttribute(n: string): { array: ArrayLike<number> } }, axis: 0 | 1 | 2) => {
  const a = g.getAttribute('position').array
  let lo = Infinity, hi = -Infinity
  for (let i = axis; i < a.length; i += 3) { lo = Math.min(lo, a[i]); hi = Math.max(hi, a[i]) }
  return [lo, hi]
}
const expectBounds = (g: Parameters<typeof bounds>[0], axis: 0 | 1 | 2, lo: number, hi: number) => {
  const [a, b] = bounds(g, axis)
  expect(a).toBeCloseTo(lo, 5)
  expect(b).toBeCloseTo(hi, 5)
}

test('tileUv addresses the image inside its gutter, top row at v = 1', () => {
  expect(tileUv(0, atlas)).toEqual({ u0: 4 / 4096, u1: 260 / 4096, v0: 1 - 260 / 4096, v1: 1 - 4 / 4096 })
  expect(tileUv(14, atlas).u0).toBeCloseTo(3700 / 4096, 12)
  expect(tileUv(15, atlas).v1).toBeCloseTo(1 - 268 / 4096, 12)
  expect(tileUv(225, atlas)).toEqual(tileUv(0, atlas))   // same cell, next file
  expect(atlasFile(224, atlas)).toBe(0)
  expect(atlasFile(225, atlas)).toBe(1)
})

test('tileUv is identical between the large and small atlas for the same tile', () => {
  // Both atlases share the same 15-column grid and the same tile numbering (see
  // scripts/gallery-lib.mjs ATLAS / ATLAS_SMALL), just scaled — so a tile's UV
  // rectangle must come out exactly the same whichever one the client loaded. The
  // phone path (chooseSmall) depends on this being exact, not merely close.
  const small: AtlasMeta = { size: 2048, tile: 128, gutter: 2, cols: 15, files: ['a'], small: ['a'] }
  for (const t of [0, 14, 15, 224, 225]) {
    expect(tileUv(t, small)).toEqual(tileUv(t, atlas))
  }
})

test('paintings become one quad each, only for the requested file', () => {
  const g = buildPaintingGeometry([painting(0), painting(1), painting(225)], atlas, 0)
  expect(g.getAttribute('position').count).toBe(12)
  expectBounds(g, 1, EYE_Y - PAINTING / 2, EYE_Y + PAINTING / 2)
  expectBounds(g, 0, -3.83, -3.83)              // flat against the wall plane, clear of the wall behind it
  expectBounds(g, 2, 20 - PAINTING / 2, 20 + PAINTING / 2)
  const uv = g.getAttribute('uv').array
  for (let i = 0; i < uv.length; i += 2) {
    expect(uv[i]).toBeGreaterThanOrEqual(4 / 4096 - 1e-6)          // u: tiles 0 and 1, side by side
    expect(uv[i]).toBeLessThanOrEqual(524 / 4096 + 1e-6)
    expect(uv[i + 1]).toBeGreaterThanOrEqual(1 - 260 / 4096 - 1e-6) // v: the top row
    expect(uv[i + 1]).toBeLessThanOrEqual(1 - 4 / 4096 + 1e-6)
  }
  expect(buildPaintingGeometry([painting(225)], atlas, 1).getAttribute('position').count).toBe(6)
})

test('every normal on a painting quad points into the room', () => {
  const n = buildPaintingGeometry([painting(0)], atlas, 0).getAttribute('normal').array
  for (let i = 0; i < n.length; i += 3) expect([n[i], n[i + 1], n[i + 2]].map((v) => Math.round(v * 1e6) / 1e6)).toEqual([1, 0, 0])
})

test('a frame sits just behind its painting and a little larger', () => {
  const g = buildFrameGeometry([painting(0)])
  expect(g.getAttribute('position').count).toBe(6)
  expect(bounds(g, 0)[0]).toBeLessThan(-3.83)
  expectBounds(g, 1, EYE_Y - PAINTING / 2 - 0.06, EYE_Y + PAINTING / 2 + 0.06)
})

test('a wall segment becomes a box WALL_T thick, corners closed', () => {
  const w: Wall = { x1: -4, z1: 0, x2: -4, z2: 10, y0: 0, y1: 4 }
  const g = buildWallGeometry([w])
  expect(g.getAttribute('position').count).toBe(36)
  expectBounds(g, 0, -4 - WALL_T / 2, -4 + WALL_T / 2)
  expectBounds(g, 1, 0, 4)
  expectBounds(g, 2, -WALL_T / 2, 10 + WALL_T / 2)
})

test('a painting on a wall stands clear of it, not buried inside the opaque box', () => {
  // Regression for the bug where WALL_OFFSET was measured from the room rectangle's
  // edge (the wall's centre line) instead of its inside face, burying every painting
  // 0.13 m inside the wall. Build the actual wall box for the -4 wall this painting
  // hangs on, and check the painting's quad sits outside it, not inside.
  const w: Wall = { x1: -4, z1: 0, x2: -4, z2: 10, y0: 0, y1: 4 }
  const wallInsideFace = bounds(buildWallGeometry([w]), 0)[1]   // the wall box's far (room-side) x-bound
  expect(wallInsideFace).toBeCloseTo(-4 + WALL_T / 2, 6)
  const paintingX = bounds(buildPaintingGeometry([painting(0)], atlas, 0), 0)[0]
  expect(paintingX).toBeGreaterThan(wallInsideFace)
  expect(paintingX).toBeGreaterThan(-4 + WALL_T / 2)
})

test('each room gets a floor facing up and, separately, a ceiling facing down', () => {
  const r: Room = { id: 'x', kind: 'hall', title: 'X', rect: { x: -4, z: 0, w: 8, d: 10 }, entry: { x: 0, z: 1, yaw: 0 } }
  const floor = buildFloorGeometry([r])
  expect(floor.getAttribute('position').count).toBe(6)
  expectBounds(floor, 1, 0, 0)
  expectBounds(floor, 0, -4, 4)
  expect(floor.getAttribute('normal').array[1]).toBe(1)
  const ceiling = buildCeilingGeometry([r])
  expect(ceiling.getAttribute('position').count).toBe(6)
  expectBounds(ceiling, 1, 4, 4)
  expect(ceiling.getAttribute('normal').array[1]).toBe(-1)
})

test('signs are quads of their own size with the UVs they are given', () => {
  const s: Sign = { text: 't', kind: 'plaque', x: 0, y: 1, z: 0, yaw: 0, w: 0.5, h: 0.12 }
  const g = buildSignGeometry([s], [{ u0: 0.1, u1: 0.2, v0: 0.3, v1: 0.4 }])
  expect(g.getAttribute('position').count).toBe(6)
  expectBounds(g, 0, -0.25, 0.25)
  expectBounds(g, 1, 0.94, 1.06)
  const uv = g.getAttribute('uv').array
  expect(uv[0]).toBeCloseTo(0.1, 5)
  expect(uv[1]).toBeCloseTo(0.3, 5)
})

test('a spot pool is a wide quad between the wall face and the frame', () => {
  // painting(0) hangs on the x = -4 wall at x = -3.83; its frame is at -3.84 and
  // the wall's inside face at -3.85. The pool must sit in that centimetre, so it
  // reads as lit wall behind the frame, not a glow floating over the picture.
  const g = buildPoolGeometry([painting(0)])
  expect(g.getAttribute('position').count).toBe(6)
  expectBounds(g, 1, EYE_Y - POOL_H / 2, EYE_Y + POOL_H / 2)
  expectBounds(g, 2, 20 - POOL_W / 2, 20 + POOL_W / 2)
  const [poolX] = bounds(g, 0)
  expect(poolX).toBeGreaterThan(-4 + WALL_T / 2)
  expect(poolX).toBeLessThan(bounds(buildFrameGeometry([painting(0)]), 0)[0])
})

test('a landscape painting is a wide quad whose UVs crop the letterbox out of its tile', () => {
  // A 3:2 preview is fitted inside its square tile with black above and below; the
  // quad must show only the picture, so its v range is the middle two thirds.
  const wide = painting(0, { w: PAINTING, h: PAINTING * 2 / 3 })
  const g = buildPaintingGeometry([wide], atlas, 0)
  expectBounds(g, 1, EYE_Y - PAINTING / 3, EYE_Y + PAINTING / 3)
  expectBounds(g, 2, 20 - PAINTING / 2, 20 + PAINTING / 2)
  const full = tileUv(0, atlas)
  const uv = g.getAttribute('uv').array
  const vs = Array.from({ length: 6 }, (_, i) => uv[i * 2 + 1])
  const span = full.v1 - full.v0
  expect(Math.min(...vs)).toBeCloseTo(full.v0 + span / 6, 5)
  expect(Math.max(...vs)).toBeCloseTo(full.v1 - span / 6, 5)
  const us = Array.from({ length: 6 }, (_, i) => uv[i * 2])
  expect(Math.min(...us)).toBeCloseTo(full.u0, 5)
  expect(Math.max(...us)).toBeCloseTo(full.u1, 5)
})

test('a portrait painting crops the tile sideways, and its frame follows its shape', () => {
  const tall = painting(0, { w: PAINTING / 2, h: PAINTING })
  const g = buildPaintingGeometry([tall], atlas, 0)
  expectBounds(g, 1, EYE_Y - PAINTING / 2, EYE_Y + PAINTING / 2)
  expectBounds(g, 2, 20 - PAINTING / 4, 20 + PAINTING / 4)
  const full = tileUv(0, atlas)
  const us = Array.from({ length: 6 }, (_, i) => g.getAttribute('uv').array[i * 2])
  const span = full.u1 - full.u0
  expect(Math.min(...us)).toBeCloseTo(full.u0 + span / 4, 5)
  expect(Math.max(...us)).toBeCloseTo(full.u1 - span / 4, 5)
  const frame = buildFrameGeometry([tall])
  expectBounds(frame, 2, 20 - PAINTING / 4 - 0.06, 20 + PAINTING / 4 + 0.06)
  expectBounds(frame, 1, EYE_Y - PAINTING / 2 - 0.06, EYE_Y + PAINTING / 2 + 0.06)
})

test('a light strip runs along each room\'s ceiling, a metre short of each end', () => {
  const r: Room = { id: 'x', kind: 'hall', title: 'X', rect: { x: -4, z: 0, w: 8, d: 30 }, entry: { x: 0, z: 1, yaw: 0 } }
  const g = buildLightStripGeometry([r])
  expect(g.getAttribute('position').count).toBe(36)          // one box per room
  expectBounds(g, 2, 1, 29)                                   // along the long axis, 1 m short of each end
  expectBounds(g, 0, -0.15, 0.15)                             // 0.3 m wide, on the centreline
  expectBounds(g, 1, WALL_H - 0.1, WALL_H - 0.02)             // hung just under the ceiling
})

test('a ceiling sits at its own room\'s height, and falls back to WALL_H without one', () => {
  const rect = { x: -10, z: 0, w: 20, d: 20 }
  const tall: Room = { id: 'a', kind: 'solo', title: 'A', rect, entry: { x: 0, z: 1, yaw: 0 }, h: 5.94 }
  expectBounds(buildCeilingGeometry([tall]), 1, 5.94, 5.94)
  // Data built before per-room heights has no `h`; the building must still close.
  const legacy: Room = { id: 'b', kind: 'solo', title: 'B', rect, entry: { x: 0, z: 1, yaw: 0 } }
  expectBounds(buildCeilingGeometry([legacy]), 1, WALL_H, WALL_H)
})

test('a wide room gets a rank of light strips; a corridor keeps its single one', () => {
  // 20 m across at STRIP_SPACING 6 is three strips, evenly spread over the short
  // axis — the 20 x 20 room used to get one lamp down the middle and read flat.
  const wide: Room = { id: 'a', kind: 'solo', title: 'A', rect: { x: -10, z: 0, w: 20, d: 20 }, entry: { x: 0, z: 1, yaw: 0 }, h: 6 }
  const g = buildLightStripGeometry([wide])
  expect(g.getAttribute('position').count).toBe(3 * 36)
  expectBounds(g, 0, -20 / 3 - 0.15, 20 / 3 + 0.15)
  expectBounds(g, 1, 6 - 0.1, 6 - 0.02)          // under this room's ceiling, not WALL_H
  // 8 m of corridor is still one strip on the centreline: unchanged by any of this.
  const hall: Room = { id: 'h', kind: 'hall', title: 'H', rect: { x: -4, z: 0, w: 8, d: 30 }, entry: { x: 0, z: 1, yaw: 0 }, h: WALL_H }
  const one = buildLightStripGeometry([hall])
  expect(one.getAttribute('position').count).toBe(36)
  expectBounds(one, 0, -0.15, 0.15)
})

test('walls carry no colour attribute unless something asks for one', () => {
  const w: Wall = { x1: -4, z1: 0, x2: -4, z2: 10, y0: 0, y1: WALL_H }
  expect(buildWallGeometry([w]).getAttribute('color')).toBeUndefined()
})

test('each face of a wall takes its own colour, so one wall is two colours', () => {
  // This is what lets an artist's room be tinted on the inside and leave the
  // corridor white: the two sides are different faces of the same box, and the
  // whole building stays one mesh and one draw call.
  const w: Wall = { x1: -4, z1: 0, x2: -4, z2: 10, y0: 0, y1: WALL_H }
  const colorOf: FaceColor = (_c, n) => (n[0] > 0 ? [1, 0, 0] : [0, 0, 1])
  const g = buildWallGeometry([w], colorOf)
  const color = g.getAttribute('color')
  expect(color.count).toBe(g.getAttribute('position').count)
  // Face order is +x, -x, +z, -z, +y, -y — the first six vertices are the +x face.
  const at = (i: number) => [color.array[i * 3], color.array[i * 3 + 1], color.array[i * 3 + 2]]
  expect(at(0)).toEqual([1, 0, 0])
  expect(at(6)).toEqual([0, 0, 1])
})

test('a colour arriving late backfills the quads before it rather than shifting them', () => {
  // Two walls, only the second tinted: the attribute still has to line up with
  // the positions vertex for vertex, or every colour lands on the wrong wall.
  const a: Wall = { x1: -4, z1: 0, x2: -4, z2: 10, y0: 0, y1: WALL_H }
  const b: Wall = { x1: 4, z1: 0, x2: 4, z2: 10, y0: 0, y1: WALL_H }
  const colorOf: FaceColor = (c) => (c[0] > 0 ? [0, 1, 0] : null)
  const g = buildWallGeometry([a, b], colorOf)
  const color = g.getAttribute('color')
  expect(color.count).toBe(g.getAttribute('position').count)
  expect(Array.from(color.array.slice(0, 3))).toEqual([1, 1, 1])       // the untinted wall
  expect(Array.from(color.array.slice(36 * 3, 36 * 3 + 3))).toEqual([0, 1, 0])   // the tinted one
})
