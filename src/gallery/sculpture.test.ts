import { test, expect } from 'vitest'
import {
  plinths, plinthObstacles, buildSculptureGeometry,
  GRID, GRID_SPACING, PLINTH_SIDE, PLINTH_H, SCULPTURE_MIN_SIDE,
} from './sculpture'
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

test('the whole room is one low-poly mesh', () => {
  const g = buildSculptureGeometry(plinths(G))
  const verts = g.getAttribute('position').count
  expect(verts % 3).toBe(0)
  // Low poly is the brief. Nine plinths and nine sculptures, well under 5k triangles.
  expect(verts / 3).toBeLessThan(5000)
  expect(verts / 3).toBeGreaterThan(500)
  // One mesh means one attribute set, colour included — stone and plaster differ
  // by vertex colour, not by material.
  expect(g.getAttribute('color').count).toBe(verts)
  expect(g.getAttribute('normal').count).toBe(verts)
  expect(g.groups.length).toBe(0)   // no multi-material split
})

test('nothing floats and nothing sinks: every object sits on its own plinth', () => {
  const list = plinths(G)
  const g = buildSculptureGeometry(list)
  const pos = g.getAttribute('position').array
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
  const a = buildSculptureGeometry(plinths(G)).getAttribute('position').array
  const b = buildSculptureGeometry(plinths(G)).getAttribute('position').array
  expect(Array.from(a)).toEqual(Array.from(b))
  // And a different seed is a different object, or the generator is not generating.
  const other = plinths(G).map((p, i) => ({ ...p, seed: p.seed + 1 + i }))
  expect(Array.from(buildSculptureGeometry(other).getAttribute('position').array)).not.toEqual(Array.from(a))
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
