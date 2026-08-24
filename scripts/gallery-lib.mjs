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
/** Wall between neighbouring pictures' edges, whatever their widths: a gallery's hanging distance. */
export const GAP = 1
/** The pitch of two square pieces — what a wall's capacity is counted in. */
export const SPACING = PAINTING + GAP
export const DOOR_W = 2
export const DOOR_H = 3
export const OPENING_W = 4
/** The smallest room, for up to ROOM_MIN_PIECES pieces: one wall each, nothing bare. */
export const ROOM_MIN = 6
export const ROOM_MIN_PIECES = 4
/** Where a room with more pieces than that starts growing from. */
export const ROOM_MID = 8
export const ROOM_GAP = 1
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
/**
 * A sign stands this far off the wall's inside face: 5 mm, where a painting
 * stands 2 cm.
 *
 * A sign is ink on the plaster, not an object hung off it. At a painting's
 * standoff the ambient occlusion found a 2 cm gap behind every quad and
 * darkened the wall around it, which put a faint outline around every artist's
 * name and every plaque — the one thing a printed label does not have. Not
 * zero: the quad still has to win the depth test against the wall it lies on,
 * and at 40 m down a corridor the depth buffer resolves about a millimetre.
 */
export const SIGN_OFFSET = WALL_T / 2 + 0.005

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

/**
 * Centres for pieces of these widths hung along a run, GAP of wall between
 * neighbours' edges. Spread, the slack is shared evenly before, between and
 * after them, so a corridor wall is as full at one end as the other; not
 * spread, they hang exactly GAP apart as one group in the middle of the wall,
 * the slack at its ends — how a room is hung. [a, b] is where a square piece's
 * centre may go, so the pictures' edges may reach PAINTING/2 beyond it. Null
 * when they do not fit.
 */
export function hangOnRun(a, b, widths, spread = true) {
  const k = widths.length
  if (k === 0) return []
  const from = a - PAINTING / 2
  const need = widths.reduce((t, w) => t + w, 0) + GAP * (k - 1)
  const slack = b + PAINTING / 2 - from - need
  if (slack < -1e-9) return null
  const extra = spread ? slack / (k + 1) : 0
  const out = []
  let at = from + (spread ? extra : slack / 2)
  for (const w of widths) {
    out.push(at + w / 2)
    at += w + GAP + extra
  }
  return out
}

/** How many square pieces a centre-allowed run [a, b] can hold at pitch SPACING. */
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

/** How many square pieces a room of side `s` hangs at pitch, all four walls. */
export const roomCapacity = (s) => roomRuns(s).reduce((n, r) => n + runCapacity(r.a, r.b), 0)

/**
 * Where a square room of side `s` hangs pieces of these widths, in order: each
 * wall's count from distribute(), then each wall hung by hangOnRun as one
 * group in its middle. Null when a wall's share does not fit on it.
 */
export function roomLayout(s, widths) {
  const runs = roomRuns(s)
  const each = distribute(runs.map((r) => runCapacity(r.a, r.b)), widths.length)
  if (each.reduce((t, n) => t + n, 0) < widths.length) return null
  const out = []
  let k = 0
  for (const [i, run] of runs.entries()) {
    const centres = hangOnRun(run.a, run.b, widths.slice(k, k + each[i]), false)
    if (!centres) return null
    k += each[i]
    out.push({ run, centres })
  }
  return out
}

/**
 * The side of an artist's room. Up to four pieces get the smallest room — one
 * picture per wall reads as a room, not a cupboard; beyond that the room grows
 * from ROOM_MID until its walls hold them all, wide pieces needing more wall
 * than square ones. Thirty-one square pieces come out at 20 m.
 */
export function roomSide(n, widths = []) {
  const ws = Array.from({ length: n }, (_, i) => widths[i] ?? PAINTING)
  let s = n <= ROOM_MIN_PIECES ? ROOM_MIN : ROOM_MID
  while (!roomLayout(s, ws)) s += 1
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
export const INNER_MARGIN = 8
/** A room wider than this goes outside the loop, where there is room for anything. */
export const INNER_MAX = 8
/** Two of the widest inner rooms must fit face to face across the courtyard. */
export const LOOP_MIN = 2 * INNER_MAX + ROOM_GAP
/** A leg longer than this is a bug, not a museum; the search stops rather than spins. */
export const LOOP_MAX = 400
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

/**
 * Split items, kept in order, into k consecutive blocks whose largest total is
 * as small as it can be — the classic linear partition, by dynamic programming.
 * Splitting rooms over the legs by count instead let the leg that drew the one
 * 20 m room run eleven metres longer than the rest, and every leg is as long as
 * the longest. Among splits with the same largest block, the most even one
 * (least sum of squares), so ties do not leave a leg bare; no block is empty
 * unless there are fewer items than blocks, and then the first blocks take them
 * — the walk starts at leg A. Returns the block sizes (counts).
 */
export function partition(weights, k) {
  const n = weights.length
  if (n < k) return Array.from({ length: k }, (_, i) => (i < n ? 1 : 0))
  const prefix = [0]
  for (const w of weights) prefix.push(prefix[prefix.length - 1] + w)
  const sum = (i, j) => prefix[j] - prefix[i]   // items i..j-1
  const nonEmpty = n >= k
  const better = (a, b) => a[0] < b[0] - 1e-9 || (Math.abs(a[0] - b[0]) <= 1e-9 && a[1] < b[1] - 1e-9)
  // best[j][b]: [largest block, sum of squares] for the first j items in b blocks
  const best = Array.from({ length: n + 1 }, () => Array.from({ length: k + 1 }, () => [Infinity, Infinity]))
  const cut = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0))
  best[0][0] = [0, 0]
  for (let b = 1; b <= k; b++) {
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= j; i++) {
        if ((nonEmpty && i === j) || best[i][b - 1][0] === Infinity) continue
        const s = sum(i, j)
        const v = [Math.max(best[i][b - 1][0], s), best[i][b - 1][1] + s * s]
        if (better(v, best[j][b])) { best[j][b] = v; cut[j][b] = i }
      }
    }
  }
  const counts = []
  for (let j = n, b = k; b > 0; b--) { counts.unshift(j - cut[j][b]); j = cut[j][b] }
  return counts
}

/**
 * Rooms at an even beat. Each side of the corridor takes its rooms in date
 * order, shared over the four legs so that no leg's wall of rooms is longer
 * than it must be; on a leg the rooms are spaced so the gaps before, between
 * and after them are all the same. Null when a gap would be tighter than
 * ROOM_GAP: L is too short.
 */
function placeRooms(legs, L, sized) {
  const bySide = { OUT: [], IN: [] }
  sized.forEach((r, i) => bySide[r.s > INNER_MAX ? 'OUT' : i % 2 === 0 ? 'OUT' : 'IN'].push(r))
  const placed = []
  for (const side of ['OUT', 'IN']) {
    const margin = side === 'OUT' ? ROOM_GAP : INNER_MARGIN
    let from = 0
    for (const [li, count] of partition(bySide[side].map((r) => r.s + ROOM_GAP), legs.length).entries()) {
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
 * Lay the walk out over the runs: each run's share of items spread along it,
 * in walking order. A piece is hung; a portal on a leg is recorded at its slot
 * — unless another portal on that leg is within SPACING of it, in which case
 * it passes on the slot and takes the next, so two portals never share a
 * lintel (each wall is spread on its own, and their slots can coincide). A
 * portal that lands in a corner, where there is no wall to cut, moves to the
 * junction at the start of the leg ahead; a second one there shares that
 * lintel with a lower sign. Null if passing ran the slots out.
 */
function assignWalk(runs, counts, items, parts, legs) {
  const hung = []
  const portals = new Map(legs.map((l) => [l, []]))   // leg -> [{ pos, era }]
  const stacked = []                                  // { leg, era } sharing a junction lintel
  let next = 0
  for (let i = 0; i < runs.length && next < items.length; i++) {
    const run = runs[i]
    for (const c of spreadOnRun(run.a, run.b, counts[i])) {
      if (next >= items.length) break
      const item = items[next]
      if (item.piece) {
        hung.push({ t: item.piece, slot: { run, along: run.along(c), point: run.at(c), normal: run.normal } })
      } else if (run.part.kind === 'leg') {
        // Passing is for portals only; a slot facing a door on the other wall is
        // the settling pass's job, which can move a portal a few metres.
        if (portals.get(run.part).some((p) => Math.abs(p.pos - c) < SPACING)) continue
        portals.get(run.part).push({ pos: c, era: item.portal })
      } else {
        const leg = parts[parts.indexOf(run.part) + 1]
        if (portals.get(leg).some((p) => p.pos === 0)) stacked.push({ leg, era: item.portal })
        else portals.get(leg).push({ pos: 0, era: item.portal })
      }
      next++
    }
  }
  return next < items.length ? null : { hung, portals, stacked }
}

/**
 * Settle the portals: a portal took a slot on one wall of its leg, but its
 * lintel crosses the corridor, so it keeps clear of every door by PORTAL_CLEAR,
 * at least SPACING from other portals, and back from the leg's end — a portal
 * within SPACING of it would put its marker on the junction (or the lobby's
 * return lintel) and its lintel a step from the next one. Nearest spot first,
 * up to six metres either way. The pictures are hung afterwards, around it.
 */
function settlePortals(legs, portals, gapsOf) {
  for (const leg of legs) {
    const gaps = [...gapsOf(leg, 'OUT'), ...gapsOf(leg, 'IN')]
    const list = portals.get(leg)
    for (const p of list) {
      if (p.pos === 0) continue
      const clear = (pos) =>
        pos >= CORNER && pos <= leg.len - SPACING &&
        !gaps.some((g) => pos > g.from - PORTAL_CLEAR && pos < g.to + PORTAL_CLEAR) &&
        !list.some((o) => o !== p && Math.abs(o.pos - pos) < SPACING)
      for (let d = 0; d <= 6; d += 0.5) {
        if (clear(p.pos + d)) { p.pos = r6(p.pos + d); break }
        if (d > 0 && clear(p.pos - d)) { p.pos = r6(p.pos - d); break }
      }
    }
  }
}

/**
 * The corridor by era: each leg cut at its portals into sections, each section
 * and each corner titled with the era in force there. A junction where two
 * portals stack is the later era's — the earlier one had no pieces to hang
 * between them.
 */
function corridorSections(parts, portals, stacked) {
  const sections = new Map()
  let era = ERAS[0]
  for (const part of parts) {
    if (part.kind === 'leg') {
      const list = [...portals.get(part), ...stacked.filter((s) => s.leg === part).map((s) => ({ pos: 0, era: s.era }))]
      const cuts = [...new Set([0, ...list.map((p) => p.pos), part.len])].sort((a, b) => a - b)
      const out = []
      for (let i = 0; i + 1 < cuts.length; i++) {
        const here = list.filter((p) => p.pos === cuts[i])
        for (const p of here) if (ERAS.indexOf(p.era) > ERAS.indexOf(era)) era = p.era
        out.push({ id: i === 0 ? part.id : `${part.id}-${i + 1}`, from: cuts[i], to: cuts[i + 1], era, portal: here.length > 0 })
      }
      sections.set(part, out)
    } else {
      sections.set(part, [{ id: part.id, from: 0, to: part.len, era, portal: false }])
    }
  }
  return sections
}

/**
 * Hang the corridor's pieces, the portals now fixed. A portal's piers cut both
 * walls, so they are cuts like the doors; between the cuts, each era's pieces
 * are shared over the runs of its own sections and hung by their widths. When
 * an era's sections cannot hold its pieces, returns instead how many short each
 * era is, for nudgePortals to act on.
 */
function hangCorridor(parts, portals, stacked, shared, gapsOf, widthOf) {
  const sections = corridorSections(parts, portals, stacked)
  const cutsOf = (leg, side) => [
    ...gapsOf(leg, side),
    ...portals.get(leg).filter((p) => p.pos > 0).map((p) => ({ from: p.pos - WALL_T / 2, to: p.pos + WALL_T / 2 })),
  ]
  const runs = corridorRuns(parts, cutsOf)
  const sectionOf = (run) => {
    const mid = (run.a + run.b) / 2
    return sections.get(run.part).find((s) => mid >= s.from - 1e-6 && mid <= s.to + 1e-6)
  }
  const hung = []
  const deficits = new Map()
  for (const era of ERAS) {
    const pieces = shared.filter((t) => eraOf(t.createdAt) === era.id)
    const mine = runs.filter((r) => sectionOf(r).era === era)
    const counts = share(mine, pieces.length)
    if (!counts) {
      deficits.set(era, pieces.length - mine.reduce((t, r) => t + runCapacity(r.a, r.b), 0))
      continue
    }
    let next = 0
    mine.forEach((run, i) => {
      const group = pieces.slice(next, next + counts[i])
      next += counts[i]
      const centres = hangOnRun(run.a, run.b, group.map(widthOf))
      if (centres) group.forEach((t, j) => hung.push({ t, room: sectionOf(run).id, point: run.at(centres[j]), normal: run.normal }))
      else deficits.set(era, (deficits.get(era) ?? 0) + 1)
    })
  }
  return deficits.size ? { deficits } : { hung, sections }
}

/**
 * Give a short era more corridor: the portal that ends it — the next era's —
 * moves on by the wall its deficit needs, half a pitch per piece on each wall.
 * The next era loses that much, and if it was short too the next round moves
 * its portal in turn; a round that can move nothing (the era runs to the lobby,
 * or its portal sits on a junction the walk put it on) reports false, and the
 * loop grows instead. settlePortals runs after, so a nudged portal still keeps
 * clear of doors.
 */
function nudgePortals(deficits, portals, legs) {
  let moved = false
  for (const [era, short] of deficits) {
    const after = ERAS[ERAS.indexOf(era) + 1]
    if (!after) continue
    for (const leg of legs) {
      const p = portals.get(leg).find((q) => q.era === after && q.pos > 0)
      if (!p) continue
      const to = Math.min(leg.len - SPACING, p.pos + (short * SPACING) / 2 + PORTAL_CLEAR)
      if (to > p.pos + 1e-9) { p.pos = r6(to); moved = true }
    }
  }
  return moved
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
export function buildGallery({ tokens, collaborations = {}, volumes = new Map(), sizes = new Map(), previews = new Map(), generatedAt }) {
  const visible = tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag))
  const { solo, halls, artistCount } = assignRooms(visible, collaborations, { volumes })
  const shared = [...halls.values()].flat().sort(byDate)

  /**
   * A painting's size on the wall: the preview's proportions with PAINTING on
   * the long side. `sizes` is what archive-previews.mjs recorded; a project it
   * never reached keeps fxhash's square thumbnail and hangs square.
   */
  const shapeOf = (t) => {
    const dims = sizes.get(t.id)
    const aspect = dims && dims.w > 0 && dims.h > 0 ? dims.w / dims.h : 1
    return aspect >= 1
      ? { w: PAINTING, h: r6(PAINTING / aspect) }
      : { w: r6(PAINTING * aspect), h: PAINTING }
  }
  const widthOf = (t) => shapeOf(t).w
  const sized = solo.map((a) => ({ artist: a, s: roomSide(a.projects.length, a.projects.map(widthOf)) }))

  // The walk: the corridor's pieces in date order, and before the first piece of
  // every era after the first, a portal — a reserved slot that gets the lintel.
  // Giving portals a slot of their own is what keeps them the same pitch from the
  // pictures as the pictures are from each other, and in era order by construction.
  const items = []
  const pending = ERAS.slice(1)
  for (const t of shared) {
    const era = ERAS.findIndex((e) => e.id === eraOf(t.createdAt))
    while (pending.length && ERAS.indexOf(pending[0]) <= era) items.push({ portal: pending.shift() })
    items.push({ piece: t })
  }
  for (const era of pending) items.push({ portal: era })
  const years = visible.map((t) => Number(t.createdAt.slice(0, 4)))
  const span = years.length ? [Math.min(...years), Math.max(...years)] : [0, 0]

  // Grow the loop until the rooms keep their beat and the walls hold every piece.
  // Start from a lower bound rather than the minimum: the rooms on the busier
  // side need their wall, and the corridor pieces need theirs — eight walls of
  // L at pitch, and the corners' walls beyond that. A bound must never overshoot:
  // the first loop's charged every room its whole frontage, when a room only
  // costs its door, and started 25 m too long, which was the empty wall Frank saw.
  const sides = { OUT: [], IN: [] }
  sized.forEach((r, i) => sides[r.s > INNER_MAX ? 'OUT' : i % 2 === 0 ? 'OUT' : 'IN'].push(r.s))
  const need = (rooms, margin) => (rooms.reduce((t, s) => t + s + ROOM_GAP, 0) + ROOM_GAP) / 4 + 2 * margin
  const lower = Math.max(LOOP_MIN, need(sides.OUT, ROOM_GAP), need(sides.IN, INNER_MARGIN), (SPACING * items.length) / 8 - HALL_W)
  let layout = null
  for (let L = Math.max(LOOP_MIN, Math.floor(lower / SPACING) * SPACING); !layout; L += SPACING) {
    if (L > LOOP_MAX) throw new Error(`gallery: no loop up to ${LOOP_MAX} m holds ${solo.length} rooms and ${items.length} corridor items`)
    const parts = loopParts(L)
    const legs = parts.filter((p) => p.kind === 'leg')
    const placed = placeRooms(legs, L, sized)
    if (!placed) continue
    const gapsOf = (leg, side) =>
      placed.filter((p) => p.leg === leg && p.side === side)
        .map((p) => ({ from: p.a0 + p.s / 2 - DOOR_W / 2, to: p.a0 + p.s / 2 + DOOR_W / 2, top: DOOR_H }))
    const runs = corridorRuns(parts, gapsOf)
    // First pass, at pitch: where the portals fall in the walk. Slots for the
    // items, plus exactly as many as portals pass on: k grows until the walk
    // fits, so the spare slots are the ones passed over in the middle, not a
    // bare stretch at the end. Second pass: the portals settled and cut into
    // both walls, each era's pieces hung by their widths in its own sections.
    // share() says when the walls cannot hold that many at all, and then the
    // loop grows.
    for (let k = 0; k <= ERAS.length; k++) {
      const counts = share(runs, items.length + k)
      if (!counts) break
      const walk = assignWalk(runs, counts, items, parts, legs)
      if (!walk) continue
      settlePortals(legs, walk.portals, gapsOf)
      let corridor = null
      for (let round = 0; round < 8 && !corridor; round++) {
        const result = hangCorridor(parts, walk.portals, walk.stacked, shared, gapsOf, widthOf)
        if (result.hung) corridor = result
        else if (nudgePortals(result.deficits, walk.portals, legs)) settlePortals(legs, walk.portals, gapsOf)
        else break
      }
      if (corridor) { layout = { L, parts, legs, placed, gapsOf, portals: walk.portals, stacked: walk.stacked, ...corridor }; break }
    }
  }
  const { parts, legs, placed, gapsOf, hung, portals, stacked, sections } = layout

  const rooms = []
  const walls = []
  const paintings = []
  const signs = []

  /** `preview` only when one was captured: the first metadata format never recorded it. */
  const hang = (t, room, point, normal) =>
    paintings.push({
      project: t.id, slug: t.slug, name: t.name, artist: creditOf(t, collaborations),
      year: Number(t.createdAt.slice(0, 4)), room, x: r6(point.x), z: r6(point.z), yaw: yawOf(normal), tile: 0,
      ...shapeOf(t),
      ...(previews.has(t.id) ? { preview: previews.get(t.id) } : {}),
    })
  /** A sign on a wall at `point` (on the wall line), facing `normal`, stood off like a painting. */
  const sign = (kind, text, point, normal, y, w, h) =>
    signs.push({ text, kind, x: r6(point.x + normal.x * SIGN_OFFSET), y, z: r6(point.z + normal.z * SIGN_OFFSET), yaw: yawOf(normal), w, h })
  const opening = (from) => [{ from: from - OPENING_W / 2, to: from + OPENING_W / 2, top: DOOR_H }]
  /**
   * A wall panel: a heading with its lines stacked under it, centred on the wall
   * and straddling eye height, the way a museum sets its introductory text. The
   * lobby's two blank walls carry these — the walls you are not already facing
   * when you arrive, since the one ahead is the way in.
   */
  const panel = (point, normal, { heading, lines }) => {
    sign('title', heading, point, normal, 3, 4, 0.4)
    lines.forEach((text, i) => sign('panel', text, point, normal, 2.35 - i * 0.38, 7, 0.28))
  }

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
  // The lobby face of the same lintel, read on the way out into leg D. Leg D is
  // the last leg of the loop, so walking out through here is walking the whole
  // timeline backwards, newest first.
  sign('title', `Through here is the end, ${span[1]} — walk this way and you go back in time`, { x: HX, z: LOBBY / 2 }, { x: -1, z: 0 }, 3.5, 3.6, 0.4)

  // The corridor face of the lobby's own opening. Walking back down leg A is
  // walking back through the years, and this is what you are walking back into.
  sign('title', `The lobby is through here — the walk begins there, at ${span[0]}`, { x: 0, z: LOBBY }, { x: 0, z: 1 }, 3.5, 4, 0.4)

  // The two walls you are not facing when you arrive: behind you, what the place
  // is; beside you, how to walk it. The east side is the way back in and carries
  // the full-circle sign, and the north is the way out.
// The wall text, written once and used twice: hung in the lobby, and handed to
  // the client so the HUD's About panel says the same thing. Someone who walks
  // straight past the wall can still read it, and the two cannot drift.
  const about = [
    {
      heading: 'About this gallery',
      lines: [
        `The ${visible.length} fxhash projects whose code this archive holds,`,
        `hung in the order they were made, ${span[0]} to ${span[1]}.`,
        'An artist with three or more archived works — or two much collected —',
        'has a room; the rest line the corridor, which loops back to here.',
      ],
    },
    {
      heading: 'How to walk it',
      lines: [
        'W A S D to walk, the mouse to look, hold Shift to run.',
        'Click a painting and you step up to it — it runs there on the wall,',
        'from the seed behind the picture you walked up to. ‹ › page the editions.',
        'Esc steps back; the Rooms menu jumps to any era or artist.',
      ],
    },
  ]
  panel({ x: 0, z: 0 }, { x: 0, z: 1 }, about[0])
  panel({ x: -HX, z: LOBBY / 2 }, { x: 1, z: 0 }, about[1])

  // Era markers: something to teleport to a metre past each portal, and the
  // era's name on the lintel facing you. The first era's name is on the pier
  // beside the lobby opening, whose lintel carries the title.
  const markers = [{
    era: ERAS[0], centre: { x: 0, z: LOBBY + 1 }, dir: { x: 0, z: 1 },
    wall: { x: HX - 1, z: LOBBY }, normal: { x: 0, z: -1 }, y: 2.2, w: 1.8,
  }]
  for (const leg of legs) {
    for (const p of portals.get(leg)) {
      markers.push({ era: p.era, centre: leg.at(Math.min(p.pos + 1, leg.len - 1)), dir: leg.U, wall: leg.at(p.pos), normal: neg(leg.U), y: 3.5, w: 5 })
    }
  }
  for (const { leg, era } of stacked) {
    markers.push({ era, centre: leg.at(1.5), dir: leg.U, wall: leg.at(0), normal: neg(leg.U), y: 2.7, w: 5 })
  }
  markers.sort((p, q) => ERAS.indexOf(p.era) - ERAS.indexOf(q.era))
  for (const m of markers) {
    rooms.push({
      id: m.era.id, kind: 'era', title: m.era.label,
      rect: { x: r6(m.centre.x), z: r6(m.centre.z), w: 0, d: 0 },
      entry: { x: r6(m.centre.x), z: r6(m.centre.z), yaw: yawOf(m.dir) },
    })
    sign('era', m.era.label, m.wall, m.normal, m.y, m.w, 0.8)
    // The other face. A portal is a wall across the corridor and both its sides
    // are walked; naming only the era ahead left anyone who turned round with
    // nothing to steer by. Going back you enter the era before this one — and
    // the first era has none, so the back of that opening is the lobby's sign.
    const before = ERAS[ERAS.indexOf(m.era) - 1]
    if (before) sign('era', before.label, m.wall, neg(m.normal), m.y, m.w, 0.8)
  }

  // Legs as era sections between their portals, corners as they come, all
  // titled with the era in force; the corridor walls cut for the doors and the
  // portals cut for the opening.
  for (const part of parts) {
    if (part.kind === 'leg') {
      for (const s of sections.get(part)) {
        rooms.push({
          id: s.id, kind: 'hall', title: s.era.label,
          rect: rectOf([part.at(s.from, part.OUT), part.at(s.to, part.OUT), part.at(s.from, part.IN), part.at(s.to, part.IN)]),
          entry: { x: r6(part.at(s.from + 1.5).x), z: r6(part.at(s.from + 1.5).z), yaw: yawOf(part.U) },
        })
        if (s.portal) walls.push(...wallBetween(part.at(s.from, part.OUT), part.at(s.from, part.IN), opening(HX)))
      }
      for (const side of ['OUT', 'IN']) {
        const wallDir = side === 'OUT' ? part.OUT : part.IN
        walls.push(...wallBetween(part.at(0, wallDir), part.at(part.len, wallDir), gapsOf(part, side)))
      }
    } else {
      const centre = { x: part.rect.x + part.rect.w / 2, z: part.rect.z + part.rect.d / 2 }
      rooms.push({ id: part.id, kind: 'hall', title: sections.get(part)[0].era.label, rect: part.rect, entry: { x: r6(centre.x), z: r6(centre.z), yaw: 0 } })
      for (const w of part.outerWalls) walls.push(...wallBetween(w.p, w.q))
    }
  }
  for (const h of hung) hang(h.t, h.room, h.point, h.normal)

  // Artists' rooms: a square off the corridor with its door centred on the
  // corridor wall, pictures spread over the walls facing and beside the door
  // before the door wall itself, the name above the door and on the far wall.
  for (const { artist: a, leg, side, a0, s } of placed) {
    const V = side === 'OUT' ? leg.OUT : leg.IN
    const U = leg.U
    const O = leg.at(a0, V)
    const at = (u, v) => add(add(O, U, u), V, v)
    const toWorld = (n) => ({ x: U.x * n.u + V.x * n.v, z: U.z * n.u + V.z * n.v })
    let k = 0
    for (const { run: r, centres } of roomLayout(s, a.projects.map(widthOf))) {
      const normal = toWorld(r.normal)
      for (const c of centres) {
        const local = r.at(c)
        hang(a.projects[k++], a.id, add(at(local.u, local.v), normal, WALL_OFFSET), normal)
      }
    }
    rooms.push({
      id: a.id, kind: 'solo', title: a.name, rect: rectOf([at(0, 0), at(s, 0), at(0, s), at(s, s)]),
      entry: { x: r6(at(s / 2, 1.5).x), z: r6(at(s / 2, 1.5).z), yaw: yawOf(V) },
    })
    walls.push(
      ...wallBetween(at(0, 0), at(0, s)),
      ...wallBetween(at(0, s), at(s, s)),
      ...wallBetween(at(s, 0), at(s, s)),
    )
    sign('room', a.name, at(s / 2, 0), neg(V), 3.5, 4.8, 0.8)   // above the door, seen from the corridor
    sign('room', a.name, at(s / 2, s), neg(V), 3.5, 4.8, 0.8)   // on the wall facing the door, inside
  }

  // Plaques: under the lower-right corner, as a visitor facing the painting sees
  // it — and back against the wall, where the painting itself stands proud.
  const pull = WALL_OFFSET - SIGN_OFFSET
  for (const p of paintings) {
    const rx = Math.cos(p.yaw)
    const rz = -Math.sin(p.yaw)
    const shift = p.w / 2 - 0.25
    signs.push({
      text: `${p.name} — ${p.artist}, ${p.year}`, kind: 'plaque',
      x: r6(p.x + rx * shift - Math.sin(p.yaw) * pull), y: r6(EYE_Y - p.h / 2 - 0.12),
      z: r6(p.z + rz * shift - Math.cos(p.yaw) * pull),
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
    about,
    rooms, walls, paintings, signs,
  }
}
