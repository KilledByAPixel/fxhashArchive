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
  const solo = [...perArtist.values()]
    .filter((a) => a.projects.length >= SOLO_MIN)
    .filter((a) => {
      // All projects must be in the same era
      const eras = new Set(a.projects.map((t) => eraOf(t.createdAt)))
      return eras.size === 1
    })
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
