import { test, expect } from 'vitest'
import { existsSync } from 'node:fs'
import {
  ERAS, eraOf, isCollab, creditOf, assignRooms, SOLO_MIN, wallSegments, freeRuns, slotsOnRun, soloRoomSlots, soloRoomSide, WALL_H, DOOR_H, SPACING, CORNER, ROOM_MIN,
  buildGallery, tileRect, ATLAS, ATLAS_SMALL, TILES_PER_ATLAS, WALL_OFFSET, PAINTING, EYE_Y, HIDDEN_FLAGS,
} from './gallery-lib.mjs'
import { readArchiveInputs } from './gallery-inputs.mjs'

const tok = (id, createdAt, author = { id: 'tz1a', name: 'Alice' }, extra = {}) => ({
  id, slug: `p${id}`, name: `P${id}`, flag: 'NONE', createdAt, author, ...extra,
})

test('eraOf buckets by year and quarter, sweeping the ends', () => {
  expect(eraOf('2021-11-03T12:26:02.000Z')).toBe('2021')
  expect(eraOf('2020-01-01T00:00:00.000Z')).toBe('2021')
  expect(eraOf('2022-01-01T00:00:00.000Z')).toBe('2022-q1')
  expect(eraOf('2022-03-31T23:59:59.000Z')).toBe('2022-q1')
  expect(eraOf('2022-04-01T00:00:00.000Z')).toBe('2022-q2')
  expect(eraOf('2022-12-31T00:00:00.000Z')).toBe('2022-q4')
  expect(eraOf('2023-03-31T00:00:00.000Z')).toBe('2023-q1')
  expect(eraOf('2023-04-01T00:00:00.000Z')).toBe('2023-on')
  expect(eraOf('2024-06-20T08:14:15.000Z')).toBe('2023-on')
})

test('every era id is one of the seven, in spine order', () => {
  expect(ERAS.map((e) => e.id)).toEqual([
    '2021', '2022-q1', '2022-q2', '2022-q3', '2022-q4', '2023-q1', '2023-on',
  ])
})

test('a KT1 author is a collaboration and is credited to every member', () => {
  const t = tok(7, '2022-05-01T00:00:00.000Z', { id: 'KT1abc', name: null })
  expect(isCollab(t)).toBe(true)
  expect(isCollab(tok(8, '2022-05-01T00:00:00.000Z'))).toBe(false)
  const collaborations = { '7': { collaborators: [{ id: 'tz1a', name: 'Alice' }, { id: 'tz1b', name: 'Bob' }] } }
  expect(creditOf(t, collaborations)).toBe('Alice and Bob')
  expect(creditOf(tok(8, '2022-05-01T00:00:00.000Z'), {})).toBe('Alice')
})

test('assignRooms gives a solo room at SOLO_MIN, halls to the rest, in date order', () => {
  const alice = { id: 'tz1a', name: 'Alice' }
  const charlie = { id: 'tz1c', name: 'Charlie' }
  const bob = { id: 'tz1b', name: 'Bob' }
  const tokens = [
    ...Array.from({ length: SOLO_MIN }, (_, i) => tok(10 + i, `2021-11-${String(10 + i).padStart(2, '0')}T00:00:00.000Z`, alice)),
    ...Array.from({ length: SOLO_MIN - 1 }, (_, i) => tok(20 + i, `2022-02-0${1 + i}T00:00:00.000Z`, charlie)),
    tok(30, '2021-12-01T00:00:00.000Z', { id: 'KT1abc', name: null }),
  ]
  const collaborations = { '30': { collaborators: [alice, bob] } }
  const { solo, halls, artistCount } = assignRooms(tokens, collaborations)
  expect(solo.map((a) => a.id)).toEqual(['tz1a'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([10, 11, 12, 13, 14])
  expect(halls.get('2021').map((t) => t.id)).toEqual([30])          // the collab, never solo
  expect(halls.get('2022-q1').map((t) => t.id)).toEqual([20, 21, 22, 23])
  expect(halls.get('2022-q3')).toEqual([])                            // every era exists
  expect(artistCount).toBe(3)                                          // alice, bob (in collab), charlie
})

test('assignRooms orders solo artists by their earliest piece, ties by id', () => {
  const tokens = [
    ...[5, 6, 7, 8, 9].map((i) => tok(i, `2022-01-0${i - 4}T00:00:00.000Z`, { id: 'tz1late', name: 'Late' })),
    ...[1, 2, 3, 4, 10].map((i) => tok(i, '2021-11-20T00:00:00.000Z', { id: 'tz1early', name: 'Early' })),
  ]
  const { solo } = assignRooms(tokens, {})
  expect(solo.map((a) => a.id)).toEqual(['tz1early', 'tz1late'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([1, 2, 3, 4, 10])
})

test('an artist with 5+ projects spanning multiple eras still gets a solo room with all projects', () => {
  const crossera = { id: 'tz1cross', name: 'CrossEra' }
  const tokens = [
    tok(1, '2021-11-15T00:00:00.000Z', crossera),
    tok(2, '2021-12-20T00:00:00.000Z', crossera),
    tok(3, '2022-02-10T00:00:00.000Z', crossera),
    tok(4, '2022-03-05T00:00:00.000Z', crossera),
    tok(5, '2023-08-01T00:00:00.000Z', crossera),
  ]
  const { solo, halls } = assignRooms(tokens, {})
  expect(solo.map((a) => a.id)).toEqual(['tz1cross'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([1, 2, 3, 4, 5])
  // None of the projects appear in any hall
  expect(halls.get('2021').length).toBe(0)
  expect(halls.get('2022-q1').length).toBe(0)
  expect(halls.get('2022-q2').length).toBe(0)
  expect(halls.get('2023-on').length).toBe(0)
})

test('wallSegments cuts a door gap and leaves a header above it', () => {
  const segs = wallSegments('z', -4, 0, 10, [{ from: 4, to: 6, top: DOOR_H }])
  expect(segs).toEqual([
    { x1: -4, z1: 0, x2: -4, z2: 4, y0: 0, y1: WALL_H },
    { x1: -4, z1: 4, x2: -4, z2: 6, y0: DOOR_H, y1: WALL_H },
    { x1: -4, z1: 6, x2: -4, z2: 10, y0: 0, y1: WALL_H },
  ])
})

test('wallSegments along x with no gaps is one solid piece', () => {
  expect(wallSegments('x', 8, -4, 4)).toEqual([{ x1: -4, z1: 8, x2: 4, z2: 8, y0: 0, y1: WALL_H }])
})

test('freeRuns keeps CORNER clear of the ends and of each gap', () => {
  expect(freeRuns(0, 10)).toEqual([[CORNER, 10 - CORNER]])
  expect(freeRuns(0, 10, [{ from: 4, to: 6 }])).toEqual([[CORNER, 4 - CORNER], [6 + CORNER, 10 - CORNER]])
  expect(freeRuns(0, 2.5, [{ from: 1, to: 2 }])).toEqual([])   // nothing fits either side
})

test('slotsOnRun places centres at pitch SPACING, centred in the run', () => {
  expect(slotsOnRun(1, 7)).toEqual([1, 4, 7])
  expect(slotsOnRun(1, 8)).toEqual([1.5, 4.5, 7.5])
  expect(slotsOnRun(1, 1)).toEqual([1])
  expect(slotsOnRun(3, 1)).toEqual([])
})

test('soloRoomSide grows the room until its four walls hold every painting', () => {
  expect(soloRoomSide(1)).toBe(ROOM_MIN)
  expect(soloRoomSlots(ROOM_MIN)).toBeGreaterThanOrEqual(SOLO_MIN)
  const s = soloRoomSide(31)
  expect(soloRoomSlots(s)).toBeGreaterThanOrEqual(31)
  expect(soloRoomSlots(s - 1)).toBeLessThan(31)
  expect(s).toBeGreaterThan(20)
  expect(s).toBeLessThan(30)
})

/** ~44 projects: two solo artists in 2021, one in 2022, a collab, singles in every era. */
function fixture() {
  const out = []
  const add = (id, date, author) => out.push(tok(id, `${date}T00:00:00.000Z`, author))
  const A = { id: 'tz1A', name: 'Ada' }, B = { id: 'tz1B', name: 'Bea' }, C = { id: 'tz1C', name: 'Cy' }
  ;[1, 2, 3, 4, 5, 6].forEach((i) => add(100 + i, `2021-11-${10 + i}`, A))
  ;[1, 2, 3, 4, 5].forEach((i) => add(200 + i, `2021-12-0${i}`, B))
  ;[1, 2, 3, 4, 5].forEach((i) => add(300 + i, `2022-05-0${i}`, C))
  ;[1, 2, 3].forEach((i) => add(400 + i, `2022-06-0${i}`, { id: 'KT1x', name: null }))
  const eras = ['2021-11-20', '2022-02-10', '2022-05-10', '2022-08-10', '2022-11-10', '2023-02-10', '2023-08-10']
  let id = 500
  for (const d of eras) for (let i = 0; i < 3; i++) add(id++, d, { id: `tz1s${id}`, name: `Solo ${id}` })
  out.push(tok(999, '2022-01-01T00:00:00.000Z', A, { flag: 'HIDDEN' }))   // must vanish
  return out
}
const duo = { collaborators: [{ id: 'tz1A', name: 'Ada' }, { id: 'tz1B', name: 'Bea' }] }
const collaborations = { '401': duo, '402': duo, '403': duo }

const overlap = (a, b) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.z + a.d, b.z + b.d) - Math.max(a.z, b.z))

/** Which edge of `rect` the point sits against, its inward normal yaw, and the coordinate along it. */
function edgeOf(rect, x, z) {
  const d = [
    { edge: 'w', dist: x - rect.x, yaw: Math.PI / 2, along: z, from: rect.z, to: rect.z + rect.d },
    { edge: 'e', dist: rect.x + rect.w - x, yaw: -Math.PI / 2, along: z, from: rect.z, to: rect.z + rect.d },
    { edge: 's', dist: z - rect.z, yaw: 0, along: x, from: rect.x, to: rect.x + rect.w },
    { edge: 'n', dist: rect.z + rect.d - z, yaw: Math.PI, along: x, from: rect.x, to: rect.x + rect.w },
  ]
  return d.reduce((m, e) => (e.dist < m.dist ? e : m))
}

function checkInvariants(g, expectedIds) {
  const rooms = new Map(g.rooms.map((r) => [r.id, r]))
  // placed exactly once
  expect([...g.paintings.map((p) => p.project)].sort((a, b) => a - b)).toEqual([...expectedIds].sort((a, b) => a - b))
  // rooms do not overlap
  for (let i = 0; i < g.rooms.length; i++)
    for (let j = i + 1; j < g.rooms.length; j++)
      expect(overlap(g.rooms[i].rect, g.rooms[j].rect)).toBeLessThan(1e-6)
  // on an edge of its own room, facing in, spaced, clear of corners
  const byEdge = new Map()
  for (const p of g.paintings) {
    const r = rooms.get(p.room)
    expect(r).toBeDefined()
    const e = edgeOf(r.rect, p.x, p.z)
    expect(Math.abs(e.dist - WALL_OFFSET)).toBeLessThan(1e-6)
    expect(Math.sin(p.yaw) * Math.sin(e.yaw) + Math.cos(p.yaw) * Math.cos(e.yaw)).toBeCloseTo(1, 6)
    expect(e.along - e.from).toBeGreaterThanOrEqual(CORNER - 1e-6)
    expect(e.to - e.along).toBeGreaterThanOrEqual(CORNER - 1e-6)
    const key = `${p.room}:${e.edge}`
    if (!byEdge.has(key)) byEdge.set(key, [])
    byEdge.get(key).push(e.along)
  }
  for (const along of byEdge.values()) {
    along.sort((a, b) => a - b)
    // 1e-5: the build rounds every coordinate to a micrometre, so two neighbours can differ by 3 ∓ 1e-6.
    for (let i = 1; i < along.length; i++) expect(along[i] - along[i - 1]).toBeGreaterThanOrEqual(SPACING - 1e-5)
  }
  // every door/opening header joins exactly two rooms and no solid wall crosses it
  const onBoundary = (r, x, z) => {
    const eps = 1e-6
    const inX = x >= r.rect.x - eps && x <= r.rect.x + r.rect.w + eps
    const inZ = z >= r.rect.z - eps && z <= r.rect.z + r.rect.d + eps
    const onX = Math.abs(x - r.rect.x) < eps || Math.abs(x - r.rect.x - r.rect.w) < eps
    const onZ = Math.abs(z - r.rect.z) < eps || Math.abs(z - r.rect.z - r.rect.d) < eps
    return (onX && inZ) || (onZ && inX)
  }
  const solid = g.walls.filter((w) => w.y0 === 0)
  for (const h of g.walls.filter((w) => w.y0 > 0)) {
    const mx = (h.x1 + h.x2) / 2, mz = (h.z1 + h.z2) / 2
    expect(g.rooms.filter((r) => onBoundary(r, mx, mz)).length).toBe(2)
    for (const s of solid) {
      const sameLine = (h.x1 === h.x2 && s.x1 === s.x2 && s.x1 === h.x1) || (h.z1 === h.z2 && s.z1 === s.z2 && s.z1 === h.z1)
      if (!sameLine) continue
      const [a1, a2] = h.x1 === h.x2 ? [h.z1, h.z2] : [h.x1, h.x2]
      const [b1, b2] = h.x1 === h.x2 ? [s.z1, s.z2] : [s.x1, s.x2]
      expect(Math.min(a2, b2) - Math.max(a1, b1)).toBeLessThanOrEqual(1e-6)
    }
  }
  // every painting has a plaque, every room a sign
  expect(g.signs.filter((s) => s.kind === 'plaque').length).toBe(g.paintings.length)
  for (const r of g.rooms) if (r.kind === 'solo') expect(g.signs.filter((s) => s.kind === 'room' && s.text === r.title).length).toBe(2)
  // tiles are ascending project id and the file count matches
  expect(g.paintings.map((p) => p.tile)).toEqual(g.paintings.map((_, i) => i))
  for (let i = 1; i < g.paintings.length; i++) expect(g.paintings[i].project).toBeGreaterThan(g.paintings[i - 1].project)
  expect(g.atlas.files.length).toBe(Math.ceil(g.paintings.length / TILES_PER_ATLAS))
}

test('buildGallery satisfies the layout invariants on the fixture', () => {
  const tokens = fixture()
  const g = buildGallery({ tokens, collaborations, generatedAt: '2026-08-23T00:00:00.000Z' })
  checkInvariants(g, tokens.filter((t) => t.flag !== 'HIDDEN').map((t) => t.id))
  expect(g.rooms.map((r) => r.id)).toContain('tz1A')
  expect(g.rooms.map((r) => r.id)).toContain('tz1B')
  expect(g.rooms.map((r) => r.id)).toContain('tz1C')
  expect(g.rooms.find((r) => r.id === 'tz1A').rect.x).toBeLessThan(-4)      // first solo room: left
  expect(g.rooms.find((r) => r.id === 'tz1B').rect.x).toBeGreaterThanOrEqual(4) // second: right
  expect(g.paintings.find((p) => p.project === 401).artist).toBe('Ada and Bea')
  expect(g.paintings.find((p) => p.project === 401).room).toBe('2022-q2')
  expect(g.counts).toEqual({ paintings: 40, artists: 24, soloRooms: 3, years: [2021, 2023] })
  expect(g.spawn).toEqual({ x: 0, z: 4, yaw: 0 })
  expect(g.rooms[0]).toMatchObject({ id: 'lobby', kind: 'lobby' })
  expect(g.rooms.filter((r) => r.kind === 'hall').map((r) => r.id)).toEqual(ERAS.map((e) => e.id))
})

test('buildGallery is deterministic', () => {
  const a = buildGallery({ tokens: fixture(), collaborations, generatedAt: 'x' })
  const b = buildGallery({ tokens: fixture().reverse(), collaborations, generatedAt: 'x' })
  expect(JSON.stringify(a)).toBe(JSON.stringify(b))
})

test('tileRect maps a tile to its file, cell and pixel origin, in both sizes', () => {
  expect(tileRect(0)).toEqual({ file: 0, col: 0, row: 0, x: 4, y: 4, cell: 264 })
  expect(tileRect(224)).toEqual({ file: 0, col: 14, row: 14, x: 3700, y: 3700, cell: 264 })
  expect(tileRect(225)).toMatchObject({ file: 1, col: 0, row: 0 })
  expect(tileRect(224).x + ATLAS.tile + ATLAS.gutter).toBeLessThanOrEqual(ATLAS.size)
  expect(tileRect(224, ATLAS_SMALL)).toEqual({ file: 0, col: 14, row: 14, x: 1850, y: 1850, cell: 132 })
  expect(tileRect(224, ATLAS_SMALL).x + ATLAS_SMALL.tile + ATLAS_SMALL.gutter).toBeLessThanOrEqual(ATLAS_SMALL.size)
  expect(TILES_PER_ATLAS).toBe(225)
})

const REAL = 'public/data/generators/manifest.json'
test.skipIf(!existsSync(REAL))('the real archive satisfies the invariants and needs two atlases', async () => {
  const { tokens, collaborations } = await readArchiveInputs('public/data')
  const g = buildGallery({ tokens, collaborations, generatedAt: 'x' })
  checkInvariants(g, tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag)).map((t) => t.id))
  expect(g.atlas.files.length).toBe(2)
})
