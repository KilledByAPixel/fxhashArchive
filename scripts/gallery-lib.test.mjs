import { test, expect } from 'vitest'
import { existsSync } from 'node:fs'
import {
  ERAS, eraOf, isCollab, creditOf, assignRooms, SOLO_MIN, wallSegments, freeRuns, hangOnRun, GAP, WALL_H, DOOR_H, SPACING, CORNER, ROOM_MIN, ROOM_MID, WALL_T,
  buildGallery, tileRect, ATLAS, ATLAS_SMALL, TILES_PER_ATLAS, WALL_OFFSET, SIGN_OFFSET, PAINTING, EYE_Y, HIDDEN_FLAGS,
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
  // Written against SOLO_MIN rather than a number: Alice has exactly enough for a
  // room, Bob one too few, Carol one piece on her own, and the collab never counts.
  const alice = { id: 'tz1a', name: 'Alice' }
  const bob = { id: 'tz1b', name: 'Bob' }
  const carol = { id: 'tz1c', name: 'Carol' }
  const tokens = [
    ...Array.from({ length: SOLO_MIN }, (_, i) => tok(10 + i, `2021-11-${String(10 + i).padStart(2, '0')}T00:00:00.000Z`, alice)),
    ...Array.from({ length: SOLO_MIN - 1 }, (_, i) => tok(20 + i, `2022-02-0${1 + i}T00:00:00.000Z`, bob)),
    tok(30, '2021-12-01T00:00:00.000Z', { id: 'KT1abc', name: null }),
    tok(31, '2023-06-01T00:00:00.000Z', carol),
  ]
  const collaborations = { '30': { collaborators: [alice, bob] } }
  const { solo, halls, artistCount } = assignRooms(tokens, collaborations, { twoPieceRooms: 0 })
  expect(solo.map((a) => a.id)).toEqual(['tz1a'])
  expect(solo[0].projects.map((t) => t.id)).toEqual(Array.from({ length: SOLO_MIN }, (_, i) => 10 + i))
  expect(halls.get('2021').map((t) => t.id)).toEqual([30])          // the collab, never solo
  expect(halls.get('2022-q1').map((t) => t.id)).toEqual(Array.from({ length: SOLO_MIN - 1 }, (_, i) => 20 + i))
  expect(halls.get('2023-on').map((t) => t.id)).toEqual([31])
  expect(halls.get('2022-q3')).toEqual([])                            // every era exists
  expect(artistCount).toBe(3)
})

test('a KT1 project with no collaborations entry does not raise artistCount', () => {
  // Skipping this case, rather than falling through to crediting the contract
  // address itself, is the fix: the contract is not a person, and counting it
  // inflates the lobby's "N artists" figure by one per unresolved collaboration.
  const alice = { id: 'tz1a', name: 'Alice' }
  const tokens = [
    ...Array.from({ length: SOLO_MIN }, (_, i) => tok(10 + i, `2021-11-${String(10 + i).padStart(2, '0')}T00:00:00.000Z`, alice)),
    tok(50, '2022-01-01T00:00:00.000Z', { id: 'KT1nocollab', name: null }),
  ]
  const { artistCount, halls } = assignRooms(tokens, {})   // no collaborations recorded at all
  expect(halls.get('2022-q1').map((t) => t.id)).toEqual([50])
  expect(artistCount).toBe(1)   // alice only — the KT1 address is not a person
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

// Frank, round five: "a ton of empty space between paintings". Pieces are hung
// by the wall between them, not by a pitch: GAP of wall between neighbours' edges,
// whatever their widths, and what is left over shared evenly along the run.
test('GAP is the wall between neighbours; SPACING is the pitch of two square pieces', () => {
  expect(GAP).toBe(1)
  expect(SPACING).toBeCloseTo(PAINTING + GAP, 9)
})

test('hangOnRun hangs pieces of these widths GAP apart, the slack shared evenly, or null when they do not fit', () => {
  // [a, b] is where a square piece's centre may go, so its edges may reach a - 0.6 and b + 0.6
  expect(hangOnRun(1, 7, [1.2, 1.2]).map((c) => +c.toFixed(4))).toEqual([2.2667, 5.7333])
  expect(hangOnRun(1, 7, [1.2, 1.2, 1.2]).map((c) => +c.toFixed(4))).toEqual([1.4, 4, 6.6])
  expect(hangOnRun(1, 7, [2.4])[0]).toBeCloseTo(4, 9)
  expect(hangOnRun(1, 1, [1.2])[0]).toBeCloseTo(1, 9)
  expect(hangOnRun(1, 1, [2.4])).toBeNull()          // a piece twice the square on a one-square spot
  expect(hangOnRun(1, 3, [1.2, 1.2, 1.2])).toBeNull() // three on a wall for two
  expect(hangOnRun(1, 7, [])).toEqual([])
  // not spread: one group in the middle, exactly GAP apart — a room's wall
  expect(hangOnRun(1, 7, [1.2, 1.2], false).map((c) => +c.toFixed(4))).toEqual([2.9, 5.1])
  expect(hangOnRun(1, 7, [0.6, 1.2], false).map((c) => +c.toFixed(4))).toEqual([2.9, 4.8])
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
  // One token per moderation flag, so a fixture-level check catches a flag that
  // HIDDEN_FLAGS (or a filter that only tests against 'HIDDEN') stops covering.
  out.push(tok(996, '2022-01-02T00:00:00.000Z', A, { flag: 'MALICIOUS' }))        // must vanish
  out.push(tok(997, '2022-01-03T00:00:00.000Z', A, { flag: 'REPORTED' }))         // must vanish
  out.push(tok(998, '2022-01-04T00:00:00.000Z', A, { flag: 'AUTO_DETECT_COPY' })) // must vanish
  out.push(tok(999, '2022-01-01T00:00:00.000Z', A, { flag: 'HIDDEN' }))           // must vanish
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

/** The wall between neighbouring pictures on the same wall, in rooms of this kind. */
function edgeGaps(g, kind) {
  const rooms = new Map(g.rooms.map((r) => [r.id, r]))
  const byEdge = new Map()
  for (const p of g.paintings) {
    const r = rooms.get(p.room)
    if (r.kind !== kind) continue
    const e = edgeOf(r.rect, p.x, p.z)
    const key = `${p.room}:${e.edge}`
    if (!byEdge.has(key)) byEdge.set(key, [])
    byEdge.get(key).push({ along: e.along, w: p.w })
  }
  const gaps = []
  for (const list of byEdge.values()) {
    list.sort((a, b) => a.along - b.along)
    for (let i = 1; i < list.length; i++) gaps.push(list[i].along - list[i - 1].along - (list[i].w + list[i - 1].w) / 2)
  }
  return gaps
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]

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
    // a square piece keeps its centre CORNER from the wall's ends; a wider one keeps its edge where that square's edge would be
    expect(e.along - p.w / 2 - e.from).toBeGreaterThanOrEqual(CORNER - PAINTING / 2 - 1e-6)
    expect(e.to - (e.along + p.w / 2)).toBeGreaterThanOrEqual(CORNER - PAINTING / 2 - 1e-6)
    const key = `${p.room}:${e.edge}`
    if (!byEdge.has(key)) byEdge.set(key, [])
    byEdge.get(key).push({ along: e.along, w: p.w })
    // nothing solid stands in front of the picture: a wall meeting this one on the
    // room's side (an era portal's pier, a corner) keeps the same clearance
    const nx = Math.sin(p.yaw), nz = Math.cos(p.yaw)
    const lineX = p.x - nx * WALL_OFFSET, lineZ = p.z - nz * WALL_OFFSET
    for (const w of g.walls.filter((w) => w.y0 === 0)) {
      const alongZ = Math.abs(nx) > 0.5   // this wall runs along z, so a crossing wall runs along x
      const crossing = alongZ ? w.z1 === w.z2 : w.x1 === w.x2
      if (!crossing) continue
      const [lo, hi] = alongZ ? [Math.min(w.x1, w.x2), Math.max(w.x1, w.x2)] : [Math.min(w.z1, w.z2), Math.max(w.z1, w.z2)]
      const line = alongZ ? lineX : lineZ
      if (line < lo - 1e-6 || line > hi + 1e-6) continue                       // does not meet this wall
      const inFront = alongZ ? (nx > 0 ? hi : lo) : (nz > 0 ? hi : lo)         // its far end is on the picture's side
      if (Math.abs(inFront - line) < WALL_T / 2 + 1e-6) continue                 // only touches from behind
      const s = alongZ ? w.z1 : w.x1
      const along = alongZ ? p.z : p.x
      expect(Math.abs(s - along) - p.w / 2).toBeGreaterThanOrEqual(CORNER - PAINTING / 2 - 1e-6)
    }
  }
  for (const list of byEdge.values()) {
    list.sort((a, b) => a.along - b.along)
    // 1e-5: the build rounds every coordinate to a micrometre.
    for (let i = 1; i < list.length; i++)
      expect(list[i].along - list[i - 1].along - (list[i].w + list[i - 1].w) / 2).toBeGreaterThanOrEqual(GAP - 1e-5)
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
  // Every hidden flag, not just 'HIDDEN' — see the MALICIOUS/REPORTED/AUTO_DETECT_COPY
  // tokens the fixture adds alongside it.
  checkInvariants(g, tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag)).map((t) => t.id))
  expect(g.rooms.map((r) => r.id)).toContain('tz1A')
  expect(g.rooms.map((r) => r.id)).toContain('tz1B')
  expect(g.rooms.map((r) => r.id)).toContain('tz1C')
  expect(g.rooms.find((r) => r.id === 'tz1A').rect.x).toBeLessThan(-4)      // first solo room: left
  expect(g.rooms.find((r) => r.id === 'tz1B').rect.x).toBeGreaterThanOrEqual(4) // second: right
  expect(g.paintings.find((p) => p.project === 401).artist).toBe('Ada and Bea')
  expect(LOOP_IDS).toContain(g.paintings.find((p) => p.project === 401).room.replace(/-\d+$/, ''))   // a collab hangs in the corridor
  expect(g.counts).toEqual({ paintings: 40, artists: 24, soloRooms: 3, years: [2021, 2023] })
  expect(g.spawn).toEqual({ x: 0, z: 4, yaw: 0 })
  expect(g.rooms[0]).toMatchObject({ id: 'lobby', kind: 'lobby' })
  expect(g.rooms.filter((r) => r.kind === 'hall').map((r) => r.id).filter((id) => !/-\d+$/.test(id))).toEqual(LOOP_IDS)
  expect(g.rooms.filter((r) => r.kind === 'era').map((r) => r.id)).toEqual(ERAS.map((e) => e.id))
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
  const { tokens, collaborations, sizes } = await readArchiveInputs('public/data')
  const g = buildGallery({ tokens, collaborations, sizes, generatedAt: 'x' })
  checkInvariants(g, tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag)).map((t) => t.id))
  expect(g.atlas.files.length).toBe(2)
  // hung close: the typical wall between two corridor neighbours is about GAP, not the
  // four metres the first loop left (its leg length came from a bound that charged
  // every room its whole frontage, when a room only costs its door)
  // The corridor is the rooms' length (68 m a leg on this archive, from 114), and
  // its pieces are spread over that, so the typical wall between two neighbours is
  // GAP and a half; a room's wall hangs its group at exactly GAP.
  const gaps = edgeGaps(g, 'hall')
  expect(gaps.length).toBeGreaterThan(100)
  expect(median(gaps)).toBeLessThanOrEqual(GAP + 0.75)
  expect(median(edgeGaps(g, 'solo'))).toBeCloseTo(GAP, 5)
  expect(g.rooms.filter((r) => r.kind === 'hall').map((r) => r.id).filter((id) => !/-\d+$/.test(id))).toEqual(LOOP_IDS)
  expect(g.counts.soloRooms).toBeGreaterThan(19)   // more than the first build's five-piece rule gave
}, 30000)

// ---- the loop ---------------------------------------------------------------
// Frank walked the first build: rooms clustered where the veteran artists were and
// the second half was a corridor with nothing off it. The building is now a loop,
// every artist with two or more pieces has a room, and rooms alternate outside
// and inside the loop in date order, so the beat of doors is regular all the way
// round and you arrive back where you started.

import { roomSide, distribute, partition, LOOP_IDS, TWO_PIECE_ROOMS, INNER_MARGIN, ROOM_GAP, DOOR_H } from './gallery-lib.mjs'

test('partition keeps the order, makes the largest block as small as it can be, and leaves no block bare', () => {
  const blocks = (ws, counts) => { let i = 0; return counts.map((c) => ws.slice(i, (i += c)).reduce((t, w) => t + w, 0)) }
  expect(partition([20, 6, 6, 6, 6, 6, 6], 4)).toEqual([1, 2, 2, 2])          // the one even split with the 20 alone
  const p = partition([6, 6, 6, 20, 6, 6, 6], 4)
  expect(p.reduce((t, c) => t + c, 0)).toBe(7)
  expect(Math.max(...blocks([6, 6, 6, 20, 6, 6, 6], p))).toBe(20)
  expect(Math.min(...p)).toBeGreaterThanOrEqual(1)
  expect(partition([1, 1, 1, 1], 4)).toEqual([1, 1, 1, 1])
  expect(partition([5, 5], 4)).toEqual([1, 1, 0, 0])                          // fewer rooms than legs: the first legs take them
  expect(partition([], 4)).toEqual([0, 0, 0, 0])
})

test('a room for three pieces, or for two pieces and enough sales', () => {
  expect(SOLO_MIN).toBe(3)
  expect(TWO_PIECE_ROOMS).toBe(8)
})

test('two-piece artists get a room only if they are among the top TWO_PIECE_ROOMS by sales', () => {
  const mk = (id, name) => ({ id, name })
  const tokens = [
    tok(1, '2022-01-01T00:00:00.000Z', mk('tz1p', 'Poor')), tok(2, '2022-01-02T00:00:00.000Z', mk('tz1p', 'Poor')),
    tok(3, '2022-02-01T00:00:00.000Z', mk('tz1r', 'Rich')), tok(4, '2022-02-02T00:00:00.000Z', mk('tz1r', 'Rich')),
    tok(5, '2022-03-01T00:00:00.000Z', mk('tz1m', 'Middling')), tok(6, '2022-03-02T00:00:00.000Z', mk('tz1m', 'Middling')),
  ]
  const volumes = new Map([[1, 10], [2, 10], [3, 5000], [4, 5000], [5, 100], [6, 100]])
  const { solo } = assignRooms(tokens, {}, { volumes, twoPieceRooms: 2 })
  expect(solo.map((a) => a.name)).toEqual(['Rich', 'Middling'])   // still in order of first piece
  expect(assignRooms(tokens, {}, { volumes, twoPieceRooms: 0 }).solo).toEqual([])
})

test('roomSide: a 6 m room for up to four pieces, growing with the walls it must fill; wide pieces need more', () => {
  expect(roomSide(2)).toBe(6)
  expect(roomSide(4)).toBe(6)
  expect(roomSide(5)).toBeGreaterThanOrEqual(ROOM_MID)
  for (let n = 5; n < 40; n++) expect(roomSide(n + 1)).toBeGreaterThanOrEqual(roomSide(n))
  expect(roomSide(31)).toBeLessThan(24)                                   // hung closer than the 3 m pitch did
  expect(roomSide(5, [2.4, 2.4, 2.4, 2.4, 2.4])).toBeGreaterThan(roomSide(5))
  expect(roomSide(4, [2.4, 2.4, 2.4, 2.4])).toBeGreaterThan(6)          // the door wall's halves cannot take a double-width piece
  expect(roomSide(5, [0.6, 0.6, 0.6, 0.6, 0.6])).toBeLessThanOrEqual(roomSide(5))   // portraits, PAINTING tall and narrower, never need more
})

test('distribute fills the wall facing the door, then the sides, then the door wall, one each before doubling up', () => {
  // capacities in wall order: facing, left, right, door-left run, door-right run
  expect(distribute([2, 2, 2, 1, 1], 2)).toEqual([1, 1, 0, 0, 0])
  expect(distribute([2, 2, 2, 1, 1], 3)).toEqual([1, 1, 1, 0, 0])
  expect(distribute([2, 2, 2, 1, 1], 4)).toEqual([1, 1, 1, 1, 0])
  expect(distribute([2, 2, 2, 1, 1], 6)).toEqual([2, 1, 1, 1, 1])
  expect(distribute([3, 3, 3, 1, 1], 8)).toEqual([2, 2, 2, 1, 1])
  expect(distribute([1, 1, 1, 0, 0], 3)).toEqual([1, 1, 1, 0, 0])
})

/** Four artists with 2, 3, 4 and 6 pieces, a dozen singles across every era, one collab. */
function loopFixture() {
  const out = []
  const add = (id, date, author) => out.push(tok(id, `${date}T00:00:00.000Z`, author))
  const A = { id: 'tz1A', name: 'Ada' }, B = { id: 'tz1B', name: 'Bea' }, C = { id: 'tz1C', name: 'Cy' }, D = { id: 'tz1D', name: 'Dee' }
  add(101, '2021-11-11', A); add(102, '2021-11-12', A)
  ;[1, 2, 3].forEach((i) => add(200 + i, `2022-02-0${i}`, B))
  ;[1, 2, 3, 4].forEach((i) => add(300 + i, `2022-05-0${i}`, C))
  ;[1, 2, 3, 4, 5, 6].forEach((i) => add(400 + i, `2023-0${i}-01`, D))
  const dates = ['2021-11-20', '2021-12-05', '2022-01-10', '2022-03-10', '2022-04-10', '2022-06-10',
    '2022-07-10', '2022-09-10', '2022-10-10', '2022-12-10', '2023-02-10', '2023-08-10']
  dates.forEach((d, i) => add(500 + i, d, { id: `tz1s${i}`, name: `Solo ${i}` }))
  add(700, '2022-06-15', { id: 'KT1x', name: null })
  return out
}
const loopCollabs = { '700': duo }
const loop = () => buildGallery({ tokens: loopFixture(), collaborations: loopCollabs, generatedAt: 'x' })
/** A leg's era sections: 'leg-a', 'leg-a-2', … */
const sections = (g, id) => g.rooms.filter((r) => r.kind === 'hall' && (r.id === id || r.id.startsWith(id + '-')))
/** The [min, max] a set of rooms spans on an axis. */
const extent = (rs, axis) => [
  Math.min(...rs.map((r) => r.rect[axis])),
  Math.max(...rs.map((r) => r.rect[axis] + r.rect[axis === 'x' ? 'w' : 'd'])),
]

test('the museum is a loop: four legs and four corners, closing on the lobby', () => {
  const g = loop()
  expect(g.rooms.filter((r) => r.kind === 'hall').map((r) => r.id).filter((id) => !/-\d+$/.test(id))).toEqual(LOOP_IDS)
  const lobby = g.rooms.find((r) => r.id === 'lobby').rect
  const [az0, az1] = extent(sections(g, 'leg-a'), 'z')
  const [dx0, dx1] = extent(sections(g, 'leg-d'), 'x')
  const [dz0, dz1] = extent(sections(g, 'leg-d'), 'z')
  expect(az0).toBeCloseTo(lobby.z + lobby.d, 9)        // leg A leaves the lobby northward
  expect(dx0).toBeCloseTo(lobby.x + lobby.w, 9)        // leg D comes back into the lobby's east side
  expect(dz0).toBeCloseTo(lobby.z, 9)
  expect(dz1 - dz0).toBeCloseTo(lobby.d, 9)
  const [cz0, cz1] = extent(sections(g, 'leg-c'), 'z')
  const [bx0, bx1] = extent(sections(g, 'leg-b'), 'x')
  expect(cz1 - cz0).toBeCloseTo(az1 - az0, 9)          // opposite legs match, so the corners are square
  expect(bx1 - bx0).toBeCloseTo(dx1 - dx0, 9)
  checkInvariants(g, loopFixture().map((t) => t.id))
})

test('every artist with two or more pieces has a room, and rooms sit on both sides of the corridor', () => {
  const g = loop()
  const solo = g.rooms.filter((r) => r.kind === 'solo')
  expect(solo.map((r) => r.id).sort()).toEqual(['tz1A', 'tz1B', 'tz1C', 'tz1D'])
  expect(g.counts.soloRooms).toBe(4)
  const a = sections(g, 'leg-a')[0].rect
  const outside = solo.filter((r) => r.rect.x + r.rect.w <= a.x + 1e-6)   // west of leg A
  const inside = solo.filter((r) => r.rect.x >= a.x + a.w - 1e-6)         // east of it, in the courtyard
  expect(outside.length).toBeGreaterThanOrEqual(1)
  expect(inside.length).toBeGreaterThanOrEqual(1)
})

test('era markers replace era halls: one per era, zero-area, standing in the corridor, with a sign', () => {
  const g = loop()
  const eras = g.rooms.filter((r) => r.kind === 'era')
  expect(eras.map((r) => r.id)).toEqual(ERAS.map((e) => e.id))
  const halls = g.rooms.filter((r) => r.kind === 'hall')
  for (const m of eras) {
    expect(m.rect.w).toBe(0)
    expect(m.rect.d).toBe(0)
    const standing = halls.some((r) =>
      m.entry.x >= r.rect.x && m.entry.x <= r.rect.x + r.rect.w && m.entry.z >= r.rect.z && m.entry.z <= r.rect.z + r.rect.d)
    expect(standing).toBe(true)
  }
  expect(g.signs.filter((s) => s.kind === 'era').length).toBe(2 * ERAS.length - 1)
})

test('no blank walls: a room spreads its pieces over its walls', () => {
  const g = loop()
  const wallsUsed = (id) => {
    const r = g.rooms.find((x) => x.id === id)
    return new Set(g.paintings.filter((p) => p.room === id).map((p) => edgeOf(r.rect, p.x, p.z).edge)).size
  }
  expect(wallsUsed('tz1A')).toBe(2)   // two pieces: two walls
  expect(wallsUsed('tz1B')).toBe(3)   // three: three walls
  expect(wallsUsed('tz1C')).toBe(4)   // four: every wall
  expect(wallsUsed('tz1D')).toBe(4)   // six: every wall, two of them doubled
})

// ---- round three: merit, beat, portals ------------------------------------------
// Frank walked the loop: rooms and corridor pieces both ran out halfway round,
// leaving the second half bare. Rooms now sit at an even beat along every leg and
// the corridor's pieces are spread over every stretch of wall; era portals — a
// lintel across the corridor with the era on it — mark the timeline; and a sign
// on the way back into the lobby says you have come full circle.

test('rooms sit at an even beat along a leg: equal gaps before, between and after them', () => {
  const g = loop()
  const secs = sections(g, 'leg-a')
  const [zA0, zA1] = extent(secs, 'z')
  const legA = { x: secs[0].rect.x, w: secs[0].rect.w, z: zA0, d: zA1 - zA0 }
  const solo = g.rooms.filter((r) => r.kind === 'solo')
  const outside = solo.filter((r) => Math.abs(r.rect.x + r.rect.w - legA.x) < 1e-6).sort((p, q) => p.rect.z - q.rect.z)
  const inside = solo.filter((r) => Math.abs(r.rect.x - legA.x - legA.w) < 1e-6).sort((p, q) => p.rect.z - q.rect.z)
  expect(outside.length + inside.length).toBeGreaterThanOrEqual(1)
  for (const [rooms, margin] of [[outside, ROOM_GAP], [inside, INNER_MARGIN]]) {
    if (!rooms.length) continue
    const bounds = [legA.z + margin, ...rooms.flatMap((r) => [r.rect.z, r.rect.z + r.rect.d]), legA.z + legA.d - margin]
    const gaps = []
    for (let i = 0; i < bounds.length; i += 2) gaps.push(bounds[i + 1] - bounds[i])
    for (const gap of gaps) expect(gap).toBeCloseTo(gaps[0], 4)   // coordinates are rounded to a micrometre
  }
})

test('corridor pieces go all the way round: every leg has some', () => {
  const g = loop()
  for (const id of ['leg-a', 'leg-b', 'leg-c', 'leg-d']) {
    const n = g.paintings.filter((p) => p.room === id || p.room.startsWith(id + '-')).length
    expect(n).toBeGreaterThanOrEqual(1)
  }
})

test('era portals: the corridor is sectioned by era, each section titled with its era', () => {
  const g = loop()
  const halls = g.rooms.filter((r) => r.kind === 'hall')
  const titles = new Set(halls.map((r) => r.title))
  for (const title of titles) expect(ERAS.map((e) => e.label)).toContain(title)
  expect(titles.size).toBeGreaterThanOrEqual(3)
  expect(g.signs.filter((s) => s.kind === 'era').length).toBe(2 * ERAS.length - 1)
  // a portal is a lintel across the corridor whose midpoint lies on the line between two sections
  const lintels = g.walls.filter((w) => w.y0 === DOOR_H)
  expect(lintels.length).toBeGreaterThanOrEqual(3)   // the lobby's opening, the way back in, and at least one portal
  checkInvariants(g, loopFixture().map((t) => t.id))
})

test('you can go full circle: a lintel and a sign on the way back into the lobby', () => {
  const g = loop()
  const back = g.walls.find((w) => w.y0 === DOOR_H && Math.abs(w.x1 - 4) < 1e-6 && Math.abs(w.x2 - 4) < 1e-6)
  expect(back).toBeDefined()
  const sign = g.signs.find((s) => s.kind === 'title' && /walked/i.test(s.text))
  expect(sign).toBeDefined()
  expect(sign.x).toBeGreaterThan(4)                 // hangs on the leg D side, facing the returning walker
  expect(sign.yaw).toBeCloseTo(Math.PI / 2, 6)
})

// ---- signs you can read, where you expect them ----------------------------------
// Frank could not read the names or the era markers from the corridor, and found
// an era sign floating in mid-air at a corner: a hemmed-in first piece sent its
// portal to the wrong leg and skipped the lintel.

/** Distance from a point to the nearest lintel (a wall segment with y0 > 0), in the floor plan. */
const nearestLintel = (g, x, z) => Math.min(...g.walls.filter((w) => w.y0 > 0).map((w) => {
  const dx = w.x2 - w.x1, dz = w.z2 - w.z1
  const t = Math.max(0, Math.min(1, ((x - w.x1) * dx + (z - w.z1) * dz) / (dx * dx + dz * dz)))
  return Math.hypot(x - (w.x1 + t * dx), z - (w.z1 + t * dz))
}))

test('every era sign hangs on a lintel or on the lobby pier — none floats in the corridor', () => {
  for (const g of [loop(), buildGallery({ tokens: fixture(), collaborations, generatedAt: 'x' })]) {
    const signs = g.signs.filter((s) => s.kind === 'era')
    expect(signs.length).toBe(2 * ERAS.length - 1)
    for (const s of signs) {
      const onPier = Math.abs(s.z - 8) < 0.5 && Math.abs(s.x) > 2   // beside the lobby opening
      expect(onPier || nearestLintel(g, s.x, s.z) < WALL_OFFSET + 1e-6).toBe(true)
    }
    // no two era signs at one spot
    const spots = new Set(signs.map((s) => `${s.x.toFixed(2)},${s.y.toFixed(2)},${s.z.toFixed(2)}`))
    expect(spots.size).toBe(signs.length)
  }
})

test('names and era markers are big enough to read from the corridor', () => {
  const g = loop()
  for (const s of g.signs.filter((s) => s.kind === 'room')) { expect(s.h).toBeGreaterThanOrEqual(0.8); expect(s.w).toBeGreaterThanOrEqual(4) }
  for (const s of g.signs.filter((s) => s.kind === 'era')) expect(s.h).toBeGreaterThanOrEqual(0.8)
})

// ---- the work's own shape ---------------------------------------------------------
// fxhash's thumbnails were square crops; archive-previews.mjs replaces them with the
// display image fitted to 512 px, and the build reads each preview's pixel size.

test('a painting takes its preview\'s proportions, long side PAINTING; no size means square', () => {
  const tokens = loopFixture()
  const sizes = new Map([[101, { w: 900, h: 600 }], [102, { w: 400, h: 800 }]])
  const g = buildGallery({ tokens, collaborations: loopCollabs, sizes, generatedAt: 'x' })
  const p = (id) => g.paintings.find((p) => p.project === id)
  expect(p(101).w).toBeCloseTo(PAINTING, 9)
  expect(p(101).h).toBeCloseTo(PAINTING * 600 / 900, 9)
  expect(p(102).w).toBeCloseTo(PAINTING * 400 / 800, 9)
  expect(p(102).h).toBeCloseTo(PAINTING, 9)
  expect(p(201).w).toBe(PAINTING)
  expect(p(201).h).toBe(PAINTING)
  // the plaque sits under the lower-right corner of the actual picture
  const plaque = (id) => g.signs.find((s) => s.kind === 'plaque' && s.text.startsWith(p(id).name + ' '))
  expect(plaque(101).y).toBeCloseTo(EYE_Y - p(101).h / 2 - 0.12, 9)
  expect(plaque(102).y).toBeCloseTo(EYE_Y - PAINTING / 2 - 0.12, 9)
})

// ---- the preview seed ---------------------------------------------------------------
// The thumbnail on the wall is one particular iteration; the painting carries the
// query fxhash ran it with, so the piece opens on the very image you walked up to.

test('a painting carries the query its preview was run with, when one was captured', () => {
  const previews = new Map([[101, '?fxhash=ooA&fxiteration=1&fxminter=tz1x#0x82ff']])
  const g = buildGallery({ tokens: loopFixture(), collaborations: loopCollabs, previews, generatedAt: 'x' })
  expect(g.paintings.find((p) => p.project === 101).preview).toBe('?fxhash=ooA&fxiteration=1&fxminter=tz1x#0x82ff')
  expect('preview' in g.paintings.find((p) => p.project === 102)).toBe(false)
})

test('pieces are hung by their edges: a museum of portraits keeps GAP between them and needs no longer a loop than squares', () => {
  const tokens = loopFixture()
  const sizes = new Map(tokens.map((t) => [t.id, { w: 500, h: 1000 }]))   // every piece PAINTING tall, half as wide
  const g = buildGallery({ tokens, collaborations: loopCollabs, sizes, generatedAt: 'x' })
  checkInvariants(g, tokens.map((t) => t.id))
  for (const p of g.paintings) expect(p.w).toBeCloseTo(PAINTING / 2, 9)
  const legLength = (g) => { const [z0, z1] = extent(sections(g, 'leg-a'), 'z'); return z1 - z0 }
  expect(legLength(g)).toBeLessThanOrEqual(legLength(loop()) + 1e-9)
})

// ---- round six: signs that work in both directions -------------------------------
// Frank walked back the way he came: a portal's lintel named the era on the face
// you approach and nothing on the other, so turning round left you with no idea
// what you were walking into. Every portal now names the era on both faces — the
// one you enter going on, and the one you enter turning back — and the lobby's
// opening says, on its corridor face, that the walk starts through it.

test('a portal names an era on both faces: what you walk into, and what you turn back into', () => {
  const g = loop()
  const eras = g.signs.filter((s) => s.kind === 'era')
  // one per era along the walk, and the same again on the back of each portal;
  // the first era has nothing before it, so its lintel's back face is the lobby's.
  expect(eras.length).toBe(2 * ERAS.length - 1)
  const labels = ERAS.map((e) => e.label)
  const onPier = (s) => Math.abs(s.z - 8) < 0.5 && Math.abs(s.x) > 2
  for (const s of eras.filter((s) => !onPier(s))) {
    // its twin hangs at the same spot on the wall, facing the other way
    const nx = Math.sin(s.yaw), nz = Math.cos(s.yaw)
    const twin = eras.find((t) =>
      Math.abs(t.x - (s.x - 2 * SIGN_OFFSET * nx)) < 1e-6 &&
      Math.abs(t.z - (s.z - 2 * SIGN_OFFSET * nz)) < 1e-6 &&
      Math.abs(t.y - s.y) < 1e-6)
    expect(twin).toBeDefined()
    // 5 places, not 6: the build rounds every angle to a micrometre, so two opposite faces differ by π ∓ 1e-6.
    expect(Math.abs(yawOfSign(twin) - yawOfSign(s))).toBeCloseTo(Math.PI, 5)
    // the two faces are consecutive eras: you came out of one and into the other
    expect(Math.abs(labels.indexOf(s.text) - labels.indexOf(twin.text))).toBe(1)
  }
})

/** A sign's facing as an angle in [0, 2π), for comparing two that face opposite ways. */
const yawOfSign = (s) => (s.yaw + 2 * Math.PI) % (2 * Math.PI)

test('the lobby opening says, on its corridor face, that the walk starts through it', () => {
  const g = loop()
  const back = g.signs.find((s) => s.kind === 'title' && /begins/i.test(s.text) && s.z > 7)
  expect(back).toBeDefined()
  expect(back.yaw).toBeCloseTo(0, 6)             // faces north, up leg A: read on the way back
  expect(back.y).toBeGreaterThanOrEqual(DOOR_H)  // on the lintel over the opening
})

test('the lobby tells you what the place is and how to walk it, on the walls you are not facing', () => {
  const g = loop()
  const panels = g.signs.filter((s) => s.kind === 'panel')
  expect(panels.length).toBeGreaterThanOrEqual(6)
  // behind you as you spawn (the south wall, facing north) and to the side (the
  // west wall, facing east) — never the north wall you are already looking at
  const behind = panels.filter((s) => Math.abs(s.z) < 0.5 && Math.abs(s.yaw) < 1e-6)
  const side = panels.filter((s) => Math.abs(s.x + 4) < 0.5 && Math.abs(s.yaw - Math.PI / 2) < 1e-6)
  expect(behind.length).toBeGreaterThanOrEqual(3)
  expect(side.length).toBeGreaterThanOrEqual(3)
  for (const s of panels) {
    expect(s.y).toBeGreaterThan(0.9)             // no line down at the skirting
    expect(s.y + s.h / 2).toBeLessThan(WALL_H)   // nor through the ceiling
    expect(s.w).toBeLessThanOrEqual(8)           // fits the lobby wall
  }
  // each panel is headed, and the headings are not panel text
  for (const wall of [{ z: 0, yaw: 0 }, { x: -4, yaw: Math.PI / 2 }]) {
    const heads = g.signs.filter((s) => s.kind === 'title' && Math.abs(s.yaw - wall.yaw) < 1e-6 &&
      (wall.z !== undefined ? Math.abs(s.z) < 0.5 : Math.abs(s.x + 4) < 0.5))
    expect(heads.length).toBe(1)
  }
})

// ---- round seven: a sign is ink, not an object -----------------------------------
// Frank saw a faint dark outline around every name and plaque. The signs stood
// 2 cm off the plaster — a framed picture's standoff — so the ambient occlusion
// found a gap to darken behind each one. A printed label has no gap.

test('a sign lies on the wall where a painting stands off it', () => {
  const g = loop()
  expect(SIGN_OFFSET).toBeGreaterThan(WALL_T / 2)          // still clear of the plaster, not sunk into it
  expect(SIGN_OFFSET).toBeLessThan(WALL_OFFSET)            // but not hung off it like a picture
  expect(SIGN_OFFSET - WALL_T / 2).toBeCloseTo(0.005, 9)          // 5 mm of standoff, no more
  const rooms = new Map(g.rooms.map((r) => [r.id, r]))
  for (const p of g.paintings) {
    const r = rooms.get(p.room)
    const plaque = g.signs.find((s) => s.kind === 'plaque' && s.text.startsWith(p.name + ' —'))
    expect(plaque).toBeDefined()
    // the plaque hangs on the same wall as its painting, but flat against it
    expect(edgeOf(r.rect, plaque.x, plaque.z).dist).toBeCloseTo(SIGN_OFFSET, 6)
    expect(edgeOf(r.rect, p.x, p.z).dist).toBeCloseTo(WALL_OFFSET, 6)
  }
})
