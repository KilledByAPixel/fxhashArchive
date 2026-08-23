// Pure builders for public/data/gallery.json — the walkable museum of the archived
// generators. Kept free of I/O so the layout rules can be tested directly, mirroring
// scripts/summary-lib.mjs. Every number that shapes the building lives here.
//
// Coordinates are metres, y up, the spine of halls runs along +z from the lobby at
// z = 0. A `yaw` names a direction (sin yaw, 0, cos yaw) in the xz plane: for a
// painting or sign it is the normal pointing into the room; for a pose it is the
// facing direction. See docs/superpowers/specs/2026-08-23-fxhash-gallery-design.md.

import { creditLine } from './summary-lib.mjs'

export const SOLO_MIN = 5

export const HALL_W = 8
export const WALL_H = 4
export const WALL_T = 0.3
export const PAINTING = 1.2
export const EYE_Y = 1.6
export const SPACING = 3
export const DOOR_W = 2
export const DOOR_H = 3
export const OPENING_W = 4
export const ROOM_MIN = 8
export const ROOM_GAP = 2
export const CORNER = 1
export const LOBBY = 8
export const HALL_MIN = 12
/** How far a painting or sign stands off its wall, so it never z-fights with it. */
export const WALL_OFFSET = 0.02

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
export function assignRooms(tokens, collaborations = {}) {
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
  const solo = [...perArtist.values()].filter((a) => a.projects.length >= SOLO_MIN)
  const soloIds = new Set(solo.flatMap((a) => a.projects.map((t) => t.id)))

  const halls = new Map(ERAS.map((e) => [e.id, []]))
  for (const t of sorted) if (!soloIds.has(t.id)) halls.get(eraOf(t.createdAt)).push(t)

  // Distinct people credited, collaboration members included.
  const people = new Set()
  for (const t of sorted) {
    const members = collaborations[String(t.id)]?.collaborators
    if (members?.length) for (const m of members) people.add(m.id)
    else if (t.author?.id) people.add(t.author.id)
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

/** Door gap centred on a wall of length `len`. No `top` — callers add it. */
export const doorGap = (len) => ({ from: len / 2 - DOOR_W / 2, to: len / 2 + DOOR_W / 2 })

/** How many paintings a square solo room of side `s` can hang, door wall included. */
export function soloRoomSlots(s) {
  const doorWall = freeRuns(0, s, [doorGap(s)]).flatMap(([a, b]) => slotsOnRun(a, b)).length
  const plainWall = freeRuns(0, s).flatMap(([a, b]) => slotsOnRun(a, b)).length
  return doorWall + 3 * plainWall
}

/** The smallest side ≥ ROOM_MIN whose four walls hold `n` paintings. */
export function soloRoomSide(n) {
  let s = ROOM_MIN
  while (soloRoomSlots(s) < n) s += 1
  return s
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

/**
 * Painting placements along one wall: centres at pitch on the free runs, stood
 * WALL_OFFSET off the wall along the normal `yaw`.
 */
function hangAlong(axis, fixed, from, to, gaps, yaw) {
  const nx = Math.sin(yaw)
  const nz = Math.cos(yaw)
  return freeRuns(from, to, gaps)
    .flatMap(([a, b]) => slotsOnRun(a, b))
    .map((c) => ({
      x: r6((axis === 'x' ? c : fixed) + nx * WALL_OFFSET),
      z: r6((axis === 'x' ? fixed : c) + nz * WALL_OFFSET),
      yaw: r6(yaw),
    }))
}

const opening = () => ({ from: -OPENING_W / 2, to: OPENING_W / 2, top: DOOR_H })

/**
 * The whole building, from the archived set.
 *
 * A lobby, then seven era halls end to end along +z. Solo rooms hang off the
 * outer walls of the hall of their artist's first piece, alternating left and
 * right, packed from the hall's start. A hall is as long as it must be: long
 * enough for its rooms on its busier side, and long enough to hang every shared
 * painting of its era in the wall between the doors. Nothing here depends on
 * input order — see byDate — so the same archive gives the same building.
 */
export function buildGallery({ tokens, collaborations = {}, generatedAt }) {
  const visible = tokens.filter((t) => !HIDDEN_FLAGS.has(t.flag))
  const { solo, halls, artistCount } = assignRooms(visible, collaborations)
  const years = visible.map((t) => Number(t.createdAt.slice(0, 4)))
  const span = years.length ? [Math.min(...years), Math.max(...years)] : [0, 0]

  const rooms = []
  const walls = []
  const paintings = []
  const signs = []

  const hang = (t, room, slot) =>
    paintings.push({
      project: t.id, slug: t.slug, name: t.name, artist: creditOf(t, collaborations),
      year: Number(t.createdAt.slice(0, 4)), room, x: slot.x, z: slot.z, yaw: slot.yaw, tile: 0,
    })
  /** A sign on a wall at (x, y, z) facing `yaw`, stood off the wall like a painting. */
  const sign = (kind, text, x, y, z, yaw, w, h) =>
    signs.push({
      text, kind, x: r6(x + Math.sin(yaw) * WALL_OFFSET), y, z: r6(z + Math.cos(yaw) * WALL_OFFSET),
      yaw: r6(yaw), w, h,
    })

  // Lobby: spawn in the middle facing the spine; title above the opening ahead.
  rooms.push({
    id: 'lobby', kind: 'lobby', title: 'fxhash',
    rect: { x: -HX, z: 0, w: LOBBY, d: LOBBY }, entry: { x: 0, z: LOBBY / 2, yaw: 0 },
  })
  walls.push(
    ...wallSegments('z', -HX, 0, LOBBY),
    ...wallSegments('z', HX, 0, LOBBY),
    ...wallSegments('x', 0, -HX, HX),
    ...wallSegments('x', LOBBY, -HX, HX, [opening()]),
  )
  sign('title', 'fxhash', 0, 3.65, LOBBY, Math.PI, 3, 0.5)
  sign('title', `${visible.length} archived works · ${artistCount} artists · ${span[0]}–${span[1]}`, 0, 3.25, LOBBY, Math.PI, 3, 0.25)

  let z0 = LOBBY
  ERAS.forEach((era, k) => {
    const shared = halls.get(era.id)
    const here = solo.filter((a) => eraOf(a.projects[0].createdAt) === era.id)

    // Rooms first: they decide the hall's minimum length and where its doors are.
    const placed = []
    let need = HALL_MIN
    for (const side of ['left', 'right']) {
      let z = z0 + ROOM_GAP
      here.forEach((a, i) => {
        if ((i % 2 === 0 ? 'left' : 'right') !== side) return
        const s = soloRoomSide(a.projects.length)
        const rect = side === 'left' ? { x: -HX - s, z, w: s, d: s } : { x: HX, z, w: s, d: s }
        placed.push({ artist: a, side, rect, doorZ: z + s / 2 })
        z += s + ROOM_GAP
      })
      need = Math.max(need, z - z0)
    }
    const gapsFor = (side) =>
      placed.filter((p) => p.side === side).map((p) => ({ from: p.doorZ - DOOR_W / 2, to: p.doorZ + DOOR_W / 2, top: DOOR_H }))
    const leftGaps = gapsFor('left')
    const rightGaps = gapsFor('right')

    // Then the hall: grow until every shared painting has a slot. Slots are walked
    // in z order, left before right, so the hall reads chronologically down both sides.
    const slotsFor = (L) =>
      [
        ...hangAlong('z', -HX, z0, z0 + L, leftGaps, Math.PI / 2),
        ...hangAlong('z', HX, z0, z0 + L, rightGaps, -Math.PI / 2),
      ].sort((p, q) => p.z - q.z || p.x - q.x)
    let L = Math.ceil(need / SPACING) * SPACING
    while (slotsFor(L).length < shared.length) L += SPACING
    const slots = slotsFor(L)
    shared.forEach((t, i) => hang(t, era.id, slots[i]))

    rooms.push({
      id: era.id, kind: 'hall', title: era.label,
      rect: { x: -HX, z: z0, w: HALL_W, d: L }, entry: { x: 0, z: z0 + 1.5, yaw: 0 },
    })
    walls.push(
      ...wallSegments('z', -HX, z0, z0 + L, leftGaps),
      ...wallSegments('z', HX, z0, z0 + L, rightGaps),
      ...wallSegments('x', z0 + L, -HX, HX, k === ERAS.length - 1 ? [] : [opening()]),
    )
    // The era's name on the pier to the right of the opening you are about to walk
    // through, facing you. (The header above the opening is the lobby title's spot.)
    sign('era', era.label, HX - 1, 2.2, z0, Math.PI, 1.8, 0.5)

    for (const { artist: a, side, rect, doorZ } of placed) {
      const s = rect.w
      const inward = side === 'left' ? -Math.PI / 2 : Math.PI / 2   // walking through the door
      const doorWallX = side === 'left' ? rect.x + s : rect.x
      const farWallX = side === 'left' ? rect.x : rect.x + s
      const gap = { from: doorZ - DOOR_W / 2, to: doorZ + DOOR_W / 2 }
      const roomSlots = [
        ...hangAlong('z', doorWallX, rect.z, rect.z + s, [gap], inward),
        ...hangAlong('x', rect.z + s, rect.x, rect.x + s, [], Math.PI),
        ...hangAlong('z', farWallX, rect.z, rect.z + s, [], -inward),
        ...hangAlong('x', rect.z, rect.x, rect.x + s, [], 0),
      ]
      a.projects.forEach((t, i) => hang(t, a.id, roomSlots[i]))
      rooms.push({
        id: a.id, kind: 'solo', title: a.name, rect,
        entry: { x: r6(doorWallX + Math.sin(inward) * 1.5), z: doorZ, yaw: r6(inward) },
      })
      walls.push(
        ...wallSegments('z', farWallX, rect.z, rect.z + s),
        ...wallSegments('x', rect.z, rect.x, rect.x + s),
        ...wallSegments('x', rect.z + s, rect.x, rect.x + s),
      )
      sign('room', a.name, doorWallX, 3.5, doorZ, -inward, 2.4, 0.4)   // above the door, seen from the hall
      sign('room', a.name, farWallX, 3.5, doorZ, -inward, 2.4, 0.4)    // on the wall facing the door, inside
    }

    z0 += L
  })

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
