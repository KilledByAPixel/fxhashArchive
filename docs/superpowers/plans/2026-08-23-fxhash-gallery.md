# fxhash Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A walkable three.js museum at `#/gallery` holding the 420 archived generators, laid out at build time, where stepping up to a painting runs the real piece from its real seed.

**Architecture:** A build script (`scripts/build-gallery.mjs`, pure logic in `scripts/gallery-lib.mjs`) turns the archived set into `public/data/gallery.json` (rooms, walls, paintings, signs) and four atlas images. A lazy-loaded route builds the scene from that JSON — all paintings are two draw calls — and, when the camera is squared up to a painting, mounts the existing sandboxed `PieceFrame` over the painting's on-screen rectangle.

**Tech Stack:** Vite 8, React 19, TypeScript, react-router-dom 7 (hash router), three ^0.185 + @types/three, sharp (build only), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-23-fxhash-gallery-design.md`

## Global Constraints

- **Only archived, visible projects.** Keys of `public/data/generators/manifest.json`, minus any token whose `flag` is in `MALICIOUS`, `HIDDEN`, `REPORTED`, `AUTO_DETECT_COPY`.
- **Minted editions only.** The viewer steps real iteration ids and archived seeds. Never a random unminted seed.
- **Halls by era, solo rooms at `SOLO_MIN = 5`** non-collaboration archived projects. Collaborations hang in halls, credited to every member.
- **Geometry constants** (metres): `HALL_W 8`, `WALL_H 4`, `WALL_T 0.3`, `PAINTING 1.2`, `EYE_Y 1.6`, `SPACING 3`, `DOOR_W 2`, `DOOR_H 3`, `OPENING_W 4`, `ROOM_MIN 8`, `ROOM_GAP 2`, `CORNER 1`, `LOBBY 8`, `HALL_MIN 12`.
- **Atlases:** large 4096² / tile 256 / gutter 4 / 15 columns; small 2048² / tile 128 / gutter 2 / 15 columns; 225 tiles per file; WebP quality 82; tile order is ascending project id.
- **Angle convention, everywhere:** a `yaw` names a direction `(sin yaw, 0, cos yaw)` in the xz plane. For a painting or sign that direction is its normal, pointing into the room. For a pose it is the facing direction. A three.js camera faces a pose with `camera.rotation.y = pose.yaw + Math.PI` (rotation order `'YXZ'`). The viewing pose for a painting is `pose.yaw = painting.yaw + Math.PI`. The "right" of a viewer facing a painting is `(cos painting.yaw, 0, -sin painting.yaw)`.
- **three.js is imported only under `src/gallery/`**, never from `three/examples`, and only reaches the browser through the lazy `GalleryView` chunk.
- **No site-wide layout changes.** `/gallery` is a sibling of the `Layout` route, not a child.
- **`globals: true` stays off in `vite.config.ts`.** Every rendering test registers `afterEach(cleanup)` itself.
- **Moderation stays enforced** by `HIDDEN_FLAGS`, in the build script and again in nothing the client needs — the client only ever sees what the build wrote.
- Run tests with `npm test`, typecheck with `npm run typecheck`. Both must pass before every commit. Commit messages follow the repo: lowercase `type: what it does for whom`.

## File Structure

```
scripts/gallery-lib.mjs            pure: eras, room assignment, wall/slot geometry, buildGallery, tile math
scripts/gallery-lib.test.mjs       tests for all of the above, plus invariants on real data when present
scripts/build-gallery.mjs          I/O: reads the archive, writes gallery.json and the atlases, prints sizes
public/data/gallery.json           generated
public/data/gallery/atlas-*.webp   generated (2 large, 2 small)

src/gallery/types.ts               the Gallery JSON interfaces
src/gallery/query.ts               ?project / ?room parsing                       (pure, tested)
src/gallery/collide.ts             circle-vs-wall sliding                         (pure, tested)
src/gallery/approach.ts            viewing pose, projectedRect, easing            (pure, tested)
src/gallery/geometry.ts            quads/boxes → BufferGeometry, tile UVs         (tested without WebGL)
src/gallery/labels.ts              sign packing + canvas rasterising              (packing tested)
src/gallery/scene.ts               assembles meshes, lights, fog; dispose
src/gallery/controls.ts            keys, mouse, touch → PlayerState               (integrate tested)
src/gallery/engine.ts              renderer + loop + raycast + glide; events out
src/gallery/Viewer.tsx             the piece overlay: PieceFrame + edition bar    (RTL tested)
src/gallery/Hud.tsx                crosshair caption, rooms menu, hints           (RTL tested)
src/gallery/GalleryView.tsx        owns the engine; the lazy chunk
src/pages/GalleryPage.tsx          WebGL probe → fallback or Suspense(GalleryView) (RTL tested)
src/lib/data.ts                    + loadGallery()
src/App.tsx, Layout.tsx, TokenPage.tsx, ArtistPage.tsx, styles.css, README.md, package.json
```

---

### Task 1: gallery-lib — eras, credits, room assignment

**Files:**
- Create: `scripts/gallery-lib.mjs`
- Test: `scripts/gallery-lib.test.mjs`

**Interfaces:**
- Consumes: `creditLine(collaborators)` from `scripts/summary-lib.mjs` (exists).
- Produces: constants listed in Global Constraints; `ERAS: {id, label}[]`; `eraOf(createdAt: string): string`; `isCollab(token): boolean`; `creditOf(token, collaborations): string`; `assignRooms(tokens, collaborations): { solo: {id, name, projects: token[]}[], halls: Map<eraId, token[]>, artistCount: number }`. Tokens are catalog entries (`id, slug, name, flag, createdAt, author: {id, name}`); `collaborations` is `byProject` from `collaborations.json`.

- [ ] **Step 1: Write the failing tests**

```js
// scripts/gallery-lib.test.mjs
import { test, expect } from 'vitest'
import { ERAS, eraOf, isCollab, creditOf, assignRooms, SOLO_MIN } from './gallery-lib.mjs'

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
  const bob = { id: 'tz1b', name: 'Bob' }
  const tokens = [
    ...Array.from({ length: SOLO_MIN }, (_, i) => tok(10 + i, `2021-11-${String(10 + i).padStart(2, '0')}T00:00:00.000Z`, alice)),
    ...Array.from({ length: SOLO_MIN - 1 }, (_, i) => tok(20 + i, `2022-02-0${1 + i}T00:00:00.000Z`, bob)),
    tok(30, '2021-12-01T00:00:00.000Z', { id: 'KT1abc', name: null }),
    tok(31, '2023-06-01T00:00:00.000Z', bob),
  ]
  const collaborations = { '30': { collaborators: [alice, bob] } }
  const { solo, halls, artistCount } = assignRooms(tokens, collaborations)
  expect(solo.map((a) => a.id)).toEqual(['tz1a'])
  expect(solo[0].projects.map((t) => t.id)).toEqual([10, 11, 12, 13, 14])
  expect(halls.get('2021').map((t) => t.id)).toEqual([30])          // the collab, never solo
  expect(halls.get('2022-q1').map((t) => t.id)).toEqual([20, 21, 22, 23])
  expect(halls.get('2023-on').map((t) => t.id)).toEqual([31])
  expect(halls.get('2022-q3')).toEqual([])                            // every era exists
  expect(artistCount).toBe(2)
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: FAIL — `Failed to resolve import "./gallery-lib.mjs"`.

- [ ] **Step 3: Write the implementation**

```js
// scripts/gallery-lib.mjs
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/gallery-lib.mjs scripts/gallery-lib.test.mjs
git commit -m "feat: decide which archived projects share a hall and which artists get a room"
```

---

### Task 2: gallery-lib — walls, slots, and solo room sizing

**Files:**
- Modify: `scripts/gallery-lib.mjs` (append)
- Test: `scripts/gallery-lib.test.mjs` (append)

**Interfaces:**
- Produces: `wallSegments(axis: 'x'|'z', fixed, from, to, gaps: {from, to, top}[]): Wall[]` where `Wall = {x1, z1, x2, z2, y0, y1}`; `freeRuns(from, to, gaps): [a, b][]`; `slotsOnRun(a, b): number[]`; `soloRoomSlots(side): number`; `soloRoomSide(n): number`.

- [ ] **Step 1: Write the failing tests**

```js
// append to scripts/gallery-lib.test.mjs
import {
  wallSegments, freeRuns, slotsOnRun, soloRoomSlots, soloRoomSide,
  WALL_H, DOOR_H, SPACING, CORNER, ROOM_MIN,
} from './gallery-lib.mjs'

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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: FAIL — `wallSegments is not a function` (and the others).

- [ ] **Step 3: Write the implementation**

```js
// append to scripts/gallery-lib.mjs

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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/gallery-lib.mjs scripts/gallery-lib.test.mjs
git commit -m "feat: size a room from the paintings it has to hang"
```

---
### Task 3: gallery-lib — buildGallery and its invariants

**Files:**
- Modify: `scripts/gallery-lib.mjs` (append)
- Create: `scripts/gallery-inputs.mjs`
- Test: `scripts/gallery-lib.test.mjs` (append)

**Interfaces:**
- Consumes: everything from Tasks 1–2.
- Produces: `buildGallery({ tokens, collaborations, generatedAt }): Gallery` — the exact JSON shape in the spec (`generatedAt, counts, atlas, spawn, rooms, walls, paintings, signs`); `ATLAS`, `ATLAS_SMALL`, `TILES_PER_ATLAS`, `tileRect(tile, atlas): { file, col, row, x, y, cell }`; `readArchiveInputs(dataDir): Promise<{ tokens, collaborations, thumbs: Record<id, path> }>` (I/O, in `gallery-inputs.mjs`).

- [ ] **Step 1: Write the failing tests**

```js
// append to scripts/gallery-lib.test.mjs
import { existsSync } from 'node:fs'
import {
  buildGallery, tileRect, ATLAS, ATLAS_SMALL, TILES_PER_ATLAS,
  WALL_OFFSET, PAINTING, EYE_Y,
} from './gallery-lib.mjs'
import { readArchiveInputs } from './gallery-inputs.mjs'

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
```

Add `HIDDEN_FLAGS` to the import from `./gallery-lib.mjs` at the top of the test file.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: FAIL — `Failed to resolve import "./gallery-inputs.mjs"`.

- [ ] **Step 3: Write `scripts/gallery-inputs.mjs`**

```js
// scripts/gallery-inputs.mjs
// The I/O half of the gallery build: what buildGallery needs, read off disk. Separate
// from build-gallery.mjs so a test can run the layout over the real archive without
// importing a script whose top level does work.

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Every catalog entry for an archived project, the collaboration credits, and a
 * map of project id → thumbnail path. The archived set is the manifest's keys —
 * the same source build-summary.mjs uses — so the gallery cannot disagree with the
 * grid's badges about what is archived.
 */
export async function readArchiveInputs(dataDir = 'public/data') {
  const manifest = JSON.parse(await readFile(join(dataDir, 'generators', 'manifest.json'), 'utf8'))
  const archived = new Set(Object.keys(manifest).map(Number))

  const shards = (await readdir(join(dataDir, 'tokens')))
    .filter((f) => /^index-\d+\.json$/.test(f))
    .sort()
  const tokens = []
  for (const f of shards) {
    for (const t of JSON.parse(await readFile(join(dataDir, 'tokens', f), 'utf8'))) {
      if (archived.has(t.id)) tokens.push(t)
    }
  }

  const collaborations = await readFile(join(dataDir, 'collaborations.json'), 'utf8')
    .then((s) => JSON.parse(s).byProject ?? {})
    .catch(() => ({}))

  const thumbs = {}
  for (const f of await readdir(join(dataDir, 'thumbs')).catch(() => [])) {
    const m = f.match(/^(\d+)\.\w+$/)
    if (m) thumbs[m[1]] = join(dataDir, 'thumbs', f)
  }

  return { tokens, collaborations, thumbs }
}
```

- [ ] **Step 4: Append `buildGallery` and the tile math to `scripts/gallery-lib.mjs`**

```js
// append to scripts/gallery-lib.mjs

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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run scripts/gallery-lib.test.mjs`
Expected: PASS, 14 tests — including the real-archive one, since `public/data/generators/manifest.json` is present here. If an invariant fails on real data, the failing expectation names the painting or wall; fix the layout rule, not the test.

- [ ] **Step 6: Commit**

```bash
git add scripts/gallery-lib.mjs scripts/gallery-inputs.mjs scripts/gallery-lib.test.mjs
git commit -m "feat: lay out the whole museum from the archived set"
```

---

### Task 4: build-gallery.mjs — atlases, gallery.json, the npm script

**Files:**
- Create: `scripts/build-gallery.mjs`
- Modify: `package.json` (scripts)
- Generate: `public/data/gallery.json`, `public/data/gallery/atlas-0.webp`, `atlas-1.webp`, `atlas-0-small.webp`, `atlas-1-small.webp`

**Interfaces:**
- Consumes: `buildGallery`, `tileRect`, `ATLAS`, `ATLAS_SMALL`, `TILES_PER_ATLAS` (Task 3); `readArchiveInputs` (Task 3); `sharp` (devDependency, present).
- Produces: the generated files the client loads.

- [ ] **Step 1: Write the script**

```js
// scripts/build-gallery.mjs
// Generate the walkable gallery: public/data/gallery.json and the thumbnail atlases.
//
// The layout is decided here, once, rather than in the browser, so it can be tested
// (scripts/gallery-lib.test.mjs) and so the client ships ~40 KB of positions instead
// of layout code plus the 17 MB catalog it would need to run it. The atlases pack
// every archived project's preview into two 4096² images — 225 tiles each — so all
// the paintings in the building draw in two calls; a half-size pair serves phones.
//
// Rerun after any change to the archived set, exactly like `npm run summary`.
//
// Usage: node scripts/build-gallery.mjs

import { mkdir, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { buildGallery, tileRect, ATLAS, ATLAS_SMALL, TILES_PER_ATLAS } from './gallery-lib.mjs'
import { readArchiveInputs } from './gallery-inputs.mjs'

const DATA = 'public/data'
const OUT_DIR = join(DATA, 'gallery')
const QUALITY = 82   // matches compress-thumbnails.mjs

/**
 * One tile, gutter included. The preview is fitted on black like the grid does
 * (`object-fit: contain` on #000), alpha flattened the same way. The gutter is the
 * tile's own edge pixels copied outward, so when the GPU samples a distant mipmap
 * it blends a painting with itself and not with its neighbour.
 */
async function tileImage(path, atlas) {
  const base = path
    ? sharp(path).resize(atlas.tile, atlas.tile, { fit: 'contain', background: '#000' }).flatten({ background: '#000' })
    : sharp({ create: { width: atlas.tile, height: atlas.tile, channels: 3, background: '#222' } })
  return base
    .extend({ top: atlas.gutter, bottom: atlas.gutter, left: atlas.gutter, right: atlas.gutter, extendWith: 'copy' })
    .png()
    .toBuffer()
}

async function writeAtlas(file, paintings, thumbs, atlas) {
  const composites = []
  for (const p of paintings) {
    const r = tileRect(p.tile, atlas)
    composites.push({
      input: await tileImage(thumbs[p.project] ?? null, atlas),
      left: r.x - atlas.gutter,
      top: r.y - atlas.gutter,
    })
  }
  await sharp({ create: { width: atlas.size, height: atlas.size, channels: 3, background: '#000' } })
    .composite(composites)
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(file)
  return (await stat(file)).size
}

async function main() {
  const { tokens, collaborations, thumbs } = await readArchiveInputs(DATA)
  const gallery = buildGallery({ tokens, collaborations, generatedAt: new Date().toISOString() })

  for (const p of gallery.paintings) {
    if (!thumbs[p.project]) console.warn(`no thumbnail for ${p.project} (${p.name}); hanging a blank tile`)
  }

  await mkdir(OUT_DIR, { recursive: true })
  let bytes = 0
  for (let f = 0; f < gallery.atlas.files.length; f++) {
    const mine = gallery.paintings.filter((p) => Math.floor(p.tile / TILES_PER_ATLAS) === f)
    const large = join(DATA, gallery.atlas.files[f])
    const small = join(DATA, gallery.atlas.small[f])
    bytes += await writeAtlas(large, mine, thumbs, ATLAS)
    bytes += await writeAtlas(small, mine, thumbs, ATLAS_SMALL)
    console.log(`${large}: ${mine.length} tiles`)
  }

  const json = JSON.stringify(gallery)
  await writeFile(join(DATA, 'gallery.json'), json)
  bytes += Buffer.byteLength(json)

  const halls = gallery.rooms.filter((r) => r.kind === 'hall')
  console.log(
    `${gallery.counts.paintings} paintings, ${gallery.counts.soloRooms} solo rooms, ` +
      `${halls.length} halls (longest ${Math.max(...halls.map((h) => h.rect.d))} m), ` +
      `${gallery.walls.length} wall segments, ${gallery.signs.length} signs`,
  )
  console.log(`wrote ${(bytes / 1048576).toFixed(1)} MiB: ${DATA}/gallery.json + ${OUT_DIR}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Add the npm script**

In `package.json`, after `"summary"`:

```json
    "gallery": "node scripts/build-gallery.mjs",
```

- [ ] **Step 3: Run it**

Run: `npm run gallery`
Expected output, roughly:

```
public/data/gallery/atlas-0.webp: 225 tiles
public/data/gallery/atlas-1.webp: 195 tiles
420 paintings, 19 solo rooms, 7 halls (longest 102 m), ~300 wall segments, ~470 signs
wrote 6–9 MiB: public/data/gallery.json + public/data/gallery/
```

Then check the output by eye:

```bash
ls -la public/data/gallery/
node -e "const g=require('./public/data/gallery.json');console.log(g.counts, g.rooms.length, g.paintings[0])"
```

Open `public/data/gallery/atlas-0.webp` in an image viewer: a 15 × 15 grid of previews, black-letterboxed, no smearing between tiles. Open `atlas-0-small.webp`: the same grid at half size.

- [ ] **Step 4: Run the whole test suite**

Run: `npm test`
Expected: PASS (the gallery tests plus everything that already passed).

- [ ] **Step 5: Commit the script and the generated data, with the real size in the message**

```bash
git add scripts/build-gallery.mjs package.json public/data/gallery.json public/data/gallery/
git commit -m "feat: bake the museum and its atlases into the data (X.X MiB)"
```

Replace `X.X` with the figure the script printed.

---
### Task 5: Client types, constants, `?project`/`?room` parsing, `loadGallery`

**Files:**
- Create: `src/gallery/types.ts`, `src/gallery/constants.ts`, `src/gallery/query.ts`
- Modify: `src/lib/data.ts` (append one export)
- Test: `src/gallery/query.test.ts`, `src/lib/data.test.ts` (append)

**Interfaces:**
- Produces: the `Gallery` interfaces (exact JSON shape from Task 3); constants `PAINTING 1.2`, `EYE_Y 1.6`, `WALL_T 0.3`, `WALL_H 4`, `FOV 70`, `WALK_SPEED 3`, `RUN_SPEED 5`, `PLAYER_RADIUS 0.4`, `FILL 0.75`, `GLIDE_MS 600`, `CAPTION_RANGE 6`; `parseGalleryQuery(search: string): { project?: number; room?: string }`; `loadGallery(): Promise<Gallery>`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/gallery/query.test.ts
import { test, expect } from 'vitest'
import { parseGalleryQuery } from './query'

test('reads a project id', () => {
  expect(parseGalleryQuery('?project=2969')).toEqual({ project: 2969 })
})

test('reads a room id, which may be an era or a tz address', () => {
  expect(parseGalleryQuery('?room=2022-q2')).toEqual({ room: '2022-q2' })
  expect(parseGalleryQuery('?room=tz1abc')).toEqual({ room: 'tz1abc' })
})

test('ignores garbage and empties rather than throwing', () => {
  expect(parseGalleryQuery('')).toEqual({})
  expect(parseGalleryQuery('?project=abc')).toEqual({})
  expect(parseGalleryQuery('?project=')).toEqual({})
  expect(parseGalleryQuery('?room=')).toEqual({})
  expect(parseGalleryQuery('?project=12&room=x')).toEqual({ project: 12, room: 'x' })
})
```

```ts
// append to src/lib/data.test.ts — add to `routes`:
  'gallery.json': { generatedAt: 'T', counts: { paintings: 1 }, rooms: [], walls: [], paintings: [], signs: [] },
// and a test:
test('loadGallery fetches the baked museum', async () => {
  const { loadGallery } = await import('./data')
  expect((await loadGallery()).counts.paintings).toBe(1)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/query.test.ts src/lib/data.test.ts`
Expected: FAIL — cannot resolve `./query`; `loadGallery is not a function`.

- [ ] **Step 3: Write the types, constants, parser, and loader**

```ts
// src/gallery/types.ts
// The shape of public/data/gallery.json, written by scripts/build-gallery.mjs.
// Metres, y up. A `yaw` names the direction (sin yaw, 0, cos yaw): a painting's or
// sign's normal into its room, or a pose's facing.

export interface Pose { x: number; z: number; yaw: number }
export interface FloorRect { x: number; z: number; w: number; d: number }

export interface Room {
  id: string                         // era id, artist tz address, or 'lobby'
  kind: 'lobby' | 'hall' | 'solo'
  title: string
  rect: FloorRect
  /** Just inside the door, facing in — where the Rooms menu lands you. */
  entry: Pose
}

/** A solid wall segment. Lintels over doors have y0 > 0 and block nobody. */
export interface Wall { x1: number; z1: number; x2: number; z2: number; y0: number; y1: number }

export interface Painting {
  project: number
  slug: string
  name: string
  artist: string
  year: number
  room: string
  x: number
  z: number
  yaw: number
  /** Index into the atlas sequence; see tileUv in geometry.ts. */
  tile: number
}

export interface Sign {
  text: string
  kind: 'title' | 'era' | 'room' | 'plaque'
  x: number; y: number; z: number; yaw: number
  w: number; h: number
}

export interface AtlasMeta {
  size: number; tile: number; gutter: number; cols: number
  files: string[]    // relative to data/
  small: string[]    // same layout at half scale, for phones
}

export interface Gallery {
  generatedAt: string
  counts: { paintings: number; artists: number; soloRooms: number; years: [number, number] }
  atlas: AtlasMeta
  spawn: Pose
  rooms: Room[]
  walls: Wall[]
  paintings: Painting[]
  signs: Sign[]
}
```

```ts
// src/gallery/constants.ts
// The few numbers the client needs from the build's geometry (mirrors
// scripts/gallery-lib.mjs), plus the ones that are the client's own.

export const PAINTING = 1.2
export const EYE_Y = 1.6
export const WALL_T = 0.3
export const WALL_H = 4

export const FOV = 70
export const WALK_SPEED = 3
export const RUN_SPEED = 5
export const PLAYER_RADIUS = 0.4
/** At the viewing pose the painting fills this much of the viewport's shorter side. */
export const FILL = 0.75
export const GLIDE_MS = 600
/** Farthest a painting can be and still get a crosshair caption, metres. */
export const CAPTION_RANGE = 6
```

```ts
// src/gallery/query.ts
export interface GalleryQuery { project?: number; room?: string }

/**
 * `#/gallery?project=2969` or `#/gallery?room=tz1…`. Anything unrecognised is
 * simply absent: a stale link lands in the lobby, never on an error.
 */
export function parseGalleryQuery(search: string): GalleryQuery {
  const params = new URLSearchParams(search)
  const out: GalleryQuery = {}
  const project = params.get('project')
  if (project && /^\d+$/.test(project)) out.project = Number(project)
  const room = params.get('room')
  if (room) out.room = room
  return out
}
```

```ts
// append to src/lib/data.ts (add `import type { Gallery } from '../gallery/types'` at the top)

/**
 * The museum: rooms, walls, and every archived painting's place and atlas tile.
 * Built by scripts/build-gallery.mjs, so rerun `npm run gallery` after any archive
 * change or the building goes stale.
 */
export const loadGallery = () => getJson<Gallery>('gallery.json')
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/query.test.ts src/lib/data.test.ts && npm run typecheck`
Expected: PASS, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/types.ts src/gallery/constants.ts src/gallery/query.ts src/gallery/query.test.ts src/lib/data.ts src/lib/data.test.ts
git commit -m "feat: teach the viewer the shape of the museum and how to find a room in it"
```

---

### Task 6: Collision

**Files:**
- Create: `src/gallery/collide.ts`
- Test: `src/gallery/collide.test.ts`

**Interfaces:**
- Consumes: `Wall` (Task 5), `PLAYER_RADIUS`, `WALL_T`.
- Produces: `Point = { x, z }`; `COLLISION_RADIUS`; `solidWalls(walls): Wall[]`; `pushOut(p, wall, r): Point`; `resolve(p, walls, r?): Point`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/gallery/collide.test.ts
import { test, expect } from 'vitest'
import { pushOut, resolve, solidWalls, COLLISION_RADIUS } from './collide'
import type { Wall } from './types'

const wall = (x1: number, z1: number, x2: number, z2: number, y0 = 0): Wall => ({ x1, z1, x2, z2, y0, y1: 4 })
const alongX = wall(0, 0, 10, 0)   // a wall on z = 0 from x 0..10
const alongZ = wall(0, 0, 0, 10)   // a wall on x = 0 from z 0..10

test('a point clear of the wall is untouched', () => {
  expect(pushOut({ x: 5, z: 2 }, alongX, COLLISION_RADIUS)).toEqual({ x: 5, z: 2 })
})

test('walking into a wall slides along it', () => {
  const p = pushOut({ x: 5, z: 0.3 }, alongX, COLLISION_RADIUS)
  expect(p.x).toBe(5)
  expect(p.z).toBeCloseTo(COLLISION_RADIUS, 9)
})

test('the push is to the side the player is on', () => {
  const p = pushOut({ x: 5, z: -0.3 }, alongX, COLLISION_RADIUS)
  expect(p.z).toBeCloseTo(-COLLISION_RADIUS, 9)
})

test('the wall does not extend past its ends', () => {
  expect(pushOut({ x: 11, z: 0.3 }, alongX, COLLISION_RADIUS)).toEqual({ x: 11, z: 0.3 })
})

test('a corner resolves against both walls', () => {
  const p = resolve({ x: 0.3, z: 0.3 }, [alongX, alongZ])
  expect(p.x).toBeCloseTo(COLLISION_RADIUS, 6)
  expect(p.z).toBeCloseTo(COLLISION_RADIUS, 6)
})

test('lintels over doors are not walls', () => {
  expect(solidWalls([alongX, wall(0, 5, 2, 5, 3)])).toEqual([alongX])
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/collide.test.ts`
Expected: FAIL — cannot resolve `./collide`.

- [ ] **Step 3: Write the implementation**

```ts
// src/gallery/collide.ts
// The player is a circle on the floor plan; walls are the segments from
// gallery.json, drawn WALL_T thick. A few hundred segments is nothing to test
// every frame, so there is no spatial index — and no physics library for what is
// one nearest-point formula.

import type { Wall } from './types'
import { PLAYER_RADIUS, WALL_T } from './constants'

export interface Point { x: number; z: number }

/** The wall's half-thickness is part of the distance: the segment is its centre line. */
export const COLLISION_RADIUS = PLAYER_RADIUS + WALL_T / 2

/** Only a wall that reaches the floor blocks anyone; lintels over doors have y0 > 0. */
export const solidWalls = (walls: Wall[]) => walls.filter((w) => w.y0 === 0)

/** Move `p` out of `w` along the shortest way, or return it untouched. */
export function pushOut(p: Point, w: Wall, r: number): Point {
  const dx = w.x2 - w.x1
  const dz = w.z2 - w.z1
  const len2 = dx * dx + dz * dz
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - w.x1) * dx + (p.z - w.z1) * dz) / len2))
  const cx = w.x1 + t * dx
  const cz = w.z1 + t * dz
  const nx = p.x - cx
  const nz = p.z - cz
  const d = Math.hypot(nx, nz)
  if (d >= r) return p
  if (d === 0) {
    // Dead centre on the line: push perpendicular to it, arbitrarily to one side.
    const l = Math.hypot(dz, dx) || 1
    return { x: p.x - (dz / l) * r, z: p.z + (dx / l) * r }
  }
  const k = (r - d) / d
  return { x: p.x + nx * k, z: p.z + nz * k }
}

/** Two passes so a corner, where one push undoes another, settles. */
export function resolve(p: Point, walls: Wall[], r = COLLISION_RADIUS): Point {
  let q = p
  for (let pass = 0; pass < 2; pass++) for (const w of walls) q = pushOut(q, w, r)
  return q
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/gallery/collide.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/collide.ts src/gallery/collide.test.ts
git commit -m "feat: keep the visitor on the right side of the walls"
```

---

### Task 7: three.js, the viewing pose, and the projected rectangle

**Files:**
- Modify: `package.json` (dependencies)
- Create: `src/gallery/approach.ts`
- Test: `src/gallery/approach.test.ts`

**Interfaces:**
- Consumes: `Painting`, `Pose` (Task 5); `PAINTING`, `EYE_Y`, `FILL`, `FOV`.
- Produces: `ScreenRect = { left, top, width, height }`; `viewingDistance(fovDeg, aspect, fill?)`; `viewingPose(p, fovDeg, aspect): Pose`; `standingPose(p, distance?): Pose`; `applyPose(camera, pose, pitch?)`; `projectedRect(camera, p, width, height): ScreenRect`; `easeInOut(t)`; `lerpAngle(a, b, t)`; `lerpPose(a, b, t): Pose`.

- [ ] **Step 1: Install three**

```bash
npm install three@^0.185
npm install -D @types/three@^0.185
```

`three` is a runtime dependency (it ships in the gallery chunk); the types are dev-only.

- [ ] **Step 2: Write the failing tests**

```ts
// src/gallery/approach.test.ts
import { test, expect } from 'vitest'
import { PerspectiveCamera } from 'three'
import {
  viewingDistance, viewingPose, standingPose, applyPose, projectedRect, easeInOut, lerpAngle, lerpPose,
} from './approach'
import { FOV, FILL, PAINTING } from './constants'
import type { Painting } from './types'

// On the west wall of a hall, facing +x.
const painting: Painting = {
  project: 1, slug: 'p', name: 'P', artist: 'A', year: 2022, room: '2022-q1',
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 0,
}

test('landscape: the painting fills FILL of the height', () => {
  const d = viewingDistance(FOV, 16 / 9)
  expect(d).toBeCloseTo(PAINTING / (2 * FILL * Math.tan((FOV * Math.PI) / 360)), 9)
  expect(d).toBeCloseTo(1.1425, 3)
})

test('portrait: the painting fills FILL of the width, so the camera stands further back', () => {
  expect(viewingDistance(FOV, 0.5)).toBeCloseTo(viewingDistance(FOV, 16 / 9) / 0.5, 9)
})

test('the viewing pose is on the normal, facing back at the painting', () => {
  const pose = viewingPose(painting, FOV, 16 / 9)
  expect(pose.x).toBeCloseTo(-3.98 + viewingDistance(FOV, 16 / 9), 9)
  expect(pose.z).toBeCloseTo(20, 9)
  expect(pose.yaw).toBeCloseTo(painting.yaw + Math.PI, 9)
  expect(standingPose(painting)).toEqual({ x: -3.98 + 3, z: 20, yaw: painting.yaw + Math.PI })
})

test('at the viewing pose the painting projects to a centred square of FILL × the short side', () => {
  const width = 1600, height = 900
  const camera = new PerspectiveCamera(FOV, width / height, 0.1, 200)
  applyPose(camera, viewingPose(painting, FOV, width / height))
  const r = projectedRect(camera, painting, width, height)
  expect(r.height).toBeCloseTo(FILL * height, 0)
  expect(r.width).toBeCloseTo(r.height, 0)
  expect(r.left + r.width / 2).toBeCloseTo(width / 2, 0)
  expect(r.top + r.height / 2).toBeCloseTo(height / 2, 0)
})

test('easing and angle interpolation', () => {
  expect(easeInOut(0)).toBe(0)
  expect(easeInOut(1)).toBe(1)
  expect(easeInOut(0.5)).toBeCloseTo(0.5, 9)
  // Shortest way round: from just above 0 to just below 2π goes through 0, not π.
  expect(Math.sin(lerpAngle(0.1, 2 * Math.PI - 0.1, 0.5))).toBeCloseTo(0, 9)
  expect(lerpPose({ x: 0, z: 0, yaw: 0 }, { x: 2, z: 4, yaw: 1 }, 0.5)).toEqual({ x: 1, z: 2, yaw: 0.5 })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/approach.test.ts`
Expected: FAIL — cannot resolve `./approach`.

- [ ] **Step 4: Write the implementation**

```ts
// src/gallery/approach.ts
// Standing in front of a painting, and where it lands on the screen.
//
// When the camera is on a painting's normal, level, looking straight at it, the
// painting is a rectangle parallel to the image plane — so its projection is an
// axis-aligned rectangle in CSS pixels, and a plain DOM element can be laid over
// it exactly. That is what lets the sandboxed piece run "on the wall" with no
// CSS3D compositing: the camera is steered to the one pose where a 2-D overlay is
// correct, and the overlay is PieceFrame, unchanged.

import { PerspectiveCamera, Vector3 } from 'three'
import type { Painting, Pose } from './types'
import { PAINTING, EYE_Y, FILL } from './constants'

export interface ScreenRect { left: number; top: number; width: number; height: number }

/**
 * How far back to stand so the painting fills `fill` of the viewport's shorter
 * side. The fov is vertical; in portrait the width is the tighter constraint, and
 * the horizontal half-angle's tangent is the vertical one times the aspect.
 */
export function viewingDistance(fovDeg: number, aspect: number, fill = FILL): number {
  const halfTan = Math.tan((fovDeg * Math.PI) / 360)
  return PAINTING / (2 * fill * halfTan * Math.min(1, aspect))
}

/** On the painting's normal at the viewing distance, facing it. */
export function viewingPose(p: Painting, fovDeg: number, aspect: number): Pose {
  const d = viewingDistance(fovDeg, aspect)
  return { x: p.x + Math.sin(p.yaw) * d, z: p.z + Math.cos(p.yaw) * d, yaw: p.yaw + Math.PI }
}

/** A comfortable distance back — where a `?project=` link puts you. */
export function standingPose(p: Painting, distance = 3): Pose {
  return { x: p.x + Math.sin(p.yaw) * distance, z: p.z + Math.cos(p.yaw) * distance, yaw: p.yaw + Math.PI }
}

/**
 * Put the camera at a pose. The convention for the whole gallery: a pose faces
 * (sin yaw, 0, cos yaw); a three.js camera faces (-sin r, 0, -cos r) for
 * rotation.y = r; so r = yaw + π. Yaw then pitch, so looking up never rolls.
 */
export function applyPose(camera: PerspectiveCamera, pose: Pose, pitch = 0): void {
  camera.position.set(pose.x, EYE_Y, pose.z)
  camera.rotation.set(pitch, pose.yaw + Math.PI, 0, 'YXZ')
  camera.updateMatrixWorld()
}

/** The painting's right-hand direction as a visitor facing it sees it. */
export const paintingRight = (p: Painting) => new Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw))

/**
 * The bounding box of the painting's four corners on screen, in CSS pixels.
 * Exact at the viewing pose; merely a bounding box anywhere else.
 */
export function projectedRect(camera: PerspectiveCamera, p: Painting, width: number, height: number): ScreenRect {
  const right = paintingRight(p)
  const half = PAINTING / 2
  const xs: number[] = []
  const ys: number[] = []
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const v = new Vector3(p.x, EYE_Y + sy * half, p.z).addScaledVector(right, sx * half).project(camera)
    xs.push(((v.x + 1) / 2) * width)
    ys.push(((1 - v.y) / 2) * height)
  }
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/** From a to b the short way round. */
export function lerpAngle(a: number, b: number, t: number): number {
  const twoPi = 2 * Math.PI
  const d = ((((b - a + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI
  return a + d * t
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, yaw: lerpAngle(a.yaw, b.yaw, t) }
}
```

- [ ] **Step 5: Run the tests and typecheck**

Run: `npx vitest run src/gallery/approach.test.ts && npm run typecheck`
Expected: PASS, 5 tests; no type errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/gallery/approach.ts src/gallery/approach.test.ts
git commit -m "feat: work out where to stand so a painting lines up with the screen"
```

---

### Task 8: Geometry — quads, boxes, and tile UVs

**Files:**
- Create: `src/gallery/geometry.ts`
- Test: `src/gallery/geometry.test.ts`

**Interfaces:**
- Consumes: `Painting`, `Wall`, `Room`, `Sign`, `AtlasMeta` (Task 5); `PAINTING`, `EYE_Y`, `WALL_T`, `WALL_H`.
- Produces: `TileUv = { u0, u1, v0, v1 }`; `tileUv(tile, atlas): TileUv`; `atlasFile(tile, atlas): number`; `class MeshArrays { quad(...); box(...); build(): BufferGeometry }`; `buildPaintingGeometry(paintings, atlas, file): BufferGeometry`; `buildFrameGeometry(paintings)`; `buildWallGeometry(walls)`; `buildFloorGeometry(rooms)`; `buildSignGeometry(signs, uvs: TileUv[])`. Every geometry is non-indexed with `position`, `normal`, `uv` attributes; a quad is 6 vertices.

- [ ] **Step 1: Write the failing tests**

```ts
// src/gallery/geometry.test.ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/geometry.test.ts`
Expected: FAIL — cannot resolve `./geometry`.

- [ ] **Step 3: Write the implementation**

```ts
// src/gallery/geometry.ts
// Turns gallery.json into vertex buffers. Everything is merged by hand into flat
// arrays — a quad is six vertices — so the whole building is a handful of draw
// calls and nothing from three/examples is needed.

import { BufferGeometry, Float32BufferAttribute } from 'three'
import type { AtlasMeta, Painting, Room, Sign, Wall } from './types'
import { PAINTING, EYE_Y, WALL_T, WALL_H } from './constants'

export interface TileUv { u0: number; u1: number; v0: number; v1: number }
const FULL: TileUv = { u0: 0, u1: 1, v0: 0, v1: 1 }

type Vec = [number, number, number]

/**
 * Where a tile's image sits in its atlas, as texture coordinates. Textures load
 * with flipY, so the image's top row is v = 1 — `v1` is the top edge. The gutter
 * is excluded: it exists for the sampler, not for the quad.
 */
export function tileUv(tile: number, atlas: AtlasMeta): TileUv {
  const perFile = atlas.cols * atlas.cols
  const i = tile % perFile
  const col = i % atlas.cols
  const row = Math.floor(i / atlas.cols)
  const cell = atlas.tile + 2 * atlas.gutter
  const u0 = (col * cell + atlas.gutter) / atlas.size
  const top = (row * cell + atlas.gutter) / atlas.size
  const span = atlas.tile / atlas.size
  return { u0, u1: u0 + span, v0: 1 - top - span, v1: 1 - top }
}

export const atlasFile = (tile: number, atlas: AtlasMeta) => Math.floor(tile / (atlas.cols * atlas.cols))

/** A painting's normal, into the room. */
const normalOf = (p: { yaw: number }): Vec => [Math.sin(p.yaw), 0, Math.cos(p.yaw)]
/** A painting's right as a visitor facing it sees it. */
const rightOf = (p: { yaw: number }): Vec => [Math.cos(p.yaw), 0, -Math.sin(p.yaw)]
const scale = (v: Vec, k: number): Vec => [v[0] * k, v[1] * k, v[2] * k]

export class MeshArrays {
  private positions: number[] = []
  private normals: number[] = []
  private uvs: number[] = []

  /**
   * A quad from its centre and half-extent vectors, facing `normal`. Corners wind
   * counter-clockwise as seen from the front, which is what three.js culls by.
   */
  quad(c: Vec, right: Vec, up: Vec, normal: Vec, uv: TileUv = FULL): void {
    const at = (sx: number, sy: number): Vec => [
      c[0] + right[0] * sx + up[0] * sy,
      c[1] + right[1] * sx + up[1] * sy,
      c[2] + right[2] * sx + up[2] * sy,
    ]
    const bl = at(-1, -1), br = at(1, -1), tr = at(1, 1), tl = at(-1, 1)
    const verts: Array<[Vec, number, number]> = [
      [bl, uv.u0, uv.v0], [br, uv.u1, uv.v0], [tr, uv.u1, uv.v1],
      [bl, uv.u0, uv.v0], [tr, uv.u1, uv.v1], [tl, uv.u0, uv.v1],
    ]
    for (const [v, u, w] of verts) {
      this.positions.push(...v)
      this.normals.push(...normal)
      this.uvs.push(u, w)
    }
  }

  /** An axis-aligned box from its centre and half-extents. */
  box(cx: number, cy: number, cz: number, hx: number, hy: number, hz: number): void {
    this.quad([cx + hx, cy, cz], [0, 0, -hz], [0, hy, 0], [1, 0, 0])
    this.quad([cx - hx, cy, cz], [0, 0, hz], [0, hy, 0], [-1, 0, 0])
    this.quad([cx, cy, cz + hz], [hx, 0, 0], [0, hy, 0], [0, 0, 1])
    this.quad([cx, cy, cz - hz], [-hx, 0, 0], [0, hy, 0], [0, 0, -1])
    this.quad([cx, cy + hy, cz], [hx, 0, 0], [0, 0, -hz], [0, 1, 0])
    this.quad([cx, cy - hy, cz], [hx, 0, 0], [0, 0, hz], [0, -1, 0])
  }

  build(): BufferGeometry {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(this.positions, 3))
    g.setAttribute('normal', new Float32BufferAttribute(this.normals, 3))
    g.setAttribute('uv', new Float32BufferAttribute(this.uvs, 2))
    return g
  }
}

/** One quad per painting whose tile lives in atlas `file`, UV-mapped into its tile. */
export function buildPaintingGeometry(paintings: Painting[], atlas: AtlasMeta, file: number): BufferGeometry {
  const m = new MeshArrays()
  for (const p of paintings) {
    if (atlasFile(p.tile, atlas) !== file) continue
    m.quad([p.x, EYE_Y, p.z], scale(rightOf(p), PAINTING / 2), [0, PAINTING / 2, 0], normalOf(p), tileUv(p.tile, atlas))
  }
  return m.build()
}

/** A dark quad 0.06 proud of the painting on every side, halfway between it and the wall. */
export function buildFrameGeometry(paintings: Painting[]): BufferGeometry {
  const m = new MeshArrays()
  const half = PAINTING / 2 + 0.06
  for (const p of paintings) {
    const n = normalOf(p)
    m.quad([p.x - n[0] * 0.01, EYE_Y, p.z - n[2] * 0.01], scale(rightOf(p), half), [0, half, 0], n)
  }
  return m.build()
}

/**
 * Every segment as a box WALL_T thick, lengthened by half a thickness at each end
 * so two walls meeting at a corner close it instead of leaving a notch.
 */
export function buildWallGeometry(walls: Wall[]): BufferGeometry {
  const m = new MeshArrays()
  for (const w of walls) {
    m.box(
      (w.x1 + w.x2) / 2, (w.y0 + w.y1) / 2, (w.z1 + w.z2) / 2,
      Math.abs(w.x2 - w.x1) / 2 + WALL_T / 2, (w.y1 - w.y0) / 2, Math.abs(w.z2 - w.z1) / 2 + WALL_T / 2,
    )
  }
  return m.build()
}

/** A floor at y = 0 facing up and a ceiling at WALL_H facing down, per room. */
export function buildFloorGeometry(rooms: Room[]): BufferGeometry {
  const m = new MeshArrays()
  for (const { rect } of rooms) {
    const cx = rect.x + rect.w / 2
    const cz = rect.z + rect.d / 2
    m.quad([cx, 0, cz], [rect.w / 2, 0, 0], [0, 0, -rect.d / 2], [0, 1, 0])
    m.quad([cx, WALL_H, cz], [rect.w / 2, 0, 0], [0, 0, rect.d / 2], [0, -1, 0])
  }
  return m.build()
}

/** Signs as quads of their own size; `uvs[i]` is where sign `i` was drawn in the label atlas. */
export function buildSignGeometry(signs: Sign[], uvs: TileUv[]): BufferGeometry {
  const m = new MeshArrays()
  signs.forEach((s, i) => {
    m.quad([s.x, s.y, s.z], scale(rightOf(s), s.w / 2), [0, s.h / 2, 0], normalOf(s), uvs[i])
  })
  return m.build()
}
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/geometry.test.ts && npm run typecheck`
Expected: PASS, 7 tests; no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/geometry.ts src/gallery/geometry.test.ts
git commit -m "feat: turn the museum's plan into walls, floors and hung canvases"
```

---
### Task 9: Labels — packing and rasterising the signs

**Files:**
- Create: `src/gallery/labels.ts`
- Test: `src/gallery/labels.test.ts`

**Interfaces:**
- Consumes: `Sign` (Task 5), `TileUv` (Task 8).
- Produces: `PixelRect = { x, y, w, h }`; `packLabels(signs, size): { rects: PixelRect[]; uvs: TileUv[]; pxPerM: number }`; `drawLabels(signs, rects, size): HTMLCanvasElement | null`; `makeLabelTexture(signs, size): { texture: CanvasTexture; uvs: TileUv[] } | null`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/gallery/labels.test.ts
import { test, expect } from 'vitest'
import { packLabels } from './labels'
import type { Sign } from './types'

const sign = (kind: Sign['kind'], w: number, h: number, i: number): Sign =>
  ({ text: `${kind} ${i}`, kind, x: 0, y: 1, z: 0, yaw: 0, w, h })

/** Roughly the real mix: 420 plaques, 38 room signs, 7 era signs, 2 title lines. */
const realistic = [
  ...Array.from({ length: 2 }, (_, i) => sign('title', 3, i ? 0.25 : 0.5, i)),
  ...Array.from({ length: 7 }, (_, i) => sign('era', 1.8, 0.5, i)),
  ...Array.from({ length: 38 }, (_, i) => sign('room', 2.4, 0.4, i)),
  ...Array.from({ length: 420 }, (_, i) => sign('plaque', 0.5, 0.12, i)),
]

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

test('every sign gets a rect inside the atlas, none overlapping, in input order', () => {
  for (const size of [4096, 2048]) {
    const { rects, uvs } = packLabels(realistic, size)
    expect(rects.length).toBe(realistic.length)
    rects.forEach((r, i) => {
      expect(r.x).toBeGreaterThanOrEqual(0)
      expect(r.y).toBeGreaterThanOrEqual(0)
      expect(r.x + r.w).toBeLessThanOrEqual(size)
      expect(r.y + r.h).toBeLessThanOrEqual(size)
      // aspect preserved: a 0.5 × 0.12 plaque is a 25:6 rect
      expect(r.w / r.h).toBeCloseTo(realistic[i].w / realistic[i].h, 1)
    })
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) expect(overlaps(rects[i], rects[j])).toBe(false)
    // uvs address the same pixels, top row at v = 1
    expect(uvs[0]).toEqual({
      u0: rects[0].x / size, u1: (rects[0].x + rects[0].w) / size,
      v1: 1 - rects[0].y / size, v0: 1 - (rects[0].y + rects[0].h) / size,
    })
  }
})

test('a plaque is drawn with enough pixels to read', () => {
  const { rects } = packLabels(realistic, 4096)
  const plaque = rects[realistic.findIndex((s) => s.kind === 'plaque')]
  expect(plaque.h).toBeGreaterThanOrEqual(32)
})

test('an impossible load shrinks rather than overflowing', () => {
  const many = Array.from({ length: 5000 }, (_, i) => sign('plaque', 0.5, 0.12, i))
  const { rects, pxPerM } = packLabels(many, 2048)
  expect(rects.length).toBe(5000)
  for (const r of rects) expect(r.y + r.h).toBeLessThanOrEqual(2048)
  expect(pxPerM).toBeLessThan(200)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/labels.test.ts`
Expected: FAIL — cannot resolve `./labels`.

- [ ] **Step 3: Write the implementation**

```ts
// src/gallery/labels.ts
// The signs — lobby title, era names, room names, and a plaque under every
// painting — are text, and text on a wall is a texture. There are about 470
// strings, so they are drawn once into one canvas at load and the signs become
// one quad mesh with UVs into it, the same trick as the painting atlases but
// built in the browser because the text is in the JSON and a font is here.

import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Sign } from './types'
import type { TileUv } from './geometry'

export interface PixelRect { x: number; y: number; w: number; h: number }

/** Pixels per metre of sign height at a 4096 atlas: a 0.12 m plaque is 48 px tall. */
const BASE_PX_PER_M = 400
const PAD = 2

/**
 * Shelf-pack the signs, tallest first, at the largest scale that fits. Rects
 * come back in the signs' own order. If even the first attempt would overflow —
 * it cannot with the real archive, but a future one is not this one — the scale
 * drops by a fifth and it tries again, so the worst outcome is smaller text.
 */
export function packLabels(signs: Sign[], size: number): { rects: PixelRect[]; uvs: TileUv[]; pxPerM: number } {
  let pxPerM = (BASE_PX_PER_M * size) / 4096
  for (;;) {
    const rects = shelfPack(signs, size, pxPerM)
    if (rects) {
      const uvs = rects.map((r) => ({
        u0: r.x / size, u1: (r.x + r.w) / size, v1: 1 - r.y / size, v0: 1 - (r.y + r.h) / size,
      }))
      return { rects, uvs, pxPerM }
    }
    pxPerM *= 0.8
  }
}

function shelfPack(signs: Sign[], size: number, pxPerM: number): PixelRect[] | null {
  const order = signs.map((s, i) => i).sort((a, b) => signs[b].h - signs[a].h || a - b)
  const rects: PixelRect[] = new Array(signs.length)
  let x = 0
  let y = 0
  let shelf = 0
  for (const i of order) {
    const h = Math.ceil(signs[i].h * pxPerM)
    const w = Math.ceil(signs[i].w * pxPerM)
    if (w + PAD > size) return null
    if (x + w + PAD > size) { x = 0; y += shelf + PAD; shelf = 0 }
    if (y + h + PAD > size) return null
    rects[i] = { x, y, w, h }
    x += w + PAD
    shelf = Math.max(shelf, h)
  }
  return rects
}

/**
 * Draw the text. Returns null where there is no 2-D context (jsdom, a blocked
 * canvas) — the building then simply has no signs, which is not a failure.
 */
export function drawLabels(signs: Sign[], rects: PixelRect[], size: number): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, size, size)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#d8d8d8'
  signs.forEach((s, i) => {
    const r = rects[i]
    const weight = s.kind === 'plaque' ? 'normal' : '600'
    let px = r.h * 0.6
    ctx.font = `${weight} ${px}px system-ui, sans-serif`
    const measured = ctx.measureText(s.text).width
    const room = r.w - r.h * 0.4
    if (measured > room) {
      px *= room / measured
      ctx.font = `${weight} ${px}px system-ui, sans-serif`
    }
    ctx.fillText(s.text, r.x + r.w / 2, r.y + r.h / 2)
  })
  return canvas
}

export function makeLabelTexture(signs: Sign[], size: number): { texture: CanvasTexture; uvs: TileUv[] } | null {
  const { rects, uvs } = packLabels(signs, size)
  const canvas = drawLabels(signs, rects, size)
  if (!canvas) return null
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return { texture, uvs }
}
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/labels.test.ts && npm run typecheck`
Expected: PASS, 3 tests; no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/labels.ts src/gallery/labels.test.ts
git commit -m "feat: letter the signs and plaques into one texture"
```

---

### Task 10: Scene assembly

**Files:**
- Create: `src/gallery/scene.ts`
- Test: `src/gallery/scene.test.ts`

**Interfaces:**
- Consumes: `Gallery`, `Painting` (Task 5); the `build*Geometry` functions and `atlasFile` (Task 8); `TileUv`.
- Produces: `BuiltScene = { scene: Scene; paintingMeshes: Mesh[]; paintingIndex: Painting[][]; dispose(): void }`; `buildScene(gallery, atlasTextures: (Texture | null)[], labels: { texture: Texture; uvs: TileUv[] } | null): BuiltScene`. `paintingIndex[f][Math.floor(faceIndex / 2)]` is the painting a raycast hit on `paintingMeshes[f]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/gallery/scene.test.ts
import { test, expect } from 'vitest'
import { Mesh, MeshBasicMaterial } from 'three'
import { buildScene } from './scene'
import type { Gallery, Painting } from './types'

const painting = (tile: number): Painting => ({
  project: tile, slug: 'p', name: 'P', artist: 'A', year: 2022, room: 'h', x: -3.98, z: 20, yaw: Math.PI / 2, tile,
})
const gallery: Gallery = {
  generatedAt: 'T',
  counts: { paintings: 3, artists: 1, soloRooms: 0, years: [2022, 2022] },
  atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: ['gallery/a.webp', 'gallery/b.webp'], small: ['gallery/as.webp', 'gallery/bs.webp'] },
  spawn: { x: 0, z: 4, yaw: 0 },
  rooms: [{ id: 'h', kind: 'hall', title: 'H', rect: { x: -4, z: 0, w: 8, d: 30 }, entry: { x: 0, z: 1.5, yaw: 0 } }],
  walls: [{ x1: -4, z1: 0, x2: -4, z2: 30, y0: 0, y1: 4 }, { x1: -1, z1: 30, x2: 1, z2: 30, y0: 3, y1: 4 }],
  paintings: [painting(0), painting(1), painting(225)],
  signs: [{ text: 't', kind: 'plaque', x: 0, y: 1, z: 0, yaw: 0, w: 0.5, h: 0.12 }],
}

test('one painting mesh per atlas file, indexed so a face maps back to its painting', () => {
  const built = buildScene(gallery, [null, null], null)
  expect(built.paintingMeshes.length).toBe(2)
  expect(built.paintingIndex[0].map((p) => p.tile)).toEqual([0, 1])
  expect(built.paintingIndex[1].map((p) => p.tile)).toEqual([225])
  expect(built.paintingMeshes[0].geometry.getAttribute('position').count).toBe(12)
  expect(built.paintingMeshes[0].parent).toBe(built.scene)
  built.dispose()
})

test('a missing atlas leaves its paintings flat dark, not missing', () => {
  const built = buildScene(gallery, [null, null], null)
  const m = built.paintingMeshes[0].material as MeshBasicMaterial
  expect(m.map).toBeNull()
  expect(m.color.getHex()).toBe(0x222222)
  built.dispose()
})

test('without a label texture there is no sign mesh; the rest of the building is there', () => {
  const built = buildScene(gallery, [null, null], null)
  const meshes = built.scene.children.filter((c) => c instanceof Mesh) as Mesh[]
  expect(meshes.map((m) => m.name).sort()).toEqual(['floors', 'frames', 'paintings-0', 'paintings-1', 'walls'])
  built.dispose()
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/gallery/scene.test.ts`
Expected: FAIL — cannot resolve `./scene`.

- [ ] **Step 3: Write the implementation**

```ts
// src/gallery/scene.ts
// The building as three.js objects. Dark, neutral, and unlit where the art is:
// the walls take light so the rooms read as rooms, the paintings do not, so a
// piece on the wall is the same pixels the artist's program produced.

import {
  Color, DirectionalLight, FogExp2, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  Scene, Texture,
} from 'three'
import type { Gallery, Painting } from './types'
import {
  atlasFile, buildFloorGeometry, buildFrameGeometry, buildPaintingGeometry, buildSignGeometry, buildWallGeometry,
  type TileUv,
} from './geometry'

export interface BuiltScene {
  scene: Scene
  paintingMeshes: Mesh[]
  /** paintingIndex[f][floor(faceIndex / 2)] is the painting behind a hit on paintingMeshes[f]. */
  paintingIndex: Painting[][]
  dispose(): void
}

export const BACKGROUND = 0x111111

export function buildScene(
  gallery: Gallery,
  atlasTextures: (Texture | null)[],
  labels: { texture: Texture; uvs: TileUv[] } | null,
): BuiltScene {
  const scene = new Scene()
  scene.background = new Color(BACKGROUND)
  // Exponential fog in the background colour: the long halls fade rather than end.
  scene.fog = new FogExp2(BACKGROUND, 0.022)

  const meshes: Mesh[] = []
  const add = (name: string, mesh: Mesh) => {
    mesh.name = name
    scene.add(mesh)
    meshes.push(mesh)
    return mesh
  }

  add('walls', new Mesh(buildWallGeometry(gallery.walls), new MeshLambertMaterial({ color: 0x2a2a2a })))
  add('floors', new Mesh(buildFloorGeometry(gallery.rooms), new MeshLambertMaterial({ color: 0x1a1a1a })))
  add('frames', new Mesh(buildFrameGeometry(gallery.paintings), new MeshBasicMaterial({ color: 0x0b0b0b })))

  const paintingMeshes: Mesh[] = []
  const paintingIndex: Painting[][] = []
  gallery.atlas.files.forEach((_, f) => {
    const texture = atlasTextures[f] ?? null
    // Unlit, and kept out of tone mapping: the atlas pixels go to the screen as they are.
    const material = texture
      ? new MeshBasicMaterial({ map: texture, toneMapped: false })
      : new MeshBasicMaterial({ color: 0x222222 })
    const mesh = add(`paintings-${f}`, new Mesh(buildPaintingGeometry(gallery.paintings, gallery.atlas, f), material))
    paintingMeshes.push(mesh)
    paintingIndex.push(gallery.paintings.filter((p) => atlasFile(p.tile, gallery.atlas) === f))
  })

  if (labels) {
    add('signs', new Mesh(
      buildSignGeometry(gallery.signs, labels.uvs),
      new MeshBasicMaterial({ map: labels.texture, transparent: true, depthWrite: false, toneMapped: false }),
    ))
  }

  const hemi = new HemisphereLight(0x9a9288, 0x0c0c0c, 1.4)
  const sun = new DirectionalLight(0xffffff, 0.5)
  sun.position.set(3, 10, 2)
  scene.add(hemi, sun)

  return {
    scene,
    paintingMeshes,
    paintingIndex,
    dispose() {
      for (const m of meshes) {
        m.geometry.dispose()
        ;(m.material as MeshBasicMaterial).dispose()   // textures are the loader's to dispose
      }
      scene.clear()
    },
  }
}
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/scene.test.ts && npm run typecheck`
Expected: PASS, 3 tests; no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/scene.ts src/gallery/scene.test.ts
git commit -m "feat: stand the museum up as a scene, two draw calls for all the art"
```

---

### Task 11: Movement — the pure integrator

**Files:**
- Create: `src/gallery/controls.ts`
- Test: `src/gallery/controls.test.ts`

**Interfaces:**
- Consumes: `Wall`, `Pose` (Task 5); `resolve`, `solidWalls`, `Point` (Task 6); `WALK_SPEED`, `RUN_SPEED`.
- Produces: `PlayerState = { x, z, yaw, pitch }`; `Keys = { forward, back, left, right, run }`; `emptyKeys()`; `anyMove(keys)`; `keyFor(code: string): keyof Keys | null`; `integrate(state, keys, dt, walls): PlayerState`; `look(state, dx, dy, sensitivity?): PlayerState`; `walkToward(state, target: Point, dt, walls): { state: PlayerState; arrived: boolean }`; `fromPose(pose): PlayerState`; `toPose(state): Pose`. `walls` passed in are already `solidWalls(...)`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/gallery/controls.test.ts
import { test, expect } from 'vitest'
import { integrate, look, walkToward, keyFor, emptyKeys, anyMove, fromPose, toPose } from './controls'
import { WALK_SPEED, RUN_SPEED } from './constants'
import { COLLISION_RADIUS } from './collide'
import type { Wall } from './types'

const at = (x: number, z: number, yaw = 0) => ({ x, z, yaw, pitch: 0 })
const keys = (over: Partial<ReturnType<typeof emptyKeys>>) => ({ ...emptyKeys(), ...over })

test('forward at yaw 0 walks +z at WALK_SPEED; Shift runs', () => {
  expect(integrate(at(0, 0), keys({ forward: true }), 0.5, [])).toEqual(at(0, WALK_SPEED * 0.5))
  expect(integrate(at(0, 0), keys({ forward: true, run: true }), 0.5, [])).toEqual(at(0, RUN_SPEED * 0.5))
})

test('right at yaw 0 strafes -x, and a diagonal is not faster', () => {
  const r = integrate(at(0, 0), keys({ right: true }), 1, [])
  expect(r.x).toBeCloseTo(-WALK_SPEED, 9)
  const d = integrate(at(0, 0), keys({ forward: true, right: true }), 1, [])
  expect(Math.hypot(d.x, d.z)).toBeCloseTo(WALK_SPEED, 9)
})

test('yaw turns the walk; no keys is a no-op', () => {
  const s = integrate(at(0, 0, Math.PI / 2), keys({ forward: true }), 1, [])
  expect(s.x).toBeCloseTo(WALK_SPEED, 9)
  expect(s.z).toBeCloseTo(0, 9)
  expect(integrate(at(1, 2, 3), emptyKeys(), 1, [])).toEqual(at(1, 2, 3))
})

test('a wall ahead stops the walk at the collision radius', () => {
  // Frame-sized steps, as the engine takes them (dt is capped at 50 ms there): a
  // single one-second step would be 3 m and hop clean over a 0.3 m wall.
  const wall: Wall = { x1: -4, z1: 2, x2: 4, z2: 2, y0: 0, y1: 4 }
  let s = at(0, 1)
  for (let i = 0; i < 40; i++) s = integrate(s, keys({ forward: true }), 0.05, [wall])
  expect(s.z).toBeCloseTo(2 - COLLISION_RADIUS, 9)
})

test('look turns right for mouse-right and clamps pitch', () => {
  const s = look(at(0, 0), 100, 0)
  expect(s.yaw).toBeLessThan(0)
  expect(look(at(0, 0), 0, 100000).pitch).toBeCloseTo(-85 * Math.PI / 180, 9)
  expect(look(at(0, 0), 0, -100000).pitch).toBeCloseTo(85 * Math.PI / 180, 9)
})

test('walkToward arrives, and reports blocked as arrived', () => {
  let s = at(0, 0)
  let arrived = false
  for (let i = 0; i < 100 && !arrived; i++) ({ state: s, arrived } = walkToward(s, { x: 0, z: 5 }, 0.1, []))
  expect(arrived).toBe(true)
  expect(s.z).toBeCloseTo(5, 1)
  const wall: Wall = { x1: -4, z1: 2, x2: 4, z2: 2, y0: 0, y1: 4 }
  s = at(0, 1)
  arrived = false
  for (let i = 0; i < 100 && !arrived; i++) ({ state: s, arrived } = walkToward(s, { x: 0, z: 5 }, 0.1, [wall]))
  expect(arrived).toBe(true)
  expect(s.z).toBeLessThan(2)
})

test('key mapping and pose conversion', () => {
  expect(keyFor('KeyW')).toBe('forward')
  expect(keyFor('ArrowUp')).toBe('forward')
  expect(keyFor('KeyA')).toBe('left')
  expect(keyFor('ShiftLeft')).toBe('run')
  expect(keyFor('KeyQ')).toBeNull()
  expect(anyMove(keys({ run: true }))).toBe(false)
  expect(anyMove(keys({ back: true }))).toBe(true)
  expect(toPose(fromPose({ x: 1, z: 2, yaw: 3 }))).toEqual({ x: 1, z: 2, yaw: 3 })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/controls.test.ts`
Expected: FAIL — cannot resolve `./controls`.

- [ ] **Step 3: Write the implementation**

```ts
// src/gallery/controls.ts
// How input becomes movement, with no DOM in it: the engine feeds key state and
// mouse deltas in, a new player state comes out. A pose faces (sin yaw, 0, cos yaw);
// its right-hand side is (-cos yaw, 0, sin yaw).

import type { Pose, Wall } from './types'
import { WALK_SPEED, RUN_SPEED } from './constants'
import { resolve, type Point } from './collide'

export interface PlayerState { x: number; z: number; yaw: number; pitch: number }
export interface Keys { forward: boolean; back: boolean; left: boolean; right: boolean; run: boolean }

export const emptyKeys = (): Keys => ({ forward: false, back: false, left: false, right: false, run: false })
export const anyMove = (k: Keys) => k.forward || k.back || k.left || k.right

const KEY_MAP: Record<string, keyof Keys> = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  ShiftLeft: 'run', ShiftRight: 'run',
}
export const keyFor = (code: string): keyof Keys | null => KEY_MAP[code] ?? null

export const fromPose = (p: Pose): PlayerState => ({ x: p.x, z: p.z, yaw: p.yaw, pitch: 0 })
export const toPose = (s: PlayerState): Pose => ({ x: s.x, z: s.z, yaw: s.yaw })

const PITCH_LIMIT = (85 * Math.PI) / 180

/** One frame of walking. Diagonals are normalised so nobody is faster sideways-and-forward. */
export function integrate(s: PlayerState, keys: Keys, dt: number, walls: Wall[]): PlayerState {
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw)
  const rx = -Math.cos(s.yaw), rz = Math.sin(s.yaw)
  let dx = 0, dz = 0
  if (keys.forward) { dx += fx; dz += fz }
  if (keys.back) { dx -= fx; dz -= fz }
  if (keys.right) { dx += rx; dz += rz }
  if (keys.left) { dx -= rx; dz -= rz }
  const len = Math.hypot(dx, dz)
  if (len === 0) return s
  const step = (keys.run ? RUN_SPEED : WALK_SPEED) * dt
  const p = resolve({ x: s.x + (dx / len) * step, z: s.z + (dz / len) * step }, walls)
  return { ...s, x: p.x, z: p.z }
}

/** Mouse-right turns right (yaw decreases — see the convention above); pitch clamps short of straight up. */
export function look(s: PlayerState, dx: number, dy: number, sensitivity = 0.002): PlayerState {
  return {
    ...s,
    yaw: s.yaw - dx * sensitivity,
    pitch: Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, s.pitch - dy * sensitivity)),
  }
}

/**
 * Tap-to-walk: straight at the target at walking speed. "Arrived" also covers
 * "blocked" — a wall absorbed most of the step — so a tap through a wall does not
 * leave the visitor grinding against it forever.
 */
export function walkToward(s: PlayerState, target: Point, dt: number, walls: Wall[]): { state: PlayerState; arrived: boolean } {
  const dx = target.x - s.x, dz = target.z - s.z
  const dist = Math.hypot(dx, dz)
  const step = Math.min(dist, WALK_SPEED * dt)
  if (dist < 0.1) return { state: s, arrived: true }
  const p = resolve({ x: s.x + (dx / dist) * step, z: s.z + (dz / dist) * step }, walls)
  const moved = Math.hypot(p.x - s.x, p.z - s.z)
  return { state: { ...s, x: p.x, z: p.z }, arrived: moved < step * 0.1 || dist - step < 0.1 }
}
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/controls.test.ts && npm run typecheck`
Expected: PASS, 7 tests; no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/gallery/controls.ts src/gallery/controls.test.ts
git commit -m "feat: let keys and a mouse walk the visitor through the rooms"
```

---
### Task 12: Loading the atlases, and the engine

**Files:**
- Create: `src/gallery/load.ts`, `src/gallery/engine.ts`
- Test: `src/gallery/load.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 5–11.
- Produces: `chooseSmall(maxTextureSize, screenShortSide): boolean`; `atlasUrl(file): string`; `probeCapabilities(): { maxTextureSize, maxAnisotropy }`; `loadAtlases(gallery, small, maxAnisotropy): Promise<(Texture | null)[]>`; `type Mode = 'walk' | 'glide' | 'view'`; `interface EngineEvents { onHover(p: Painting | null); onRoom(r: Room | null); onLock(locked: boolean); onMode(m: Mode); onArrive(p: Painting, rect: ScreenRect) }`; `class GalleryEngine { constructor(canvas, gallery, atlases, small, events); start(pose); approach(p); leaveView(); teleport(pose); requestLock(); resize(); dispose() }`.

`engine.ts` is the one module with no unit test: it needs a WebGL context, which jsdom cannot give it. Everything it decides — movement, collision, the viewing pose, the projected rectangle, geometry, labels — is in a tested module; the engine only wires them to the DOM and the clock. It is exercised by Task 16.

- [ ] **Step 1: Write the failing test for load.ts**

```ts
// src/gallery/load.test.ts
import { test, expect } from 'vitest'
import { chooseSmall, atlasUrl } from './load'

test('phones and small-texture GPUs get the half-size atlases', () => {
  expect(chooseSmall(4096, 1080)).toBe(false)
  expect(chooseSmall(2048, 1080)).toBe(true)
  expect(chooseSmall(4096, 390)).toBe(true)
  expect(chooseSmall(8192, 800)).toBe(false)
})

test('atlas files are addressed under data/, like every other file the site loads', () => {
  expect(atlasUrl('gallery/atlas-0.webp').endsWith('data/gallery/atlas-0.webp')).toBe(true)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/gallery/load.test.ts`
Expected: FAIL — cannot resolve `./load`.

- [ ] **Step 3: Write load.ts**

```ts
// src/gallery/load.ts
// Fetching the two thumbnail atlases, at the size this device can use.

import { LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace, Texture, TextureLoader, WebGLRenderer } from 'three'
import type { Gallery } from './types'

/**
 * A 4096² texture is the large atlas's whole point, and a phone that cannot
 * take one — or that would spend a third of its memory on two — gets the pair
 * drawn at half size, same layout, same UVs.
 */
export const chooseSmall = (maxTextureSize: number, screenShortSide: number) =>
  maxTextureSize < 4096 || screenShortSide < 800

export const atlasUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`

/** Ask a throwaway context what the GPU allows, before choosing which atlases to fetch. */
export function probeCapabilities(): { maxTextureSize: number; maxAnisotropy: number } {
  const probe = new WebGLRenderer({ canvas: document.createElement('canvas') })
  const caps = { maxTextureSize: probe.capabilities.maxTextureSize, maxAnisotropy: probe.capabilities.getMaxAnisotropy() }
  probe.dispose()
  probe.forceContextLoss()
  return caps
}

/**
 * Every atlas in parallel. One that fails resolves to null rather than rejecting
 * the lot: its paintings draw as flat dark tiles and the rest of the museum is
 * unaffected — captions, approaching and playing need no image.
 */
export function loadAtlases(gallery: Gallery, small: boolean, maxAnisotropy: number): Promise<(Texture | null)[]> {
  const loader = new TextureLoader()
  const files = small ? gallery.atlas.small : gallery.atlas.files
  return Promise.all(
    files.map(
      (file) =>
        new Promise<Texture | null>((resolve) => {
          loader.load(
            atlasUrl(file),
            (texture) => {
              texture.colorSpace = SRGBColorSpace
              texture.minFilter = LinearMipmapLinearFilter
              texture.magFilter = LinearFilter
              texture.anisotropy = maxAnisotropy
              resolve(texture)
            },
            undefined,
            () => {
              console.warn(`gallery: could not load ${file}; its paintings will be blank`)
              resolve(null)
            },
          )
        }),
    ),
  )
}
```

- [ ] **Step 4: Run the test and typecheck**

Run: `npx vitest run src/gallery/load.test.ts && npm run typecheck`
Expected: PASS, 2 tests.

- [ ] **Step 5: Write engine.ts**

```ts
// src/gallery/engine.ts
// The part that touches the DOM and the clock: a renderer on the canvas, a frame
// loop, input, raycasting, and the glide from wherever you are to square in front
// of a painting. Everything it decides comes from the tested modules it imports;
// this file only sequences them. React never reaches in — it gets events out.

import { Mesh, PerspectiveCamera, Plane, Raycaster, Texture, Vector2, Vector3, WebGLRenderer } from 'three'
import type { Gallery, Painting, Pose, Room, Wall } from './types'
import { buildScene, type BuiltScene } from './scene'
import { makeLabelTexture } from './labels'
import { solidWalls, type Point } from './collide'
import {
  emptyKeys, fromPose, integrate, keyFor, look, toPose, walkToward, type Keys, type PlayerState,
} from './controls'
import { applyPose, easeInOut, lerpPose, projectedRect, viewingPose, type ScreenRect } from './approach'
import { CAPTION_RANGE, FOV, GLIDE_MS } from './constants'

export type Mode = 'walk' | 'glide' | 'view'

export interface EngineEvents {
  onHover(p: Painting | null): void
  onRoom(room: Room | null): void
  onLock(locked: boolean): void
  onMode(mode: Mode): void
  /** Arrived at the viewing pose; `rect` is where the painting is on screen, in CSS pixels. */
  onArrive(p: Painting, rect: ScreenRect): void
}

interface Glide { from: Pose; to: Pose; fromPitch: number; start: number; painting: Painting }
interface Touch { id: number; x: number; y: number; startX: number; startY: number; start: number; moved: boolean }

const TAP_MS = 300
const TAP_PX = 10
const TOUCH_LOOK = 0.004
const FLOOR = new Plane(new Vector3(0, 1, 0), 0)

export class GalleryEngine {
  private renderer: WebGLRenderer
  private camera: PerspectiveCamera
  private built: BuiltScene
  private walls: Wall[]
  private state: PlayerState
  private keys: Keys = emptyKeys()
  private mode: Mode = 'walk'
  private glide: Glide | null = null
  private walkTarget: Point | null = null
  private viewing: Painting | null = null
  private hovered: Painting | null = null
  private room: Room | null = null
  private touch: Touch | null = null
  private raycaster = new Raycaster()
  private raf = 0
  private last = 0
  private labelTexture: Texture | null
  private cleanup: Array<() => void> = []

  constructor(
    private canvas: HTMLCanvasElement,
    private gallery: Gallery,
    private atlases: (Texture | null)[],
    small: boolean,
    private events: EngineEvents,
  ) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera = new PerspectiveCamera(FOV, 1, 0.1, 200)
    const labels = makeLabelTexture(gallery.signs, small ? 2048 : 4096)
    this.labelTexture = labels?.texture ?? null
    this.built = buildScene(gallery, atlases, labels)
    this.walls = solidWalls(gallery.walls)
    this.state = fromPose(gallery.spawn)
    this.listen()
  }

  start(pose: Pose): void {
    this.state = fromPose(pose)
    this.resize()
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Glide to the viewing pose. Pointer lock goes first: the piece needs the mouse. */
  approach(p: Painting): void {
    if (this.mode !== 'walk') return
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.walkTarget = null
    this.keys = emptyKeys()
    this.setHovered(null)
    this.glide = {
      from: toPose(this.state), to: viewingPose(p, FOV, this.camera.aspect),
      fromPitch: this.state.pitch, start: performance.now(), painting: p,
    }
    this.setMode('glide')
  }

  /** Back to walking, from where the viewing pose left the camera. Does not re-lock: that needs a gesture. */
  leaveView(): void {
    if (this.mode !== 'view') return
    this.viewing = null
    this.setMode('walk')
  }

  teleport(pose: Pose): void {
    this.viewing = null
    this.glide = null
    this.walkTarget = null
    this.state = fromPose(pose)
    this.setMode('walk')
  }

  requestLock(): void {
    this.canvas.requestPointerLock?.()
  }

  resize(): void {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (w === 0 || h === 0) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (this.mode === 'view' && this.viewing) {
      // The viewing distance depends on the aspect, so stand again and tell the overlay.
      this.state = fromPose(viewingPose(this.viewing, FOV, this.camera.aspect))
      applyPose(this.camera, toPose(this.state))
      this.events.onArrive(this.viewing, projectedRect(this.camera, this.viewing, w, h))
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.raf)
    for (const off of this.cleanup) off()
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.built.dispose()
    for (const t of this.atlases) t?.dispose()
    this.labelTexture?.dispose()
    this.renderer.dispose()
  }

  // ---- frame loop ----

  private frame = (now: number): void => {
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now

    if (this.mode === 'walk') {
      this.state = integrate(this.state, this.keys, dt, this.walls)
      if (this.walkTarget) {
        const r = walkToward(this.state, this.walkTarget, dt, this.walls)
        this.state = r.state
        if (r.arrived) this.walkTarget = null
      }
      applyPose(this.camera, toPose(this.state), this.state.pitch)
      this.setHovered(this.paintingAt(new Vector2(0, 0), CAPTION_RANGE))
    } else if (this.mode === 'glide' && this.glide) {
      const g = this.glide
      const t = easeInOut(Math.min(1, (now - g.start) / GLIDE_MS))
      applyPose(this.camera, lerpPose(g.from, g.to, t), g.fromPitch * (1 - t))
      if (t >= 1) {
        this.state = fromPose(g.to)
        this.viewing = g.painting
        this.glide = null
        this.setMode('view')
        this.events.onArrive(g.painting, projectedRect(this.camera, g.painting, this.canvas.clientWidth, this.canvas.clientHeight))
      }
    }

    this.setRoom(this.gallery.rooms.find((r) =>
      this.state.x >= r.rect.x && this.state.x <= r.rect.x + r.rect.w &&
      this.state.z >= r.rect.z && this.state.z <= r.rect.z + r.rect.d) ?? null)

    this.renderer.render(this.built.scene, this.camera)
    this.raf = requestAnimationFrame(this.frame)
  }

  // ---- picking ----

  /** The painting under a screen point (NDC), within `range` metres, or null. */
  private paintingAt(ndc: Vector2, range = Infinity): Painting | null {
    this.raycaster.setFromCamera(ndc, this.camera)
    this.raycaster.far = range
    const hit = this.raycaster.intersectObjects(this.built.paintingMeshes, false)[0]
    if (!hit || hit.faceIndex === undefined) return null
    const f = this.built.paintingMeshes.indexOf(hit.object as Mesh)
    return this.built.paintingIndex[f]?.[Math.floor(hit.faceIndex / 2)] ?? null
  }

  private floorAt(ndc: Vector2): Point | null {
    this.raycaster.setFromCamera(ndc, this.camera)
    this.raycaster.far = Infinity
    const p = new Vector3()
    return this.raycaster.ray.intersectPlane(FLOOR, p) ? { x: p.x, z: p.z } : null
  }

  private ndcOf(clientX: number, clientY: number): Vector2 {
    const r = this.canvas.getBoundingClientRect()
    return new Vector2(((clientX - r.left) / r.width) * 2 - 1, -(((clientY - r.top) / r.height) * 2 - 1))
  }

  // ---- events out, deduplicated ----

  private setHovered(p: Painting | null): void {
    if (p?.project === this.hovered?.project) return
    this.hovered = p
    this.events.onHover(p)
  }

  private setRoom(r: Room | null): void {
    if (r?.id === this.room?.id) return
    this.room = r
    this.events.onRoom(r)
  }

  private setMode(m: Mode): void {
    if (m === this.mode) return
    this.mode = m
    this.events.onMode(m)
  }

  // ---- input ----

  private get locked(): boolean {
    return document.pointerLockElement === this.canvas
  }

  private listen(): void {
    const on = <K extends keyof DocumentEventMap>(target: Document, type: K, fn: (e: DocumentEventMap[K]) => void) => {
      target.addEventListener(type, fn)
      this.cleanup.push(() => target.removeEventListener(type, fn))
    }
    const onWin = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) => {
      window.addEventListener(type, fn)
      this.cleanup.push(() => window.removeEventListener(type, fn))
    }
    const onCanvas = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      this.canvas.addEventListener(type, fn)
      this.cleanup.push(() => this.canvas.removeEventListener(type, fn))
    }

    // Mouse. Unlocked, a click only locks; locked, it approaches what the crosshair is on.
    onCanvas('click', (e) => {
      if ((e as MouseEvent & { pointerType?: string }).pointerType === 'touch') return
      if (this.mode === 'view') { this.leaveView(); this.requestLock(); return }
      if (this.mode !== 'walk') return
      if (this.locked && this.hovered) this.approach(this.hovered)
      else if (!this.locked) this.requestLock()
    })
    on(document, 'pointerlockchange', () => this.events.onLock(this.locked))
    on(document, 'mousemove', (e) => {
      if (this.locked && this.mode === 'walk') this.state = look(this.state, e.movementX, e.movementY)
    })

    // Keys. While viewing, a move key is the way out; the overlay owns arrows and Escape.
    onWin('keydown', (e) => {
      const k = keyFor(e.code)
      if (this.mode === 'view') {
        if (k && k !== 'run' && !e.code.startsWith('Arrow')) this.leaveView()
        return
      }
      if (this.mode !== 'walk') return
      if ((e.code === 'Enter' || e.code === 'KeyE') && this.hovered) { this.approach(this.hovered); return }
      if (!k) return
      this.keys[k] = true
      this.walkTarget = null
      if (e.code.startsWith('Arrow')) e.preventDefault()
    })
    onWin('keyup', (e) => {
      const k = keyFor(e.code)
      if (k) this.keys[k] = false
    })
    onWin('blur', () => { this.keys = emptyKeys() })

    // Touch: drag looks, a tap on the floor walks there, a tap on a painting approaches it.
    onCanvas('pointerdown', (e) => {
      if (e.pointerType !== 'touch' || this.touch) return
      this.touch = { id: e.pointerId, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, start: performance.now(), moved: false }
    })
    onCanvas('pointermove', (e) => {
      const t = this.touch
      if (!t || e.pointerId !== t.id) return
      if (Math.hypot(e.clientX - t.startX, e.clientY - t.startY) > TAP_PX) t.moved = true
      if (t.moved && this.mode === 'walk') this.state = look(this.state, e.clientX - t.x, e.clientY - t.y, TOUCH_LOOK)
      t.x = e.clientX
      t.y = e.clientY
    })
    const endTouch = (e: PointerEvent) => {
      const t = this.touch
      if (!t || e.pointerId !== t.id) return
      this.touch = null
      if (t.moved || performance.now() - t.start > TAP_MS) return
      if (this.mode === 'view') { this.leaveView(); return }
      if (this.mode !== 'walk') return
      const ndc = this.ndcOf(e.clientX, e.clientY)
      const p = this.paintingAt(ndc)
      if (p) { this.approach(p); return }
      this.walkTarget = this.floorAt(ndc)
    }
    onCanvas('pointerup', endTouch)
    onCanvas('pointercancel', endTouch)

    onWin('resize', () => this.resize())
  }
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors. If `probe.capabilities.getMaxAnisotropy` or `forceContextLoss` are flagged, check the installed `@types/three` — both exist on `WebGLRenderer` in 0.185.

- [ ] **Step 7: Commit**

```bash
git add src/gallery/load.ts src/gallery/load.test.ts src/gallery/engine.ts
git commit -m "feat: drive the camera, the walk and the glide from the visitor's input"
```

---

### Task 13: The piece overlay

**Files:**
- Create: `src/gallery/Viewer.tsx`
- Test: `src/gallery/Viewer.test.tsx`

**Interfaces:**
- Consumes: `PieceFrame` + `archivedSrc` (exist, `src/components/PieceFrame.tsx`); `loadSummary`, `loadIterationIds`, `loadProjectIteration` (exist, `src/lib/data.ts`); `Painting`; `ScreenRect`.
- Produces: `<Viewer painting rect onBack />`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/gallery/Viewer.test.tsx
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Viewer from './Viewer'
import * as data from '../lib/data'
import type { Painting } from './types'

const painting: Painting = {
  project: 5, slug: 'zartz', name: 'Zartz', artist: 'KilledByAPixel', year: 2021, room: 'tz1k',
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 3,
}
const rect = { left: 100, top: 50, width: 600, height: 600 }

beforeEach(() => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({ runners: [5], archived: [5] } as never)
  vi.spyOn(data, 'loadIterationIds').mockResolvedValue(['FX1-10', 'FX1-11', 'FX1-12'])
  vi.spyOn(data, 'loadProjectIteration').mockImplementation(async (_p, tokenId) => ({
    seed: tokenId === 12 ? null : `seed${tokenId}`, query: tokenId === 12 ? null : `?fxhash=seed${tokenId}`, artifact: null,
  }))
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })

const renderViewer = (onBack = vi.fn()) =>
  render(<MemoryRouter><Viewer painting={painting} rect={rect} onBack={onBack} /></MemoryRouter>)

test('runs the first minted edition from the archived runner, placed over the painting', async () => {
  renderViewer()
  const frame = await screen.findByTitle('Zartz #1 (archived copy)')
  expect(frame.getAttribute('src')).toContain('data/generators/5/_run.html?fxhash=seed10')
  const box = frame.parentElement as HTMLElement
  expect(box.style.left).toBe('100px')
  expect(box.style.width).toBe('600px')
  expect(screen.getByText(/of 3/)).toBeTruthy()
})

test('steps the edition with the buttons and the arrow keys, wrapping', async () => {
  renderViewer()
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.click(screen.getByRole('button', { name: '›' }))
  expect((await screen.findByTitle('Zartz #2 (archived copy)')).getAttribute('src')).toContain('seed11')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  // #3 was never signed: no seed, so the explanation, not a frame
  expect(await screen.findByText(/never signed/)).toBeTruthy()
})

test('the untouched toggle drops the runner; Back and Escape leave', async () => {
  const onBack = vi.fn()
  renderViewer(onBack)
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.click(screen.getByRole('button', { name: /untouched/ }))
  expect((await screen.findByTitle('Zartz #1 (archived copy)')).getAttribute('src')).toContain('/5/index.html?fxhash=seed10')
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(onBack).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { code: 'Escape' })
  expect(onBack).toHaveBeenCalledTimes(2)
})

test('links to the project page', async () => {
  renderViewer()
  await screen.findByTitle('Zartz #1 (archived copy)')
  expect(screen.getByRole('link', { name: /project page/i }).getAttribute('href')).toBe('/token/zartz')
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/Viewer.test.tsx`
Expected: FAIL — cannot resolve `./Viewer`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/gallery/Viewer.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PieceFrame, { archivedSrc } from '../components/PieceFrame'
import { loadIterationIds, loadProjectIteration, loadSummary, type LocalIteration } from '../lib/data'
import type { Painting } from './types'
import type { ScreenRect } from './approach'

interface Props {
  painting: Painting
  /** Where the painting is on screen; the frame is put exactly there. */
  rect: ScreenRect
  onBack: () => void
}

/**
 * The piece, running on the wall.
 *
 * Once the camera is square to a painting its image is an axis-aligned rectangle,
 * so the same sandboxed PieceFrame the project page uses is simply positioned over
 * it. Underneath, the painting quad stays — a heavy piece shows its preview while
 * it boots. Stepping walks the real edition: ids and seeds from this repository,
 * as on the project page, so every piece shown was minted.
 */
export default function Viewer({ painting, rect, onBack }: Props) {
  const [ids, setIds] = useState<string[] | null | undefined>(undefined)
  const [hasRunner, setHasRunner] = useState(false)
  const [index, setIndex] = useState(0)
  const [local, setLocal] = useState<LocalIteration | null | undefined>(undefined)
  const [raw, setRaw] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIds(undefined)
    setIndex(0)
    setRaw(false)
    loadSummary().then(
      (s) => { if (!cancelled) setHasRunner(s.runners.includes(painting.project)) },
      () => { if (!cancelled) setHasRunner(false) },
    )
    loadIterationIds(painting.slug, painting.project).then(
      (r) => { if (!cancelled) setIds(r) },
      () => { if (!cancelled) setIds(null) },
    )
    return () => { cancelled = true }
  }, [painting.project, painting.slug])

  const current = ids?.[index]
  const tokenId = current ? Number(current.split('-')[1]) : NaN

  useEffect(() => {
    if (!Number.isFinite(tokenId)) return
    let cancelled = false
    setLocal(undefined)
    loadProjectIteration(painting.project, tokenId).then(
      (r) => { if (!cancelled) setLocal(r) },
      () => { if (!cancelled) setLocal(null) },
    )
    return () => { cancelled = true }
  }, [painting.project, tokenId])

  const count = ids?.length ?? 0
  const step = (delta: number) => { if (count) setIndex((i) => (i + delta + count) % count) }
  const random = () => { if (count) setIndex(Math.floor(Math.random() * count)) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') step(-1)
      else if (e.code === 'ArrowRight') step(1)
      else if (e.code === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const label = `${painting.name} #${index + 1}`
  const src = local?.seed ? archivedSrc(painting.project, local.seed, local.query, hasRunner && !raw) : null
  const box = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }

  return (
    <div className="gallery-viewer">
      <div className="gallery-frame" style={box}>
        {ids === undefined || (current && local === undefined) ? (
          <div className="gallery-frame-note">Loading seed…</div>
        ) : ids === null || count === 0 ? (
          <div className="gallery-frame-note">No editions are recorded for this project, so there is nothing to run.</div>
        ) : src ? (
          <PieceFrame src={src} label={label} source="archived" />
        ) : (
          <div className="gallery-frame-note">
            This mint was never signed by fxhash, so no seed was ever assigned and no artwork was generated for it.
          </div>
        )}
      </div>

      <div className="gallery-bar" style={{ left: rect.left, top: rect.top + rect.height + 12, width: rect.width }}>
        <span>
          <strong>{label}</strong>{count > 0 && <span className="muted"> of {count}</span>}
          {' · '}{painting.artist} · {painting.year}
        </span>
        {count > 1 && <button className="load-more" onClick={() => step(-1)} aria-label="‹">‹</button>}
        {count > 1 && <button className="load-more" onClick={() => step(1)} aria-label="›">›</button>}
        {count > 1 && <button className="load-more" onClick={random}>Random</button>}
        <Link to={`/token/${painting.slug}`}>Project page</Link>
        {hasRunner && src && (
          <button className="link-button" onClick={() => setRaw((r) => !r)}>
            {raw ? 'put the compatibility script back' : "run the artist's file untouched"}
          </button>
        )}
        <button className="load-more" onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/gallery/Viewer.test.tsx && npm run typecheck`
Expected: PASS, 4 tests. (The `‹`/`›` buttons are found by their accessible name, which `aria-label` sets to the glyph.)

- [ ] **Step 5: Commit**

```bash
git add src/gallery/Viewer.tsx src/gallery/Viewer.test.tsx
git commit -m "feat: run the real piece on the wall, and step its edition"
```

---
### Task 14: The page — HUD, GalleryView, GalleryPage, route, styles

**Files:**
- Create: `src/gallery/Hud.tsx`, `src/gallery/GalleryView.tsx`, `src/pages/GalleryPage.tsx`
- Modify: `src/App.tsx`, `src/styles.css` (append)
- Test: `src/gallery/Hud.test.tsx`, `src/pages/GalleryPage.test.tsx`, `src/App.test.tsx` (append)

**Interfaces:**
- Consumes: `GalleryEngine`, `Mode`, `EngineEvents` (Task 12); `Viewer` (Task 13); `loadGallery` (Task 5); `probeCapabilities`, `chooseSmall`, `loadAtlases` (Task 12); `standingPose`, `ScreenRect` (Task 7); `parseGalleryQuery` (Task 5); `LoadError` (exists).
- Produces: `<Hud rooms roomTitle caption locked mode touch onTeleport />`; `spawnFor(gallery, search): Pose`; `<GalleryView />` (default export, the lazy chunk); `hasWebGL(): boolean`; `<GalleryPage />`; route `/gallery`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/gallery/Hud.test.tsx
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Hud from './Hud'
import type { Room } from './types'

afterEach(cleanup)

const room = (id: string, kind: Room['kind'], title: string): Room =>
  ({ id, kind, title, rect: { x: 0, z: 0, w: 8, d: 8 }, entry: { x: 0, z: 1, yaw: 0 } })
const rooms = [
  room('lobby', 'lobby', 'fxhash'),
  room('2021', 'hall', '2021 · Nov–Dec'),
  room('tz1z', 'solo', 'Zed'),
  room('2022-q1', 'hall', '2022 · Jan–Mar'),
  room('tz1a', 'solo', 'Ada'),
]

const renderHud = (over: Partial<Parameters<typeof Hud>[0]> = {}) => {
  const onTeleport = vi.fn()
  render(
    <MemoryRouter>
      <Hud rooms={rooms} caption={null} locked={false} mode="walk" touch={false} onTeleport={onTeleport} {...over} />
    </MemoryRouter>,
  )
  return onTeleport
}

test('the rooms menu lists eras in spine order, then artists alphabetically, and teleports', () => {
  const onTeleport = renderHud()
  fireEvent.click(screen.getByRole('button', { name: 'Rooms' }))
  const names = screen.getAllByRole('button').map((b) => b.textContent).filter((t) => t !== 'Rooms')
  expect(names).toEqual(['2021 · Nov–Dec', '2022 · Jan–Mar', 'Ada', 'Zed'])
  fireEvent.click(screen.getByRole('button', { name: 'Ada' }))
  expect(onTeleport).toHaveBeenCalledWith(rooms[4])
  expect(screen.queryByRole('button', { name: 'Ada' })).toBeNull()   // menu closed
})

test('shows where you are and what the crosshair is on', () => {
  renderHud({ roomTitle: 'Zed', caption: 'Thing — Zed, 2022', locked: true })
  expect(screen.getByText('Zed')).toBeTruthy()
  expect(screen.getByText('Thing — Zed, 2022')).toBeTruthy()
  expect(screen.getByRole('link', { name: /fxhash viewer/ }).getAttribute('href')).toBe('/')
})

test('hints match the input: click to lock on a mouse, drag and tap on touch, nothing while viewing', () => {
  renderHud()
  expect(screen.getByText(/click to look around/i)).toBeTruthy()
  cleanup()
  renderHud({ touch: true })
  expect(screen.queryByText(/click to look around/i)).toBeNull()
  expect(screen.getByText(/drag to look/i)).toBeTruthy()
  cleanup()
  renderHud({ mode: 'view' })
  expect(screen.queryByText(/look around/i)).toBeNull()
})
```

```tsx
// src/pages/GalleryPage.test.tsx
import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import GalleryPage from './GalleryPage'

// The real view needs WebGL and three.js; neither belongs in jsdom.
vi.mock('../gallery/GalleryView', () => ({ default: () => <div>the museum</div> }))

afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('without WebGL it says so and points at the grid', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  render(<MemoryRouter><GalleryPage /></MemoryRouter>)
  expect(screen.getByText(/needs WebGL/)).toBeTruthy()
  expect(screen.getByRole('link', { name: /the grid/ }).getAttribute('href')).toBe('/artwork')
})

test('with WebGL it loads the view', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as never)
  render(<MemoryRouter><GalleryPage /></MemoryRouter>)
  expect(await screen.findByText('the museum')).toBeTruthy()
})
```

```tsx
// append to src/App.test.tsx
test('/gallery is its own full-bleed page, outside the site chrome', () => {
  // jsdom has no WebGL, so the page is its fallback — which is enough to prove the route.
  renderAt('/gallery')
  expect(screen.getByText(/needs WebGL/)).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Artwork' })).toBeNull()
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/gallery/Hud.test.tsx src/pages/GalleryPage.test.tsx src/App.test.tsx`
Expected: FAIL — cannot resolve `./Hud`, `./GalleryPage`; the App test finds "not found" instead.

- [ ] **Step 3: Write Hud.tsx**

```tsx
// src/gallery/Hud.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Room } from './types'
import type { Mode } from './engine'

interface Props {
  rooms: Room[]
  roomTitle?: string
  /** What the crosshair is on: "Name — Artist, Year", or null. */
  caption: string | null
  locked: boolean
  mode: Mode
  /** A coarse pointer: no pointer lock, different hints. */
  touch: boolean
  onTeleport: (room: Room) => void
}

/**
 * The little that sits over the canvas. Everything is pointer-events: none except
 * the controls, so the canvas still gets the clicks that lock the pointer.
 */
export default function Hud({ rooms, roomTitle, caption, locked, mode, touch, onTeleport }: Props) {
  const [open, setOpen] = useState(false)
  const [everLocked, setEverLocked] = useState(false)
  useEffect(() => { if (locked) setEverLocked(true) }, [locked])

  const eras = rooms.filter((r) => r.kind === 'hall')
  const artists = rooms.filter((r) => r.kind === 'solo').sort((a, b) => a.title.localeCompare(b.title))
  const go = (r: Room) => { onTeleport(r); setOpen(false) }

  return (
    <div className="gallery-hud">
      <div className="gallery-hud-top">
        <Link to="/" className="gallery-back">← fxhash viewer</Link>
        <span className="gallery-room">{roomTitle}</span>
        <button className="load-more gallery-rooms-button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          Rooms
        </button>
      </div>

      {open && (
        <nav className="gallery-rooms" aria-label="Rooms">
          <h4>Eras</h4>
          <ul>{eras.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
          <h4>Artists</h4>
          <ul>{artists.map((r) => <li key={r.id}><button className="link-button" onClick={() => go(r)}>{r.title}</button></li>)}</ul>
        </nav>
      )}

      {mode === 'walk' && locked && <div className="gallery-crosshair" aria-hidden="true" />}
      {mode === 'walk' && caption && <p className="gallery-caption">{caption}</p>}
      {mode === 'walk' && !touch && !locked && <p className="gallery-hint">Click to look around</p>}
      {mode === 'walk' && touch && !everLocked && (
        <p className="gallery-hint gallery-hint-bottom">Drag to look · tap the floor to walk · tap a painting to see it run</p>
      )}
      {mode === 'walk' && !touch && !everLocked && (
        <p className="gallery-hint gallery-hint-bottom">WASD to walk · click a painting to see it run</p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Write GalleryView.tsx**

```tsx
// src/gallery/GalleryView.tsx
// The museum itself. This is the lazy chunk: it is the only place three.js is
// reached from, and it is only imported once GalleryPage has found WebGL.

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadGallery } from '../lib/data'
import LoadError from '../components/LoadError'
import type { Gallery, Painting, Pose, Room } from './types'
import { GalleryEngine, type Mode } from './engine'
import { chooseSmall, loadAtlases, probeCapabilities } from './load'
import { standingPose, type ScreenRect } from './approach'
import { parseGalleryQuery } from './query'
import Hud from './Hud'
import Viewer from './Viewer'

/** Where a visit begins: in front of the linked painting, inside the linked room, or in the lobby. */
export function spawnFor(gallery: Gallery, search: string): Pose {
  const q = parseGalleryQuery(search)
  const painting = q.project !== undefined ? gallery.paintings.find((p) => p.project === q.project) : undefined
  if (painting) return standingPose(painting)
  const room = q.room ? gallery.rooms.find((r) => r.id === q.room) : undefined
  return room ? room.entry : gallery.spawn
}

export default function GalleryView() {
  const [search] = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GalleryEngine | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [hovered, setHovered] = useState<Painting | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [locked, setLocked] = useState(false)
  const [mode, setMode] = useState<Mode>('walk')
  const [view, setView] = useState<{ painting: Painting; rect: ScreenRect } | null>(null)
  const touch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    loadGallery().then(
      (g) => { if (!cancelled) setGallery(g) },
      () => { if (!cancelled) setStatus('error') },
    )
    return () => { cancelled = true }
  }, [attempt])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!gallery || !canvas) return
    let cancelled = false
    let engine: GalleryEngine | null = null
    ;(async () => {
      const caps = probeCapabilities()
      const small = chooseSmall(caps.maxTextureSize, Math.min(window.screen.width, window.screen.height))
      const atlases = await loadAtlases(gallery, small, caps.maxAnisotropy)
      if (cancelled) { for (const t of atlases) t?.dispose(); return }
      engine = new GalleryEngine(canvas, gallery, atlases, small, {
        onHover: setHovered,
        onRoom: setRoom,
        onLock: setLocked,
        onMode: (m) => { setMode(m); if (m !== 'view') setView(null) },
        onArrive: (painting, rect) => setView({ painting, rect }),
      })
      engineRef.current = engine
      engine.start(spawnFor(gallery, `?${search.toString()}`))
      setStatus('ready')
    })()
    return () => {
      cancelled = true
      engine?.dispose()
      engineRef.current = null
    }
    // The query is read once, when the visit starts; editing the URL later does not teleport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery])

  return (
    <div className="gallery">
      <canvas ref={canvasRef} className="gallery-canvas" />
      {status === 'loading' && <p className="gallery-loading">Loading the gallery…</p>}
      {status === 'error' && (
        <div className="gallery-loading"><LoadError what="the gallery" onRetry={() => setAttempt((a) => a + 1)} /></div>
      )}
      {gallery && status === 'ready' && (
        <Hud
          rooms={gallery.rooms}
          roomTitle={room?.title}
          caption={hovered ? `${hovered.name} — ${hovered.artist}, ${hovered.year}` : null}
          locked={locked}
          mode={mode}
          touch={touch}
          onTeleport={(r) => engineRef.current?.teleport(r.entry)}
        />
      )}
      {view && <Viewer painting={view.painting} rect={view.rect} onBack={() => engineRef.current?.leaveView()} />}
    </div>
  )
}
```

- [ ] **Step 5: Write GalleryPage.tsx and the route**

```tsx
// src/pages/GalleryPage.tsx
import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'

// three.js lives behind this import and is only fetched once WebGL is known to exist.
const GalleryView = lazy(() => import('../gallery/GalleryView'))

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * A museum of the archived generators. Full-bleed, outside Layout: the page is
 * the building, and a site header over a building reads as a bug.
 */
export default function GalleryPage() {
  const [supported] = useState(hasWebGL)
  if (!supported) {
    return (
      <div className="gallery gallery-unsupported">
        <p>
          The gallery needs WebGL, which this browser does not offer. The same archived
          works are all in <Link to="/artwork">the grid</Link>.
        </p>
      </div>
    )
  }
  return (
    <Suspense fallback={<div className="gallery"><p className="gallery-loading">Loading the gallery…</p></div>}>
      <GalleryView />
    </Suspense>
  )
}
```

In `src/App.tsx`, import `GalleryPage` and make the route a sibling of the `Layout` entry:

```tsx
import GalleryPage from './pages/GalleryPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      // … unchanged …
    ],
  },
  // Outside Layout on purpose: the museum has no site header or footer.
  { path: '/gallery', element: <GalleryPage /> },
]
```

- [ ] **Step 6: Append the styles**

At the end of `src/styles.css` (after `.project-description`; the stylesheet test reads selectors by first occurrence, so nothing here may reuse an existing selector string):

```css
/* ---- The gallery ------------------------------------------------------------
 * A page of its own, fixed to the viewport, outside the site chrome. The canvas
 * is the page; everything else floats over it and lets clicks through except
 * where it is a control. */
.gallery { position: fixed; inset: 0; background: #111; overflow: hidden; }
.gallery-canvas { width: 100%; height: 100%; display: block; touch-action: none; }
.gallery-loading {
  position: absolute; inset: 0; margin: 0; padding: 1.5rem;
  display: flex; align-items: center; justify-content: center; text-align: center; color: #888;
}
.gallery-unsupported { display: flex; align-items: center; justify-content: center; padding: 2rem; }
.gallery-unsupported p { max-width: 30rem; }

.gallery-hud { position: absolute; inset: 0; pointer-events: none; }
.gallery-hud-top { display: flex; gap: 1rem; align-items: center; padding: 0.75rem 1rem; }
.gallery-hud-top > * { pointer-events: auto; }
.gallery-back { color: #fff; font-weight: 600; }
.gallery-room { color: #aaa; flex: 1; pointer-events: none; }
.gallery-rooms-button { margin: 0; padding: 0.4rem 0.9rem; }
.gallery-rooms {
  pointer-events: auto; position: absolute; top: 3.25rem; right: 1rem; min-width: 14rem;
  max-height: calc(100vh - 5rem); overflow-y: auto;
  background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 0.5rem 1rem 0.75rem;
}
.gallery-rooms h4 { margin: 0.5rem 0 0.25rem; color: #888; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.gallery-rooms ul { list-style: none; margin: 0; padding: 0; }
.gallery-rooms .link-button { color: #eee; text-decoration: none; padding: 0.2rem 0; display: block; text-align: left; }
.gallery-crosshair {
  position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px;
  border-radius: 50%; background: rgba(255, 255, 255, 0.8);
}
.gallery-caption {
  position: absolute; left: 50%; top: calc(50% + 1.25rem); transform: translateX(-50%); margin: 0;
  color: #eee; background: rgba(0, 0, 0, 0.6); padding: 0.3rem 0.7rem; border-radius: 6px;
  font-size: 0.9rem; white-space: nowrap;
}
.gallery-hint {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); margin: 0;
  color: #ccc; background: rgba(0, 0, 0, 0.6); padding: 0.5rem 1rem; border-radius: 6px;
}
.gallery-hint-bottom { top: auto; bottom: 1.5rem; transform: translateX(-50%); font-size: 0.85rem; color: #999; }

/* The piece, over the painting. The frame must coincide with the quad behind it, so
 * it gives up the border, the radius and the width cap the project page gives it. */
.gallery-viewer { position: absolute; inset: 0; pointer-events: none; }
.gallery-frame { position: fixed; pointer-events: auto; background: #000; }
.gallery-frame .archived-frame { width: 100%; height: 100%; max-width: none; aspect-ratio: auto; border: 0; border-radius: 0; }
.gallery-frame-note {
  width: 100%; height: 100%; box-sizing: border-box; padding: 1rem;
  display: flex; align-items: center; justify-content: center; text-align: center; color: #999;
}
.gallery-bar {
  position: fixed; pointer-events: auto; display: flex; flex-wrap: wrap; gap: 0.5rem 0.75rem;
  align-items: center; color: #ccc; font-size: 0.9rem;
}
.gallery-bar .load-more { margin: 0; padding: 0.3rem 0.7rem; }
```

- [ ] **Step 7: Run the whole suite, typecheck, and build**

Run: `npm test && npm run typecheck && npm run build`
Expected: all tests pass; no type errors; the build lists a separate chunk for the gallery (look for a `GalleryView-*.js` of roughly 500–700 KB minified — three.js — and confirm `index-*.js` is still about 315 KB).

- [ ] **Step 8: Commit**

```bash
git add src/gallery/Hud.tsx src/gallery/Hud.test.tsx src/gallery/GalleryView.tsx src/pages/GalleryPage.tsx src/pages/GalleryPage.test.tsx src/App.tsx src/App.test.tsx src/styles.css
git commit -m "feat: open the gallery at #/gallery"
```

---

### Task 15: Ways in — header tab, project and artist links, README

**Files:**
- Modify: `src/components/Layout.tsx`, `src/pages/TokenPage.tsx`, `src/pages/ArtistPage.tsx`, `README.md`
- Test: `src/components/Layout.test.tsx` (append), `src/pages/TokenPage.test.tsx` (append), `src/pages/ArtistPage.test.tsx` (append)

**Interfaces:**
- Consumes: `loadGallery` (Task 5); `isArchived` state in TokenPage (exists, line ~60).

- [ ] **Step 1: Write the failing tests**

```tsx
// append to src/components/Layout.test.tsx
test('header links to the gallery', () => {
  renderLayout()
  expect(screen.getByRole('link', { name: 'Gallery' }).getAttribute('href')).toBe('/gallery')
})
```

```tsx
// append to src/pages/TokenPage.test.tsx
test('an archived project links to its place in the gallery', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([iter()])
  vi.spyOn(data, 'loadSummary').mockResolvedValue({
    generatedAt: 'T', counts: { projects: 1, artists: 1, iterations: 1, seeds: 1, archived: 1, archivedShareOfVolume: 1 },
    ranked: [5], archived: [5], runners: [5], featured: { top: [], sample: [] }, thumbs: {},
  })
  renderAt('/token/tok-5')
  expect((await screen.findByRole('link', { name: /see it in the gallery/i })).getAttribute('href')).toBe('/gallery?project=5')
})

test('an unarchived project has no gallery link', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([iter()])
  vi.spyOn(data, 'loadSummary').mockResolvedValue({
    generatedAt: 'T', counts: { projects: 1, artists: 1, iterations: 1, seeds: 1, archived: 0, archivedShareOfVolume: 0 },
    ranked: [5], archived: [], runners: [], featured: { top: [], sample: [] }, thumbs: {},
  })
  renderAt('/token/tok-5')
  await screen.findByRole('heading', { name: 'Tok 5' })
  expect(screen.queryByRole('link', { name: /see it in the gallery/i })).toBeNull()
})
```

```tsx
// append to src/pages/ArtistPage.test.tsx
test('an artist with a room links to it; one without has no link', async () => {
  const gallery = {
    generatedAt: 'T', counts: { paintings: 5, artists: 1, soloRooms: 1, years: [2021, 2022] as [number, number] },
    atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: [], small: [] },
    spawn: { x: 0, z: 4, yaw: 0 },
    rooms: [{ id: 'tz1a', kind: 'solo' as const, title: 'Alice', rect: { x: 0, z: 0, w: 8, d: 8 }, entry: { x: 0, z: 1, yaw: 0 } }],
    walls: [], paintings: [], signs: [],
  }
  vi.spyOn(data, 'loadGallery').mockResolvedValue(gallery)
  renderAt('tz1a')
  expect((await screen.findByRole('link', { name: /room in the gallery/i })).getAttribute('href')).toBe('/gallery?room=tz1a')
  cleanup()
  vi.spyOn(data, 'loadGallery').mockResolvedValue({ ...gallery, rooms: [] })
  renderAt('tz1a')
  await screen.findByRole('heading', { name: 'Alice' })
  expect(screen.queryByRole('link', { name: /room in the gallery/i })).toBeNull()
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Layout.test.tsx src/pages/TokenPage.test.tsx src/pages/ArtistPage.test.tsx`
Expected: the three new tests FAIL (no such links); everything else passes.

- [ ] **Step 3: Add the links**

`src/components/Layout.tsx`, inside `<nav>` after Artists:

```tsx
          <Link to="/gallery">Gallery</Link>
```

`src/pages/TokenPage.tsx`, in the hero's text column, after the tags paragraph and before the market line:

```tsx
          {isArchived && (
            <p className="muted">
              <Link to={`/gallery?project=${project.id}`}>See it in the gallery →</Link>
            </p>
          )}
```

`src/pages/ArtistPage.tsx`: add `loadGallery` to the import from `../lib/data`, a state, a load, and the line.

```tsx
  // Whether this artist has a solo room in the gallery. Not fatal: no file, no link.
  const [hasRoom, setHasRoom] = useState(false)
```

Inside the existing `useEffect`, next to the `loadSummary()` call:

```tsx
    loadGallery().then(
      (g) => { if (!cancelled) setHasRoom(g.rooms.some((r) => r.kind === 'solo' && r.id === id)) },
      () => { if (!cancelled) setHasRoom(false) },
    )
```

In the hero's text column, after the description:

```tsx
          {hasRoom && (
            <p className="muted">
              <Link to={`/gallery?room=${id}`}>This artist has a room in the gallery →</Link>
            </p>
          )}
```

(`Link` needs importing from `react-router-dom` in ArtistPage, which currently imports only `useParams`.)

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/components/Layout.test.tsx src/pages/TokenPage.test.tsx src/pages/ArtistPage.test.tsx && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: README**

In `README.md`, under **What you can do here**, add a bullet after "Run the artwork":

```markdown
- **Walk the gallery.** The 420 archived projects hang in a museum you can walk
  through — halls by era, rooms for the artists with the most archived work. Step
  up to a painting and it runs, from its real seed, and you can page through the
  edition without leaving the wall.
```

Under **For developers**, after the `npm run build` line inside the code block:

```bash
npm run gallery   # rebuild public/data/gallery.json and its atlases after an archive change
```

And after "Pushing to `master` builds and publishes…", a sentence:

```markdown
`npm run summary` and `npm run gallery` both read the archived set off disk, so
both go stale when a generator is added or withdrawn; rerun them together.
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Layout.tsx src/components/Layout.test.tsx src/pages/TokenPage.tsx src/pages/TokenPage.test.tsx src/pages/ArtistPage.tsx src/pages/ArtistPage.test.tsx README.md
git commit -m "feat: point the way into the gallery from the header, every archived project, and every artist with a room"
```

---

### Task 16: Walk through it

No code unless something is wrong. This is the verification the spec calls for: the engine has no unit test, and a museum is judged by walking through it.

- [ ] **Step 1: Desktop walk-through**

Run: `npm run dev`, open `http://localhost:5173/#/gallery` in Chrome and in Firefox.

- Lobby: the title and counts read above the opening; the "2021 · Nov–Dec" sign is on the pier to the right of it.
- Click: the pointer locks, the crosshair appears, the bottom hint shows once.
- WASD walks at a comfortable pace; Shift hurries; you cannot walk through a wall, and sliding along one is smooth; doorways let you through; the lintel over a door is drawn.
- Halls: paintings on both sides, evenly spaced, frames behind them, plaques under the lower-right corner; the room title in the HUD changes as you cross a doorway.
- Crosshair on a painting within 6 m: the caption appears; off it: gone.
- Click a painting: the pointer unlocks, the camera glides square to it in ~0.6 s, the piece appears exactly over the painting (no sliver of wall visible inside the frame, no sliver of painting visible outside it), and the bar sits under it.
- ‹ › and the arrow keys step the edition; Random jumps; the counter is right; the project-page link works; "run the artist's file untouched" swaps the src.
- Back, Escape, a click on the canvas outside the frame, and W each leave; after a click the pointer re-locks, after Escape the "Click to look around" hint shows.
- Resize the window while viewing: the frame stays on the painting.
- Rooms menu: eras then artists; a teleport lands you just inside the door facing in; the menu closes.
- Enter a solo room: the name sign is above the door from the hall side and on the far wall inside.
- `#/gallery?project=2969`: you start 3 m from that painting, facing it. `#/gallery?room=tz1…` (any solo room id from gallery.json): you start inside. `#/gallery?room=nonsense`: the lobby.
- Navigate to `/` and back to `/gallery` twice: no console errors, no accumulating GPU memory (Chrome DevTools → Performance monitor → GPU memory steady).
- Check the console: no warnings from three.js, no 404s.

- [ ] **Step 2: Phone walk-through**

Open the dev server on a phone on the same network (`npm run dev -- --host`).

- The small atlases load (Network tab or the `-small.webp` requests); paintings are legible.
- Drag looks; tapping the floor walks there and stops at walls; tapping a painting glides to it; the piece fills ~75 % of the width in portrait; the bar wraps under it; a tap outside the piece leaves.
- The touch hint shows once; no "Click to look around".

- [ ] **Step 3: Production build and sizes**

Run: `npm run build`

- `dist/assets/` has a `GalleryView-*.js` chunk and `index-*.js` is still ~315 KB.
- `du -sh dist` — the increase over the previous build (959 MiB) should match the number the gallery script printed, plus the chunk.

- [ ] **Step 4: Offline**

Run: `npm run preview`, disconnect from the network, open `/#/gallery`: everything works, because nothing leaves the origin. Click a painting: the piece runs.

- [ ] **Step 5: Fix anything found, commit, and report**

Each fix is its own commit with its own test where the failure was testable. When the list above is clean, report the results of every step — including the measured size and the chunk size — rather than "it works".
