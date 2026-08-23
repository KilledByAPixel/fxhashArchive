import { test, expect } from 'vitest'
import {
  tileUv, atlasFile, buildPaintingGeometry, buildFrameGeometry, buildWallGeometry, buildFloorGeometry, buildSignGeometry,
} from './geometry'
import type { AtlasMeta, Painting, Room, Sign, Wall } from './types'
import { EYE_Y, PAINTING, WALL_T } from './constants'

const atlas: AtlasMeta = { size: 4096, tile: 256, gutter: 4, cols: 15, files: ['a', 'b'], small: ['c', 'd'] }
const painting = (tile: number, over: Partial<Painting> = {}): Painting => ({
  project: tile, slug: 'p', name: 'P', artist: 'A', year: 2022, room: 'r', x: -3.98, z: 20, yaw: Math.PI / 2, tile, ...over,
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

test('paintings become one quad each, only for the requested file', () => {
  const g = buildPaintingGeometry([painting(0), painting(1), painting(225)], atlas, 0)
  expect(g.getAttribute('position').count).toBe(12)
  expectBounds(g, 1, EYE_Y - PAINTING / 2, EYE_Y + PAINTING / 2)
  expectBounds(g, 0, -3.98, -3.98)              // flat against the wall plane
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
  expect(bounds(g, 0)[0]).toBeLessThan(-3.98)
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

test('each room gets a floor and a ceiling', () => {
  const r: Room = { id: 'x', kind: 'hall', title: 'X', rect: { x: -4, z: 0, w: 8, d: 10 }, entry: { x: 0, z: 1, yaw: 0 } }
  const g = buildFloorGeometry([r])
  expect(g.getAttribute('position').count).toBe(12)
  expectBounds(g, 1, 0, 4)
  expectBounds(g, 0, -4, 4)
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
