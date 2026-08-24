// Pure builders for public/data/gallery.json — the walkable museum of the archived
// generators. Kept free of I/O so the layout rules can be tested directly, mirroring
// scripts/summary-lib.mjs. Every number that shapes the building lives here.
//
// Coordinates are metres, y up, the spine of halls runs along +z from the lobby at
// z = 0. A `yaw` names a direction (sin yaw, 0, cos yaw) in the xz plane: for a
// painting or sign it is the normal pointing into the room; for a pose it is the
// facing direction. See docs/superpowers/specs/2026-08-23-fxhash-gallery-design.md.

import { creditLine } from './summary-lib.mjs'

/** Three pieces is a room. Two is a room for the TWO_PIECE_ROOMS best-selling such artists. */
export const SOLO_MIN = 3
export const TWO_PIECE_ROOMS = 8

export const HALL_W = 8
export const WALL_H = 4
export const WALL_T = 0.3
export const PAINTING = 1.2
export const EYE_Y = 1.6
export const SPACING = 3
export const DOOR_W = 2
export const DOOR_H = 3
export const OPENING_W = 4
/** The smallest room, for up to ROOM_MIN_PIECES pieces: one wall each, nothing bare. */
export const ROOM_MIN = 6
export const ROOM_MIN_PIECES = 4
/** Where a room with more pieces than that starts growing from. */
export const ROOM_MID = 8
export const ROOM_GAP = 2
export const CORNER = 1
export const LOBBY = 8
/**
 * How far a painting or sign stands off the wall's inside face, so it never
 * z-fights with it. Measured from that face, not from the room rectangle's edge:
 * the edge is the wall's centre line, and the wall is WALL_T thick, so its inside
 * face already sits WALL_T/2 further into the room. Skipping that term buries
 * every painting 0.13 m inside the (opaque) wall instead of standing it proud of it.
 */
export const WALL_OFFSET = WALL_T / 2 + 0.02

/** Kept in step with HIDDEN_FLAGS in src/lib/data.ts and scripts/build-summary.mjs. */
export const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

/**
 * The seven halls, in spine order. fxhash opened in November 2021, so the first
 * era is two months; 2022 is the bulk of the archive and gets a hall a quarter;
 * after March 2023 there is too little archived work to keep splitting.
 */
export const ERAS = [
  { id: '2021', label: '2021 · Nov–Dec' },
  { id: '2022-q1', label: '2022 · Jan–Mar' },
  { id: '2022-q2', label: '2022 · Apr–Jun' },
  { id: '2022-q3', label: '2022 · Jul–Sep' },
  { id: '2022-q4', label: '2022 · Oct–Dec' },
  { id: '2023-q1', label: '2023 · Jan–Mar' },
  { id: '2023-on', label: '2023 · Apr onward' },
]

export function eraOf(createdAt) {
  const year = Number(createdAt.slice(0, 4))
  const quarter = Math.floor((Number(createdAt.slice(5, 7)) - 1) / 3) + 1
  if (year < 2022) return '2021'
  if (year === 2022) return `2022-q${quarter}`
  if (year === 2023 && quarter === 1) return '2023-q1'
  return '2023-on'
}

/** A collaboration contract's address is a KT1, an artist's is a tz. */
export const isCollab = (t) => Boolean(t.author?.id?.startsWith('KT1'))

/** The one-line credit a plaque shows: the artist, or every collaborator. */
export function creditOf(t, collaborations = {}) {
  const members = collaborations[String(t.id)]?.collaborators
  if (members?.length) return creditLine(members)
  return t.author?.name ?? t.author?.id ?? 'unknown'
}

/** createdAt ascending, ties by id — the one ordering used everywhere in the building. */
export const byDate = (a, b) =>
  a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : a.id - b.id

/**
 * Who gets a room, and which hall everything else hangs in.
 *
 * A collaboration has no single artist, so it never counts toward a solo room and
 * never hangs in one: it goes in its era's hall, credited to every member. Solo
 * artists come back in order of their earliest piece — that order decides which
 * hall their door opens off and which side it is on.
 */
export function assignRooms(tokens, collaborations = {}, { volumes = new Map(), twoPieceRooms = TWO_PIECE_ROOMS } = {}) {
  const sorted = [...tokens].sort(byDate)

  const perArtist = new Map()
  for (const t of sorted) {
    if (isCollab(t) || !t.author?.id) continue
    if (!perArtist.has(t.author.id)) {
      perArtist.set(t.author.id, { id: t.author.id, name: t.author.name ?? t.author.id, projects: [] })
    }
    perArtist.get(t.author.id).projects.push(t)
  }
  // Map insertion order is the order of each artist's first piece.
  const artists = [...perArtist.values()]
  // Two pieces is a room only for the best-selling handful of such artists —
  // enough for the ones people collected, not so many that the corridor empties.
  const twoPiece = artists
    .filter((a) => a.projects.length === SOLO_MIN - 1)
    .map((a) => ({ a, tez: a.projects.reduce((sum, t) => sum + (volumes.get(t.id) ?? 0), 0) }))
    .sort((p, q) => q.tez - p.tez || p.a.projects[0].id - q.a.projects[0].id)
    .slice(0, twoPieceRooms)
    .map((p) => p.a)
  const solo = artists.filter((a) => a.projects.length >= SOLO_MIN || twoPiece.includes(a))
  const soloIds = new Set(solo.flatMap((a) => a.projects.map((t) => t.id)))

  const halls = new Map(ERAS.map((e) => [e.id, []]))
  for (const t of sorted) if (!soloIds.has(t.id)) halls.get(eraOf(t.createdAt)).push(t)

  // Distinct people credited, collaboration members included. A collaboration
  // with no recorded collaborators entry is skipped rather than falling through to
  // its KT1 contract address — that address is not a person, so counting it would
  // overstate artistCount by one for every collaboration snapshot-collaborators.mjs
  // did not (yet) resolve.
  const people = new Set()
  for (const t of sorted) {
    const members = collaborations[String(t.id)]?.collaborators
    if (members?.length) for (const m of members) people.add(m.id)
    else if (t.author?.id && !isCollab(t)) people.add(t.author.id)
  }

  return { solo, halls, artistCount: people.size }
}

/**
 * The solid pieces of one straight wall, with doors cut out of it.
 *
 * A wall runs from `from` to `to` along `axis`, sitting at `fixed` on the other
 * axis. Each gap becomes a header segment from `gap.top` up to the ceiling, so the
 * renderer draws the lintel and the collider, which ignores anything with y0 > 0,
 * lets people through.
 */
export function wallSegments(axis, fixed, from, to, gaps = []) {
  const seg = (a, b, y0, y1) =>
    axis === 'x'
      ? { x1: a, z1: fixed, x2: b, z2: fixed, y0, y1 }
      : { x1: fixed, z1: a, x2: fixed, z2: b, y0, y1 }
  const out = []
  let cursor = from
  for (const g of [...gaps].sort((p, q) => p.from - q.from)) {
    if (g.from > cursor) out.push(seg(cursor, g.from, 0, WALL_H))
    out.push(seg(g.from, g.to, g.top, WALL_H))
    cursor = g.to
  }
  if (to > cursor) out.push(seg(cursor, to, 0, WALL_H))
  return out
}

/**
 * Where a painting's centre may go on a wall from `from` to `to`: CORNER clear of
 * each end and of each door gap. Returns intervals; an interval of zero length is
 * one legal position, a negative one is dropped.
 */
export function freeRuns(from, to, gaps = []) {
  const runs = []
  let cursor = from + CORNER
  for (const g of [...gaps].sort((p, q) => p.from - q.from)) {
    runs.push([cursor, g.from - CORNER])
    cursor = g.to + CORNER
  }
  runs.push([cursor, to - CORNER])
  return runs.filter(([a, b]) => b >= a)
}

/** Painting centres at pitch SPACING, as many as fit, centred within the run. */
export function slotsOnRun(a, b) {
  const len = b - a
  if (len < 0) return []
  const n = Math.floor(len / SPACING) + 1
  const start = a + (len - (n - 1) * SPACING) / 2
  return Array.from({ length: n }, (_, i) => start + i * SPACING)
}

export const ATLAS = { size: 4096, tile: 256, gutter: 4, cols: 15 }
export const ATLAS_SMALL = { size: 2048, tile: 128, gutter: 2, cols: 15 }
export const TILES_PER_ATLAS = ATLAS.cols * ATLAS.cols

/** Where tile `tile` lives: which file, which cell, and the pixel origin of the image itself (inside its gutter). */
export function tileRect(tile, atlas = ATLAS) {
  const perFile = atlas.cols * atlas.cols
  const file = Math.floor(tile / perFile)
  const i = tile % perFile
  const col = i % atlas.cols
  const row = Math.floor(i / atlas.cols)
  const cell = atlas.tile + 2 * atlas.gutter
  return { file, col, row, x: col * cell + atlas.gutter, y: row * cell + atlas.gutter, cell }
}

const HX = HALL_W / 2
/** Six decimals is sub-millimetre; it also keeps cos(π/2) from printing as 6e-17. */
const r6 = (v) => Math.round(v * 1e6) / 1e6

// ---- vectors on the floor plan -------------------------------------------------
// Everything below works in world points {x, z} and unit directions, so one piece
// of room code serves a room hung off any wall of any leg, whichever way it runs.
const add = (p, q, k = 1) => ({ x: p.x + q.x * k, z: p.z + q.z * k })
const neg = (v) => ({ x: -v.x, z: -v.z })
/** The yaw naming a direction: (sin yaw, cos yaw) = (x, z). */
const yawOf = (v) => r6(Math.atan2(v.x, v.z))
const seg = (p, q, y0 = 0) => ({ x1: r6(p.x), z1: r6(p.z), x2: r6(q.x), z2: r6(q.z), y0, y1: WALL_H })
const rectOf = (corners) => {
  const xs = corners.map((c) => c.x), zs = corners.map((c) => c.z)
  const x = Math.min(...xs), z = Math.min(...zs)
  return { x: r6(x), z: r6(z), w: r6(Math.max(...xs) - x), d: r6(Math.max(...zs) - z) }
}

/**
 * A straight wall from p toward q, with door gaps given as distances from p.
 * Each gap becomes a lintel from `gap.top` to the ceiling, so the renderer draws
 * it and the collider, which ignores anything with y0 > 0, lets people through.
 */
function wallBetween(p, q, gaps = []) {
  const len = Math.hypot(q.x - p.x, q.z - p.z)
  const dir = { x: (q.x - p.x) / len, z: (q.z - p.z) / len }
  const at = (a) => add(p, dir, a)
  const out = []
  let cursor = 0
  for (const g of [...gaps].sort((a, b) => a.from - b.from)) {
    if (g.from > cursor) out.push(seg(at(cursor), at(g.from)))
    out.push(seg(at(g.from), at(g.to), g.top))
    cursor = g.to
  }
  if (len > cursor) out.push(seg(at(cursor), at(len)))
  return out
}

/** Painting centres for `k` pieces spread across the centre-allowed run [a, b]. */
export function spreadOnRun(a, b, k) {
  if (k <= 0) return []
  if (k === 1) return [(a + b) / 2]
  return Array.from({ length: k }, (_, i) => a + ((b - a) * i) / (k - 1))
}

/** How many pieces a centre-allowed run [a, b] can hold at pitch SPACING. */
const runCapacity = (a, b) => (b >= a ? Math.floor((b - a) / SPACING) + 1 : 0)

/**
 * Split `n` pieces over walls with these capacities: one on each wall in order
 * before any wall gets a second, so a room with three pieces uses three walls.
 * The order is the caller's — facing wall first, then the sides, then the door
 * wall — which is why a two-piece room has its pictures where you look on entering.
 */
export function distribute(caps, n) {
  const out = caps.map(() => 0)
  let left = n
  while (left > 0) {
    let placed = false
    for (let i = 0; i < caps.length && left > 0; i++) {
      if (out[i] < caps[i]) {
        out[i]++
        left--
        placed = true
      }
    }
    if (!placed) break
  }
  return out
}

/**
 * The hanging runs of a square room of side `s` whose door is centred on the
 * v = 0 wall, in the order distribute() fills them: the wall facing the door,
 * the left and right walls, then the two stretches of door wall either side of
 * the door. Runs are in the room's own (u, v) frame; `at(u, v)` places a point
 * and `normal` is the inward normal, so a run also knows how it faces.
 */
function roomRuns(s) {
  const half = s / 2 - DOOR_W / 2 - CORNER
  return [
    { a: CORNER, b: s - CORNER, at: (t) => ({ u: t, v: s }), normal: { u: 0, v: -1 } },
    { a: CORNER, b: s - CORNER, at: (t) => ({ u: 0, v: t }), normal: { u: 1, v: 0 } },
    { a: CORNER, b: s - CORNER, at: (t) => ({ u: s, v: t }), normal: { u: -1, v: 0 } },
    { a: CORNER, b: half, at: (t) => ({ u: t, v: 0 }), normal: { u: 0, v: 1 } },
    { a: s - half, b: s - CORNER, at: (t) => ({ u: t, v: 0 }), normal: { u: 0, v: 1 } },
  ]
}

/** How many pieces a square room of side `s` hangs at pitch, all four walls. */
export const roomCapacity = (s) => roomRuns(s).reduce((n, r) => n + runCapacity(r.a, r.b), 0)

/**
 * The side of an artist's room. Up to four pieces get the smallest room — one
 * picture per wall reads as a room, not a cupboard; beyond that the room grows
 * from ROOM_MID until its walls hold them all. Thirty-one comes out at 24 m.
 */
export function roomSide(n) {
  if (n <= ROOM_MIN_PIECES) return ROOM_MIN
  let s = ROOM_MID
  while (roomCapacity(s) < n) s += 1
  return s
}

// ---- the loop ---------------------------------------------------------------------

/** The corridor's parts in walking order; ids the client's deep links and the tests rely on. */
export const LOOP_IDS = ['leg-a', 'corner-nw', 'leg-b', 'corner-ne', 'leg-c', 'corner-se', 'leg-d']
/**
 * Rooms on the courtyard side keep this clear of each leg's ends. Two legs meet
 * at every courtyard corner, and an inner room at the end of one would sit
 * exactly where an inner room at the start of the next begins.
 */
export const INNER_MARGIN = 10
/** A room wider than this goes outside the loop, where there is room for anything. */
export const INNER_MAX = 8
/** Two of the widest inner rooms must fit face to face across the courtyard. */
export const LOOP_MIN = 2 * INNER_MAX + ROOM_GAP
/** A portal — the lintel across the corridor where an era begins — keeps this clear of pictures and doors. */
const PORTAL_CLEAR = 0.5

/**
 * The four legs and four corners for a loop with legs of length L, in walking
 * order. A leg knows where it starts, which way it runs (U), which side is
 * outside the loop (OUT) and which faces the courtyard (IN), and can place a
 * point at any distance along either wall or the centreline. Corners are
 * rooms with two outer walls and nothing else; the corridor runs straight
 * through them.
 */
function loopParts(L) {
  const zTop = LOBBY + L
  const xR = HX + L
  const leg = (id, start, U, OUT, len) => ({
    id, kind: 'leg', start, U, OUT, IN: neg(OUT), len,
    at: (a, side = null) => add(add(start, U, a), side ?? { x: 0, z: 0 }, side ? HX : 0),
    rect: rectOf([add(start, OUT, HX), add(add(start, OUT, HX), U, len), add(start, OUT, -HX), add(add(start, OUT, -HX), U, len)]),
  })
  const corner = (id, rect, outerWalls) => ({ id, kind: 'corner', rect, outerWalls, len: HALL_W })
  return [
    leg('leg-a', { x: 0, z: LOBBY }, { x: 0, z: 1 }, { x: -1, z: 0 }, L),
    corner('corner-nw', { x: -HX, z: zTop, w: HALL_W, d: HALL_W }, [
      { p: { x: -HX, z: zTop }, q: { x: -HX, z: zTop + HALL_W }, normal: { x: 1, z: 0 } },
      { p: { x: -HX, z: zTop + HALL_W }, q: { x: HX, z: zTop + HALL_W }, normal: { x: 0, z: -1 } },
    ]),
    leg('leg-b', { x: HX, z: zTop + HX }, { x: 1, z: 0 }, { x: 0, z: 1 }, L),
    corner('corner-ne', { x: xR, z: zTop, w: HALL_W, d: HALL_W }, [
      { p: { x: xR, z: zTop + HALL_W }, q: { x: xR + HALL_W, z: zTop + HALL_W }, normal: { x: 0, z: -1 } },
      { p: { x: xR + HALL_W, z: zTop + HALL_W }, q: { x: xR + HALL_W, z: zTop }, normal: { x: -1, z: 0 } },
    ]),
    leg('leg-c', { x: xR + HX, z: zTop }, { x: 0, z: -1 }, { x: 1, z: 0 }, L),
    corner('corner-se', { x: xR, z: 0, w: HALL_W, d: HALL_W }, [
      { p: { x: xR + HALL_W, z: HALL_W }, q: { x: xR + HALL_W, z: 0 }, normal: { x: -1, z: 0 } },
      { p: { x: xR + HALL_W, z: 0 }, q: { x: xR, z: 0 }, normal: { x: 0, z: 1 } },
    ]),
    leg('leg-d', { x: HX + L, z: HX }, { x: -1, z: 0 }, { x: 0, z: -1 }, L),
  ]
}

/** Split n items over k legs as evenly as they go, earlier legs taking the extra. */
const blocks = (n, k) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0))

/**
 * Rooms at an even beat. Each side of the corridor takes its rooms in date
 * order, shared over the four legs as evenly as they go; on a leg the rooms are
 * spaced so the gaps before, between and after them are all the same. Null when
 * a gap would be tighter than ROOM_GAP: L is too short.
 */
function placeRooms(legs, L, solo) {
  const bySide = { OUT: [], IN: [] }
  solo.forEach((a, i) => {
    const s = roomSide(a.projects.length)
    bySide[s > INNER_MAX ? 'OUT' : i % 2 === 0 ? 'OUT' : 'IN'].push({ artist: a, s })
  })
  const placed = []
  for (const side of ['OUT', 'IN']) {
    const margin = side === 'OUT' ? ROOM_GAP : INNER_MARGIN
    let from = 0
    for (const [li, count] of blocks(bySide[side].length, legs.length).entries()) {
      const block = bySide[side].slice(from, from + count)
      from += count
      if (!block.length) continue
      const gap = (L - 2 * margin - block.reduce((t, r) => t + r.s, 0)) / (block.length + 1)
      if (gap < ROOM_GAP) return null
      let at = margin + gap
      for (const r of block) {
        placed.push({ ...r, leg: legs[li], side, a0: at })
        at += r.s + gap
      }
    }
  }
  return placed
}

/**
 * Every free stretch of corridor wall, in walking order: a leg's two walls
 * between its doors, a corner's two outer walls. A run can place its pieces
 * (`at`), knows its inward normal, and for a leg knows the centreline point at
 * any distance (`centre`) and the walking direction (`dir`) — what an era
 * marker needs.
 */
function corridorRuns(parts, gapsOf) {
  const runs = []
  let walked = 0
  for (const part of parts) {
    if (part.kind === 'leg') {
      for (const side of ['OUT', 'IN']) {
        const wallDir = side === 'OUT' ? part.OUT : part.IN
        for (const [a, b] of freeRuns(0, part.len, gapsOf(part, side))) {
          runs.push({
            part, a, b, walk: walked + a, order: side === 'OUT' ? 0 : 1,
            at: (c) => add(part.at(c, wallDir), neg(wallDir), WALL_OFFSET), normal: neg(wallDir),
            along: (c) => c, centre: (c) => part.at(c), dir: part.U,
          })
        }
      }
    } else {
      const centre = { x: part.rect.x + part.rect.w / 2, z: part.rect.z + part.rect.d / 2 }
      part.outerWalls.forEach((w, i) => {
        const len = Math.hypot(w.q.x - w.p.x, w.q.z - w.p.z)
        const dir = { x: (w.q.x - w.p.x) / len, z: (w.q.z - w.p.z) / len }
        for (const [a, b] of freeRuns(0, len, [])) {
          runs.push({
            part, a, b, walk: walked + i * len + a, order: 0,
            at: (c) => add(add(w.p, dir, c), w.normal, WALL_OFFSET), normal: w.normal,
            along: () => null, centre: () => centre, dir,
          })
        }
      })
    }
    walked += part.len
  }
  return runs.sort((p, q) => p.walk - q.walk || p.order - q.order)
}

/**
 * Share n pieces over the runs in proportion to what each can hold, so the
 * walls are equally full all the way round instead of full at the start and
 * bare at the end. Whole pieces: floor everyone, then the largest remainders.
 * Null when the runs cannot hold n at all.
 */
function share(runs, n) {
  const caps = runs.map((r) => runCapacity(r.a, r.b))
  const total = caps.reduce((s, c) => s + c, 0)
  if (total < n) return null
  const exact = caps.map((c) => (n * c) / total)
  const counts = exact.map(Math.floor)
  let left = n - counts.reduce((s, c) => s + c, 0)
  const byRemainder = exact.map((e, i) => ({ i, frac: e - Math.floor(e) })).sort((p, q) => q.frac - p.frac || p.i - q.i)
  for (const { i } of byRemainder) {
    if (left <= 0) break
    if (counts[i] < caps[i]) { counts[i]++; left-- }
  }
  return counts
}

/**
 * Where to put the portal that opens an era: as close before its first corridor
 * piece as a lintel can go without standing on a picture or cutting a door. A
 * first piece in a corner, or one hemmed in, puts the portal at the start of
 * the next leg instead.
 */
function portalFor(first, hung, gapsOf) {
  const run = first.slot.run
  const leg = run.part.kind === 'leg' ? run.part : null
  if (leg) {
    const a = first.slot.along
    const pieces = hung.filter((h) => h.slot.run.part === leg).map((h) => h.slot.along)
    const gaps = [...gapsOf(leg, 'OUT'), ...gapsOf(leg, 'IN')]
    for (const back of [SPACING / 2, 1, 2, 2.5, 3]) {
      const pos = a - back
      if (pos < CORNER || pos > leg.len - CORNER) continue
      if (pieces.some((p) => Math.abs(p - pos) < CORNER)) continue
      if (gaps.some((g) => pos > g.from - PORTAL_CLEAR && pos < g.to + PORTAL_CLEAR)) continue
      return { leg, pos }
    }
  }
  return { leg: null, after: run.part }
}

/**
 * The whole building, from the archived set.
 *
 * A lobby, then one corridor that runs out along four legs and four corners and
 * comes back into the lobby. Artists with three pieces, and the best-selling
 * few with two, have rooms off the corridor, in the order they first appeared,
 * at an even beat along every leg, alternating outside and inside the loop. The
 * corridor walls between the doors carry everything else in date order, spread
 * so the walls are as full at the end of the walk as at the start; a portal
 * with the era on its lintel marks where each era begins; and a sign on the way
 * back into the lobby says you have come full circle. Nothing here depends on
 * input order — see byDate — so the same archive gives the same building.
 */
export function buildGallery({ tokens, collaborations = {}, volumes = new Map(), generatedAt }) {
  const visible = tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag))
  const { solo, halls, artistCount } = assignRooms(visible, collaborations, { volumes })
  const shared = [...halls.values()].flat().sort(byDate)
  const years = visible.map((t) => Number(t.createdAt.slice(0, 4)))
  const span = years.length ? [Math.min(...years), Math.max(...years)] : [0, 0]

  // Grow the loop until the rooms keep their beat and the walls hold every piece.
  // Start from a lower bound rather than the minimum: the rooms on the busier
  // side need their wall, and the corridor pieces need theirs (eight walls of
  // L, less the rooms, at pitch) — growing from 18 m to a hundred in 3 m steps
  // was most of the build time.
  const sides = { OUT: [], IN: [] }
  solo.forEach((a, i) => {
    const s = roomSide(a.projects.length)
    sides[s > INNER_MAX ? 'OUT' : i % 2 === 0 ? 'OUT' : 'IN'].push(s)
  })
  const need = (rooms, margin) => (rooms.reduce((t, s) => t + s + ROOM_GAP, 0) + ROOM_GAP) / 4 + 2 * margin
  const roomWall = [...sides.OUT, ...sides.IN].reduce((t, s) => t + s, 0)
  const lower = Math.max(LOOP_MIN, need(sides.OUT, ROOM_GAP), need(sides.IN, INNER_MARGIN), (SPACING * shared.length + roomWall) / 8)
  let layout = null
  for (let L = Math.floor(lower / SPACING) * SPACING; !layout; L += SPACING) {
    const parts = loopParts(L)
    const legs = parts.filter((p) => p.kind === 'leg')
    const placed = placeRooms(legs, L, solo)
    if (!placed) continue
    const gapsOf = (leg, side) =>
      placed.filter((p) => p.leg === leg && p.side === side)
        .map((p) => ({ from: p.a0 + p.s / 2 - DOOR_W / 2, to: p.a0 + p.s / 2 + DOOR_W / 2, top: DOOR_H }))
    const runs = corridorRuns(parts, gapsOf)
    const counts = share(runs, shared.length)
    if (!counts) continue
    layout = { L, parts, legs, placed, gapsOf, runs, counts }
  }
  const { L, parts, legs, placed, gapsOf, runs, counts } = layout

  const rooms = []
  const walls = []
  const paintings = []
  const signs = []

  const hang = (t, room, point, normal) =>
    paintings.push({
      project: t.id, slug: t.slug, name: t.name, artist: creditOf(t, collaborations),
      year: Number(t.createdAt.slice(0, 4)), room, x: r6(point.x), z: r6(point.z), yaw: yawOf(normal), tile: 0,
    })
  /** A sign on a wall at `point` (on the wall line), facing `normal`, stood off like a painting. */
  const sign = (kind, text, point, normal, y, w, h) =>
    signs.push({ text, kind, x: r6(point.x + normal.x * WALL_OFFSET), y, z: r6(point.z + normal.z * WALL_OFFSET), yaw: yawOf(normal), w, h })
  const opening = (from) => [{ from: from - OPENING_W / 2, to: from + OPENING_W / 2, top: DOOR_H }]

  // Lobby: the south-west corner of the loop. Spawn in the middle facing north up
  // leg A, the title above that opening and the first era's name on the pier
  // beside it; the east side is a lintel over the way back in, with the sign
  // that says the walk is done.
  rooms.push({
    id: 'lobby', kind: 'lobby', title: 'fxhash',
    rect: { x: -HX, z: 0, w: LOBBY, d: LOBBY }, entry: { x: 0, z: LOBBY / 2, yaw: 0 },
  })
  walls.push(
    ...wallBetween({ x: -HX, z: 0 }, { x: -HX, z: LOBBY }),
    ...wallBetween({ x: -HX, z: 0 }, { x: HX, z: 0 }),
    ...wallBetween({ x: -HX, z: LOBBY }, { x: HX, z: LOBBY }, opening(HX)),
    ...wallBetween({ x: HX, z: 0 }, { x: HX, z: LOBBY }, opening(LOBBY / 2)),
  )
  sign('title', 'fxhash', { x: 0, z: LOBBY }, { x: 0, z: -1 }, 3.65, 3, 0.5)
  sign('title', `${visible.length} archived works · ${artistCount} artists · ${span[0]}–${span[1]}`, { x: 0, z: LOBBY }, { x: 0, z: -1 }, 3.25, 3, 0.25)
  sign('title', `You have walked the whole of fxhash, ${span[0]}–${span[1]} — the lobby is ahead`, { x: HX, z: LOBBY / 2 }, { x: 1, z: 0 }, 3.5, 3.6, 0.4)

  // The corridor's pieces: each run's share, spread along it, in walking order.
  const hung = []
  let next = 0
  runs.forEach((run, i) => {
    for (const c of spreadOnRun(run.a, run.b, counts[i])) {
      const t = shared[next++]
      hung.push({ t, slot: { run, along: run.along(c), point: run.at(c), normal: run.normal } })
    }
  })

  // Era portals: for every era after the first, a lintel across the corridor
  // just before its first piece; the corridor splits into sections at them.
  const portals = new Map(legs.map((l) => [l, []]))   // leg -> [{ pos, era }]
  const markers = []                                  // { era, entry point, dir, signAt, signNormal }
  const legAfter = (part) => legs[Math.min(legs.length - 1, parts.indexOf(part) + 1 < parts.length ? legs.indexOf(parts[parts.indexOf(part) + 1]) : legs.length - 1)]
  let previous = { centre: { x: 0, z: LOBBY + 1 }, dir: { x: 0, z: 1 }, wall: { x: HX - 1, z: LOBBY }, normal: { x: 0, z: -1 }, pier: true }
  markers.push({ era: ERAS[0], ...previous })
  for (const era of ERAS.slice(1)) {
    const first = hung.find((h) => eraOf(h.t.createdAt) === era.id)
    let m
    if (first) {
      let { leg, pos, after } = portalFor(first, hung, gapsOf)
      if (!leg) { leg = legs[(legs.indexOf(legAfter(after)) + legs.length) % legs.length]; pos = 0 }
      if (pos > 0 && !portals.get(leg).some((p) => Math.abs(p.pos - pos) < 1e-6)) portals.get(leg).push({ pos, era })
      m = { centre: leg.at(pos + 1), dir: leg.U, wall: leg.at(pos), normal: neg(leg.U), pier: false }
    } else {
      const door = placed.filter((p) => eraOf(p.artist.projects[0].createdAt) === era.id)[0]
      if (door) {
        const wallDir = door.side === 'OUT' ? door.leg.OUT : door.leg.IN
        m = { centre: door.leg.at(door.a0 + door.s / 2), dir: door.leg.U, wall: door.leg.at(door.a0 + door.s / 2, wallDir), normal: neg(wallDir), pier: false }
      } else {
        m = previous
      }
    }
    previous = m
    markers.push({ era, ...m })
  }
  for (const m of markers) {
    rooms.push({
      id: m.era.id, kind: 'era', title: m.era.label,
      rect: { x: r6(m.centre.x), z: r6(m.centre.z), w: 0, d: 0 },
      entry: { x: r6(m.centre.x), z: r6(m.centre.z), yaw: yawOf(m.dir) },
    })
    if (m.pier) sign('era', m.era.label, m.wall, m.normal, 2.2, 1.8, 0.5)
    else sign('era', m.era.label, m.wall, m.normal, 3.5, 3, 0.5)
  }

  // Legs as era sections between their portals, corners as they come, all
  // titled with the era in force; the corridor walls cut for the doors and the
  // portals cut for the opening.
  const sectionOf = new Map()   // leg -> [{ from, to, id }]
  let era = ERAS[0]
  for (const part of parts) {
    if (part.kind === 'leg') {
      const cuts = [0, ...portals.get(part).map((p) => p.pos).sort((a, b) => a - b), part.len]
      const sections = []
      for (let i = 0; i + 1 < cuts.length; i++) {
        const portal = portals.get(part).find((p) => p.pos === cuts[i])
        if (portal) era = portal.era
        const id = i === 0 ? part.id : `${part.id}-${i + 1}`
        sections.push({ from: cuts[i], to: cuts[i + 1], id })
        rooms.push({
          id, kind: 'hall', title: era.label,
          rect: rectOf([part.at(cuts[i], part.OUT), part.at(cuts[i + 1], part.OUT), part.at(cuts[i], part.IN), part.at(cuts[i + 1], part.IN)]),
          entry: { x: r6(part.at(cuts[i] + 1.5).x), z: r6(part.at(cuts[i] + 1.5).z), yaw: yawOf(part.U) },
        })
        if (portal) walls.push(...wallBetween(part.at(cuts[i], part.OUT), part.at(cuts[i], part.IN), opening(HX)))
      }
      sectionOf.set(part, sections)
      for (const side of ['OUT', 'IN']) {
        const wallDir = side === 'OUT' ? part.OUT : part.IN
        walls.push(...wallBetween(part.at(0, wallDir), part.at(part.len, wallDir), gapsOf(part, side)))
      }
    } else {
      const centre = { x: part.rect.x + part.rect.w / 2, z: part.rect.z + part.rect.d / 2 }
      rooms.push({ id: part.id, kind: 'hall', title: era.label, rect: part.rect, entry: { x: r6(centre.x), z: r6(centre.z), yaw: 0 } })
      for (const w of part.outerWalls) walls.push(...wallBetween(w.p, w.q))
    }
  }
  for (const h of hung) {
    const part = h.slot.run.part
    const room = part.kind === 'leg'
      ? sectionOf.get(part).find((s) => h.slot.along >= s.from && h.slot.along <= s.to).id
      : part.id
    hang(h.t, room, h.slot.point, h.slot.normal)
  }

  // Artists' rooms: a square off the corridor with its door centred on the
  // corridor wall, pictures spread over the walls facing and beside the door
  // before the door wall itself, the name above the door and on the far wall.
  for (const { artist: a, leg, side, a0, s } of placed) {
    const V = side === 'OUT' ? leg.OUT : leg.IN
    const U = leg.U
    const O = leg.at(a0, V)
    const at = (u, v) => add(add(O, U, u), V, v)
    const toWorld = (n) => ({ x: U.x * n.u + V.x * n.v, z: U.z * n.u + V.z * n.v })
    const runsIn = roomRuns(s)
    const each = distribute(runsIn.map((r) => runCapacity(r.a, r.b)), a.projects.length)
    let k = 0
    runsIn.forEach((r, i) => {
      const normal = toWorld(r.normal)
      for (const t of spreadOnRun(r.a, r.b, each[i])) {
        const local = r.at(t)
        hang(a.projects[k++], a.id, add(at(local.u, local.v), normal, WALL_OFFSET), normal)
      }
    })
    rooms.push({
      id: a.id, kind: 'solo', title: a.name, rect: rectOf([at(0, 0), at(s, 0), at(0, s), at(s, s)]),
      entry: { x: r6(at(s / 2, 1.5).x), z: r6(at(s / 2, 1.5).z), yaw: yawOf(V) },
    })
    walls.push(
      ...wallBetween(at(0, 0), at(0, s)),
      ...wallBetween(at(0, s), at(s, s)),
      ...wallBetween(at(s, 0), at(s, s)),
    )
    sign('room', a.name, at(s / 2, 0), neg(V), 3.5, 2.4, 0.4)   // above the door, seen from the corridor
    sign('room', a.name, at(s / 2, s), neg(V), 3.5, 2.4, 0.4)   // on the wall facing the door, inside
  }

  // Plaques: under the lower-right corner, as a visitor facing the painting sees it.
  for (const p of paintings) {
    const rx = Math.cos(p.yaw)
    const rz = -Math.sin(p.yaw)
    const shift = PAINTING / 2 - 0.25
    signs.push({
      text: `${p.name} — ${p.artist}, ${p.year}`, kind: 'plaque',
      x: r6(p.x + rx * shift), y: r6(EYE_Y - PAINTING / 2 - 0.12), z: r6(p.z + rz * shift),
      yaw: p.yaw, w: 0.5, h: 0.12,
    })
  }

  paintings.sort((a, b) => a.project - b.project)
  paintings.forEach((p, i) => { p.tile = i })
  const fileCount = Math.ceil(paintings.length / TILES_PER_ATLAS)

  return {
    generatedAt,
    counts: { paintings: paintings.length, artists: artistCount, soloRooms: solo.length, years: span },
    atlas: {
      ...ATLAS,
      files: Array.from({ length: fileCount }, (_, i) => `gallery/atlas-${i}.webp`),
      small: Array.from({ length: fileCount }, (_, i) => `gallery/atlas-${i}-small.webp`),
    },
    spawn: { x: 0, z: LOBBY / 2, yaw: 0 },
    rooms, walls, paintings, signs,
  }
}
