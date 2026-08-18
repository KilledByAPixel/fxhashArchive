# fxhash Viewer UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the newest-first project grid at `/` with a landing page that explains the archive, and make the grid itself open on random work with archived projects marked and filterable.

**Architecture:** A build script generates one small `public/data/summary.json` from the existing snapshots — rank order, the archived id set, headline counts, and precomputed curve points. The client fetches that single file for both the landing page and the grid, so neither loads the 3 MB of market shards nor the 17 MB catalog for ordering. Per-project tez figures load lazily from a single market shard only when a detail page opens.

**Tech Stack:** Vite, React 18, TypeScript, react-router-dom (hash router), Vitest + React Testing Library, plain SVG/CSS for visuals (no chart library).

**Spec:** `docs/superpowers/specs/2026-08-18-fxhash-viewer-ui-design.md`

## Global Constraints

- **No chart library.** All visuals are plain SVG/CSS, so the landing page still works in a fully offline copy.
- **No sale figures on grid cards.** Tez appears only on detail pages and as the landing-page concentration curve.
- **Historical totals only.** Show total traded and highest sale. Never floor price or current listings — they describe a live market that no longer exists.
- **Amounts are in tez, never converted to dollars.** Source data is mutez; divide by 1e6.
- **`globals: true` stays off in `vite.config.ts`.** Every rendering test file registers `afterEach(cleanup)` itself. See the comment in that file before touching it.
- **Moderation stays enforced.** Anything listing projects filters through `isVisible` from `src/lib/data.ts`.
- Run tests with `npm test`. Typecheck with `npm run typecheck`.

---

### Task 1: Summary builders (pure functions)

**Files:**
- Create: `scripts/summary-lib.mjs`
- Test: `scripts/summary-lib.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `CURVE_POINTS: number[]` — percent positions for the concentration curve.
  - `buildRanking(volumes: Map<number, number>): number[]` — project ids, highest volume first, zero-volume ids excluded, ties broken by ascending id.
  - `buildCurve(volumes: Map<number, number>, points?: number[]): Array<{ p: number, share: number }>` — `share` is the percentage of total volume held by the top `p` percent of ranked projects, rounded to one decimal.
  - `buildSummary(input): object` where `input` is `{ projectCount, artistCount, iterationCount, seedCount, volumes, archivedIds, generatedAt }` and the result is `{ generatedAt, counts: { projects, artists, iterations, seeds, archived }, ranked, archived, curve }`.

- [ ] **Step 1: Write the failing test**

Create `scripts/summary-lib.test.mjs`:

```javascript
import { test, expect } from 'vitest'
import { buildRanking, buildCurve, buildSummary, CURVE_POINTS } from './summary-lib.mjs'

const volumes = new Map([[1, 500], [2, 300], [3, 200], [4, 0]])

test('buildRanking orders by volume desc and drops zero-volume projects', () => {
  expect(buildRanking(volumes)).toEqual([1, 2, 3])
})

test('buildRanking breaks ties by ascending id so output is stable', () => {
  expect(buildRanking(new Map([[9, 100], [2, 100], [5, 100]]))).toEqual([2, 5, 9])
})

test('buildCurve reports the share of volume held by the top p percent', () => {
  // 4 ranked projects of 100 each; the top 50% hold half the volume.
  const even = new Map([[1, 100], [2, 100], [3, 100], [4, 100]])
  const curve = buildCurve(even, [50, 100])
  expect(curve).toEqual([{ p: 50, share: 50 }, { p: 100, share: 100 }])
})

test('buildCurve always counts at least one project so small p is never empty', () => {
  const curve = buildCurve(volumes, [1])
  // top 1% of 3 ranked projects rounds to 0 — must still report the leader, 500/1000.
  expect(curve).toEqual([{ p: 1, share: 50 }])
})

test('buildSummary assembles counts, ranking, archived set and curve', () => {
  const s = buildSummary({
    projectCount: 4, artistCount: 2, iterationCount: 10, seedCount: 9,
    volumes, archivedIds: [3, 1], generatedAt: '2026-08-18T00:00:00.000Z',
  })
  expect(s.counts).toEqual({ projects: 4, artists: 2, iterations: 10, seeds: 9, archived: 2 })
  expect(s.ranked).toEqual([1, 2, 3])
  expect(s.archived).toEqual([1, 3]) // sorted ascending
  expect(s.curve.length).toBe(CURVE_POINTS.length)
  expect(s.generatedAt).toBe('2026-08-18T00:00:00.000Z')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/summary-lib.test.mjs`
Expected: FAIL — cannot resolve `./summary-lib.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/summary-lib.mjs`:

```javascript
// Pure builders for public/data/summary.json. Kept free of I/O so they can be
// tested directly, mirroring scripts/snapshot-lib.mjs.

/** Percent positions sampled for the landing-page concentration curve. */
export const CURVE_POINTS = [0.25, 0.5, 1, 2, 3, 5, 10, 25, 50, 100]

/** Project ids, highest volume first. Zero-volume projects are not ranked at all. */
export function buildRanking(volumes) {
  return [...volumes.entries()]
    .filter(([, v]) => v > 0)
    // Ties broken by id so the file is byte-identical across runs; an unstable
    // ranking would show up as a spurious diff on every regeneration.
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([id]) => id)
}

export function buildCurve(volumes, points = CURVE_POINTS) {
  const ranked = buildRanking(volumes)
  const sorted = ranked.map((id) => volumes.get(id))
  const total = sorted.reduce((a, b) => a + b, 0)
  if (total === 0) return points.map((p) => ({ p, share: 0 }))
  return points.map((p) => {
    // At least one project: rounding 1% of a small catalog to zero would report
    // a 0% share, which reads as "the top projects hold nothing".
    const n = Math.max(1, Math.round((ranked.length * p) / 100))
    const share = sorted.slice(0, n).reduce((a, b) => a + b, 0)
    return { p, share: Math.round((1000 * share) / total) / 10 }
  })
}

export function buildSummary({
  projectCount, artistCount, iterationCount, seedCount, volumes, archivedIds, generatedAt,
}) {
  const archived = [...archivedIds].sort((a, b) => a - b)
  return {
    generatedAt,
    counts: {
      projects: projectCount,
      artists: artistCount,
      iterations: iterationCount,
      seeds: seedCount,
      archived: archived.length,
    },
    ranked: buildRanking(volumes),
    archived,
    curve: buildCurve(volumes),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/summary-lib.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/summary-lib.mjs scripts/summary-lib.test.mjs
git commit -m "feat: add pure builders for the site summary file"
```

---

### Task 2: Generate `summary.json`

**Files:**
- Create: `scripts/build-summary.mjs`
- Modify: `package.json` (add the `summary` script)
- Generates: `public/data/summary.json`

**Interfaces:**
- Consumes: `buildSummary` from Task 1.
- Produces: `public/data/summary.json` on disk, shape as defined in Task 1.

- [ ] **Step 1: Write the script**

Create `scripts/build-summary.mjs`:

```javascript
// Generate public/data/summary.json — the one file the landing page and the
// artwork grid need. Rank order lives here so neither has to pull the 3 MB of
// market shards just to sort, and the archived id set lives here so a card can
// show its badge without a second fetch.
//
// Usage: node scripts/build-summary.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { buildSummary } from './summary-lib.mjs'

const DATA = 'public/data'

const loadJson = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

const shardLabels = async (dir, prefix) =>
  (await readdir(dir))
    .filter((f) => new RegExp(`^${prefix}-\\d+\\.json$`).test(f))
    .sort()
    .map((f) => f.match(/-(\d+)\.json$/)[1])

async function main() {
  const tokenLabels = await shardLabels(join(DATA, 'tokens'), 'index')

  let projectCount = 0
  for (const label of tokenLabels) {
    projectCount += (await loadJson(join(DATA, 'tokens', `index-${label}.json`), [])).length
  }

  const artists = await loadJson(join(DATA, 'artists', 'index.json'), [])

  let iterationCount = 0
  for (const label of tokenLabels) {
    const map = await loadJson(join(DATA, 'iterations', `map-${label}.json`), {})
    for (const ids of Object.values(map)) iterationCount += ids.length
  }

  const seedsMeta = await loadJson(join(DATA, 'seeds', 'meta.json'), { seedsCaptured: 0 })

  const volumes = new Map()
  for (const label of await shardLabels(join(DATA, 'market'), 'stats')) {
    const stats = await loadJson(join(DATA, 'market', `stats-${label}.json`), {})
    for (const [id, s] of Object.entries(stats)) {
      volumes.set(Number(id), s ? ((s.pv ?? 0) + (s.sv ?? 0)) / 1e6 : 0)
    }
  }

  const manifest = await loadJson(join(DATA, 'generators', 'manifest.json'), {})

  const summary = buildSummary({
    projectCount,
    artistCount: artists.length,
    iterationCount,
    seedCount: seedsMeta.seedsCaptured ?? 0,
    volumes,
    archivedIds: Object.keys(manifest).map(Number),
    generatedAt: new Date().toISOString(),
  })

  const out = join(DATA, 'summary.json')
  await writeFile(out, JSON.stringify(summary))
  const size = JSON.stringify(summary).length
  console.log(
    `${out}: ${(size / 1024).toFixed(0)} KB | ${summary.counts.projects} projects, ` +
      `${summary.ranked.length} ranked, ${summary.counts.archived} archived`,
  )
}

main().catch((err) => {
  console.error('FATAL:', err)
  process.exitCode = 1
})
```

- [ ] **Step 2: Add the npm script**

In `package.json`, add to `"scripts"` after `"snapshot:contracts"`:

```json
    "summary": "node scripts/build-summary.mjs"
```

- [ ] **Step 3: Run it and check the output**

Run: `npm run summary`
Expected: prints a size around 150–250 KB, roughly 27,430 projects, ~26,000 ranked, ~396 archived.

Sanity check the file:

```bash
node -e "const s=require('./public/data/summary.json');console.log(s.counts, s.ranked.length, s.archived.length, s.curve.slice(0,3))"
```

Expected: counts populated, `curve` starting near `{p:0.25, share:46.5}`.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-summary.mjs package.json public/data/summary.json
git commit -m "feat: generate summary.json for the landing page and grid"
```

---

### Task 3: Load the summary in the client

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/data.ts`
- Test: `src/lib/data.test.ts`

**Interfaces:**
- Consumes: `summary.json` from Task 2.
- Produces:
  - `Summary` interface in `src/lib/types.ts`.
  - `loadSummary(): Promise<Summary>` in `src/lib/data.ts`.

- [ ] **Step 1: Write the failing test**

Append to `src/lib/data.test.ts`:

```typescript
test('loadSummary fetches summary.json', async () => {
  const summary = {
    generatedAt: '2026-08-18T00:00:00.000Z',
    counts: { projects: 3, artists: 2, iterations: 9, seeds: 8, archived: 1 },
    ranked: [2, 1], archived: [1], curve: [{ p: 1, share: 50 }],
  }
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => summary })
  vi.stubGlobal('fetch', fetchMock)
  data._resetCache()

  await expect(data.loadSummary()).resolves.toEqual(summary)
  expect(fetchMock.mock.calls[0][0]).toContain('data/summary.json')
})
```

If `src/lib/data.test.ts` does not already import `vi` or namespace-import the module, match the file's existing import style rather than adding a second one.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/data.test.ts -t loadSummary`
Expected: FAIL — `data.loadSummary is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `src/lib/types.ts`:

```typescript
export interface Summary {
  generatedAt: string
  counts: {
    projects: number
    artists: number
    iterations: number
    seeds: number
    archived: number
  }
  /** Project ids, highest collector spending first. Position is the rank. */
  ranked: number[]
  /** Project ids whose generator code is archived in this repo. */
  archived: number[]
  curve: Array<{ p: number; share: number }>
}
```

In `src/lib/data.ts`, extend the type import and add the loader beside `loadMeta`:

```typescript
import type { LeanToken, Artist, SnapshotMeta, Summary } from './types'
```

```typescript
/**
 * Rank order, the archived id set, and headline counts in one small file.
 * Generated by scripts/build-summary.mjs so the grid can sort by collector
 * spending without fetching the 3 MB of market shards.
 */
export const loadSummary = () => getJson<Summary>('summary.json')
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/data.test.ts`
Expected: PASS, including the new test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/data.ts src/lib/data.test.ts
git commit -m "feat: load summary.json in the client"
```

---

### Task 4: Seeded shuffle

**Files:**
- Create: `src/lib/shuffle.ts`
- Test: `src/lib/shuffle.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `seededShuffle<T>(items: readonly T[], seed: number): T[]` — a new array, deterministic for a given seed, input untouched.

- [ ] **Step 1: Write the failing test**

Create `src/lib/shuffle.test.ts`:

```typescript
import { test, expect } from 'vitest'
import { seededShuffle } from './shuffle'

const items = Array.from({ length: 50 }, (_, i) => i)

test('same seed gives the same order', () => {
  expect(seededShuffle(items, 123)).toEqual(seededShuffle(items, 123))
})

test('different seeds give different orders', () => {
  expect(seededShuffle(items, 1)).not.toEqual(seededShuffle(items, 2))
})

test('shuffling keeps every item exactly once', () => {
  const out = seededShuffle(items, 7)
  expect(out.length).toBe(items.length)
  expect([...out].sort((a, b) => a - b)).toEqual(items)
})

test('the input array is not mutated', () => {
  const input = [1, 2, 3, 4, 5]
  seededShuffle(input, 9)
  expect(input).toEqual([1, 2, 3, 4, 5])
})

test('empty input is handled', () => {
  expect(seededShuffle([], 1)).toEqual([])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/shuffle.test.ts`
Expected: FAIL — cannot resolve `./shuffle`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/shuffle.ts`:

```typescript
/**
 * Deterministic shuffle.
 *
 * The grid picks one seed per visit and reuses it for every render. Calling
 * Math.random() during render instead would reshuffle on each keystroke and on
 * every "load more", so projects would repeat and others would never be seen —
 * the paging equivalent of losing your place in a book each time you blink.
 */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items]
  const rand = mulberry32(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Small, fast, well-distributed 32-bit PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/shuffle.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shuffle.ts src/lib/shuffle.test.ts
git commit -m "feat: add seeded shuffle for stable random ordering"
```

---

### Task 5: Routes and navigation

**Files:**
- Create: `src/pages/LandingPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `loadSummary` from Task 3.
- Produces: route `/` renders `LandingPage`; route `/artwork` renders `BrowsePage`; header exposes links named `Artwork` and `Artists`.

This task ships a minimal landing page — heading and counts only. Task 8 adds the visuals.

- [ ] **Step 1: Write the failing test**

Replace the contents of `src/App.test.tsx` with:

```tsx
import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './App'
import * as data from './lib/data'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 27430, artists: 5407, iterations: 1845509, seeds: 1802387, archived: 396 },
  ranked: [1], archived: [1], curve: [{ p: 1, share: 67.9 }],
}

function renderAt(path: string) {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([])
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

test('header links to both artwork and artists', () => {
  renderAt('/')
  expect(screen.getByRole('link', { name: 'fxhash viewer' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artwork' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artists' })).toBeTruthy()
})

test('root renders the landing page, not the grid', async () => {
  renderAt('/')
  expect(await screen.findByRole('heading', { name: /archive/i })).toBeTruthy()
})

test('/artwork renders the grid', async () => {
  renderAt('/artwork')
  expect(await screen.findByPlaceholderText(/search projects/i)).toBeTruthy()
})

test('unknown route renders not-found', () => {
  renderAt('/definitely/not/a/route')
  expect(screen.getByText(/not found/i)).toBeTruthy()
  expect(screen.getAllByRole('link', { name: 'fxhash viewer' })).toHaveLength(1)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — no `Artwork` link, and `/` still renders the grid.

- [ ] **Step 3: Create the minimal landing page**

Create `src/pages/LandingPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { loadSummary } from '../lib/data'
import type { Summary } from '../lib/types'

const n = (value: number) => value.toLocaleString()

export default function LandingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSummary().then(setSummary, (e) => setError(String(e)))
  }, [])

  return (
    <div className="landing">
      <h1>An archive of fxhash on Tezos</h1>
      <p className="landing-intro">
        fxhash went offline. This is an unofficial, read-only viewer for the generative
        art made there — every project, every artist, and the seed behind every piece
        ever minted. Nothing here is for sale.
      </p>

      {error && <p>Could not load archive statistics: {error}</p>}
      {summary && (
        <ul className="landing-stats">
          <li><strong>{n(summary.counts.projects)}</strong> projects</li>
          <li><strong>{n(summary.counts.artists)}</strong> artists</li>
          <li><strong>{n(summary.counts.iterations)}</strong> iterations</li>
          <li><strong>{n(summary.counts.seeds)}</strong> seeds preserved</li>
          <li><strong>{n(summary.counts.archived)}</strong> projects playable offline</li>
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Wire the routes**

In `src/App.tsx`, add the import and change the route table:

```tsx
import LandingPage from './pages/LandingPage'
```

```tsx
      { path: '/', element: <LandingPage /> },
      { path: '/artwork', element: <BrowsePage /> },
```

Leave every other route unchanged.

- [ ] **Step 5: Add the nav tabs**

In `src/components/Layout.tsx`, replace the `<nav>` element with:

```tsx
        <nav>
          <Link to="/artwork">Artwork</Link>
          <Link to="/artists">Artists</Link>
        </nav>
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS, 4 tests.

Then run the whole suite — other tests may link to `/`:

Run: `npm test`
Expected: PASS. If a test asserted that `/` shows the grid, update it to `/artwork`.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/Layout.tsx src/pages/LandingPage.tsx
git commit -m "feat: add landing page at / and move the grid to /artwork"
```

---

### Task 6: Rework grid sorting

**Files:**
- Modify: `src/pages/BrowsePage.tsx`
- Test: `src/pages/BrowsePage.test.tsx`

**Interfaces:**
- Consumes: `seededShuffle` (Task 4), `loadSummary` (Task 3).
- Produces: `BrowsePage` with sort modes `random` (default), `collected`, `newest`. The `edition` mode is gone.

- [ ] **Step 1: Write the failing test**

Create `src/pages/BrowsePage.test.tsx`:

```tsx
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BrowsePage from './BrowsePage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const token = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: id, iterationsCount: 0,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null, displayUri: null,
  generativeUri: 'ipfs://gen', tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null },
  ...over,
})

const tokens = [token(1), token(2), token(3), token(4)]

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 4, artists: 1, iterations: 0, seeds: 0, archived: 1 },
  ranked: [3, 1, 4, 2],
  archived: [2],
  curve: [{ p: 1, share: 50 }],
}

beforeEach(() => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(tokens)
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const renderPage = () => render(<MemoryRouter><BrowsePage /></MemoryRouter>)
const names = () => screen.getAllByText(/^Tok \d$/).map((el) => el.textContent)

test('largest-edition sorting is gone', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.queryByRole('option', { name: /edition/i })).toBeNull()
})

test('offers random, most collected and newest', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.getByRole('option', { name: /random/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /collected/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /newest/i })).toBeTruthy()
})

test('defaults to random, not newest', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('random')
})

test('most collected follows the ranking from summary.json', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'collected' } })
  expect(names()).toEqual(['Tok 3', 'Tok 1', 'Tok 4', 'Tok 2'])
})

test('random order is stable while typing in the search box', async () => {
  renderPage()
  const search = await screen.findByPlaceholderText(/search projects/i)
  const before = names()
  // A filter that matches everything: order must not be reshuffled by the keystroke.
  fireEvent.change(search, { target: { value: 'Tok' } })
  expect(names()).toEqual(before)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/BrowsePage.test.tsx`
Expected: FAIL — "Largest edition" option still present, default is `newest`.

- [ ] **Step 3: Implement**

Rewrite `src/pages/BrowsePage.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { loadAllTokens, loadSummary, isVisible } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'

const PAGE = 60
type SortMode = 'random' | 'collected' | 'newest'

export default function BrowsePage() {
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('random')
  const [shown, setShown] = useState(PAGE)
  // One seed per visit, chosen on mount. Re-rolling it during render would
  // reshuffle the grid on every keystroke and every "load more".
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff))

  useEffect(() => {
    loadAllTokens().then(setTokens, (e) => setError(String(e)))
    // The summary only affects ordering and badges, so a failure must not blank
    // the grid — the catalog alone is still worth showing.
    loadSummary().then(setSummary, () => setSummary(null))
  }, [])

  const rank = useMemo(() => {
    const map = new Map<number, number>()
    summary?.ranked.forEach((id, i) => map.set(id, i))
    return map
  }, [summary])

  const visible = useMemo(() => {
    if (!tokens) return []
    const q = query.trim().toLowerCase()
    const filtered = tokens.filter(
      (t) => isVisible(t) && (!q ||
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.author?.name ?? '').toLowerCase().includes(q)),
    )
    if (sort === 'random') return seededShuffle(filtered, seed)
    if (sort === 'collected') {
      // Unranked projects (no recorded trades) sort last, keeping their own order.
      const last = Number.MAX_SAFE_INTEGER
      return [...filtered].sort((a, b) => (rank.get(a.id) ?? last) - (rank.get(b.id) ?? last))
    }
    return [...filtered].reverse() // snapshot is mint-date ASC, so reverse = newest first
  }, [tokens, query, sort, seed, rank])

  if (error) return <p>Failed to load catalog: {error}</p>
  if (!tokens) return <p>Loading catalog…</p>

  return (
    <div>
      <div className="browse-controls">
        <input
          placeholder="Search projects, tags, artists…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }}
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as SortMode); setShown(PAGE) }}
        >
          <option value="random">Random</option>
          <option value="collected">Most collected</option>
          <option value="newest">Newest</option>
        </select>
        <span className="count">{visible.length} projects</span>
      </div>
      <div className="token-grid">
        {visible.slice(0, shown).map((t) => <TokenCard key={t.id} token={t} />)}
      </div>
      {shown < visible.length && (
        <button className="load-more" onClick={() => setShown((s) => s + PAGE)}>
          Load more ({visible.length - shown} remaining)
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/BrowsePage.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BrowsePage.tsx src/pages/BrowsePage.test.tsx
git commit -m "feat: default the grid to random, rank by collector interest"
```

---

### Task 7: Archived badge and filter

**Files:**
- Modify: `src/components/TokenCard.tsx`
- Modify: `src/pages/BrowsePage.tsx`
- Test: `src/pages/BrowsePage.test.tsx`

**Interfaces:**
- Consumes: `summary.archived` (Task 3).
- Produces: `TokenCard` accepts an optional `archived?: boolean` prop and renders a badge with text `Offline` and `title="Playable offline — generator archived in this repo"`. `BrowsePage` gains a checkbox labelled `Fully archived only`.

- [ ] **Step 1: Write the failing test**

Append to `src/pages/BrowsePage.test.tsx`:

```tsx
test('archived projects are badged', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  // summary.archived = [2], so exactly one badge for four projects.
  expect(screen.getAllByTitle(/playable offline/i)).toHaveLength(1)
})

test('the archived filter narrows the grid to archived projects', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.click(screen.getByLabelText(/fully archived only/i))
  expect(names()).toEqual(['Tok 2'])
})

test('the archived filter combines with search', async () => {
  renderPage()
  const search = await screen.findByPlaceholderText(/search projects/i)
  fireEvent.click(screen.getByLabelText(/fully archived only/i))
  fireEvent.change(search, { target: { value: 'Tok 3' } })
  expect(names()).toEqual([])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/BrowsePage.test.tsx -t archived`
Expected: FAIL — no element with that title, no such checkbox.

- [ ] **Step 3: Add the badge to TokenCard**

Rewrite `src/components/TokenCard.tsx`:

```tsx
import { Link } from 'react-router-dom'
import IpfsImage from './IpfsImage'
import type { LeanToken } from '../lib/types'

export default function TokenCard({
  token,
  archived = false,
}: {
  token: LeanToken
  archived?: boolean
}) {
  return (
    <Link to={`/token/${token.slug}`} className="token-card">
      <IpfsImage uri={token.thumbnailUri} alt={token.name} className="token-thumb" />
      {archived && (
        <span className="token-badge" title="Playable offline — generator archived in this repo">
          Offline
        </span>
      )}
      <div className="token-name">{token.name}</div>
      <div className="token-author">{token.author?.name ?? token.author?.id ?? 'unknown'}</div>
    </Link>
  )
}
```

- [ ] **Step 4: Add the filter to BrowsePage**

In `src/pages/BrowsePage.tsx`, add the state beside the others:

```tsx
  const [archivedOnly, setArchivedOnly] = useState(false)
```

Add the archived id set beside `rank`:

```tsx
  const archivedIds = useMemo(() => new Set(summary?.archived ?? []), [summary])
```

In `visible`, apply the filter as part of the existing `filtered` predicate by replacing the `tokens.filter(...)` call with:

```tsx
    const filtered = tokens.filter(
      (t) => isVisible(t) &&
        (!archivedOnly || archivedIds.has(t.id)) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (t.author?.name ?? '').toLowerCase().includes(q)),
    )
```

Add `archivedOnly` and `archivedIds` to that `useMemo` dependency array, which becomes:

```tsx
  }, [tokens, query, sort, seed, rank, archivedOnly, archivedIds])
```

Add the control inside `browse-controls`, after the `<select>`:

```tsx
        <label className="archived-filter">
          <input
            type="checkbox"
            checked={archivedOnly}
            onChange={(e) => { setArchivedOnly(e.target.checked); setShown(PAGE) }}
          />
          Fully archived only
        </label>
```

And pass the flag when rendering cards:

```tsx
        {visible.slice(0, shown).map((t) => (
          <TokenCard key={t.id} token={t} archived={archivedIds.has(t.id)} />
        ))}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/pages/BrowsePage.test.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/TokenCard.tsx src/pages/BrowsePage.tsx src/pages/BrowsePage.test.tsx
git commit -m "feat: mark and filter projects playable offline"
```

---

### Task 8: Landing page visuals

**Files:**
- Modify: `src/pages/LandingPage.tsx`
- Modify: `src/index.css`
- Test: `src/pages/LandingPage.test.tsx`

**Interfaces:**
- Consumes: `loadSummary`, `loadAllTokens`, `isVisible`, `seededShuffle`, `TokenCard`.
- Produces: landing page with a coverage bar, the concentration curve as inline SVG, a random strip and a most-collected strip.

- [ ] **Step 1: Write the failing test**

Create `src/pages/LandingPage.test.tsx`:

```tsx
import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const token = (id: number): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: 1, iterationsCount: 0,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null, displayUri: null,
  generativeUri: 'ipfs://gen', tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null },
})

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 27430, artists: 5407, iterations: 1845509, seeds: 1802387, archived: 396 },
  ranked: [3, 1, 2],
  archived: [1],
  curve: [{ p: 1, share: 67.9 }, { p: 10, share: 94.6 }, { p: 100, share: 100 }],
}

beforeEach(() => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([token(1), token(2), token(3)])
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const renderPage = () => render(<MemoryRouter><LandingPage /></MemoryRouter>)

test('shows the headline counts', async () => {
  renderPage()
  expect(await screen.findByText('1,802,387')).toBeTruthy()
  expect(screen.getByText('27,430')).toBeTruthy()
  expect(screen.getByText('396')).toBeTruthy()
})

test('draws the concentration curve as inline svg with one point per sample', async () => {
  renderPage()
  // findByTestId, not findByTitle: for SVG, Testing Library's ByTitle matches the
  // <title> node itself, so querying its children for circles would find none.
  const chart = await screen.findByTestId('concentration-curve')
  expect(chart.querySelectorAll('circle')).toHaveLength(summary.curve.length)
})

test('shows a random strip and a most-collected strip', async () => {
  renderPage()
  expect(await screen.findByRole('heading', { name: /random/i })).toBeTruthy()
  expect(screen.getByRole('heading', { name: /collected/i })).toBeTruthy()
})

test('most-collected strip follows the ranking', async () => {
  renderPage()
  await screen.findByRole('heading', { name: /collected/i })
  const strip = screen.getByTestId('landing-collected')
  const names = [...strip.querySelectorAll('.token-name')].map((el) => el.textContent)
  expect(names).toEqual(['Tok 3', 'Tok 1', 'Tok 2'])
})

test('survives the catalog failing to load', async () => {
  vi.spyOn(data, 'loadAllTokens').mockRejectedValue(new Error('offline'))
  renderPage()
  // Statistics still render; the art strips simply do not appear.
  expect(await screen.findByText('27,430')).toBeTruthy()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/LandingPage.test.tsx`
Expected: FAIL — no curve, no strips.

- [ ] **Step 3: Implement the page**

Rewrite `src/pages/LandingPage.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSummary, loadAllTokens, isVisible } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'

const STRIP = 8
const n = (value: number) => value.toLocaleString()

/** The curve as an SVG polyline plus one dot per sampled point. */
function ConcentrationCurve({ curve }: { curve: Summary['curve'] }) {
  // Two points are needed to span an axis; one would divide by zero below.
  if (curve.length < 2) return null

  const w = 320
  const h = 120
  // Rank position is plotted on a log scale: the interesting behaviour is all in
  // the first few percent, which a linear axis would squash into the left edge.
  const x = (p: number) => (Math.log10(p) - Math.log10(curve[0].p)) /
    (Math.log10(100) - Math.log10(curve[0].p)) * w
  const y = (share: number) => h - (share / 100) * h
  const points = curve.map((c) => `${x(c.p).toFixed(1)},${y(c.share).toFixed(1)}`).join(' ')

  return (
    <svg
      className="curve"
      data-testid="concentration-curve"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Share of collector spending held by the top-ranked projects"
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
      {curve.map((c) => (
        <circle key={c.p} cx={x(c.p)} cy={y(c.share)} r="3" fill="currentColor" />
      ))}
    </svg>
  )
}

export default function LandingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff))

  useEffect(() => {
    loadSummary().then(setSummary, (e) => setError(String(e)))
    // The art strips are a bonus; the archive statistics are the point. A failed
    // catalog fetch must not take the whole page down with it.
    loadAllTokens().then(setTokens, () => setTokens(null))
  }, [])

  const shown = useMemo(() => (tokens ?? []).filter(isVisible), [tokens])
  const random = useMemo(() => seededShuffle(shown, seed).slice(0, STRIP), [shown, seed])
  const collected = useMemo(() => {
    if (!summary) return []
    const byId = new Map(shown.map((t) => [t.id, t]))
    return summary.ranked.map((id) => byId.get(id)).filter((t): t is LeanToken => Boolean(t)).slice(0, STRIP)
  }, [summary, shown])

  const archivedPct = summary
    ? (100 * summary.counts.archived) / summary.counts.projects
    : 0

  return (
    <div className="landing">
      <h1>An archive of fxhash on Tezos</h1>
      <p className="landing-intro">
        fxhash went offline. This is an unofficial, read-only viewer for the generative
        art made there — every project, every artist, and the seed behind every piece
        ever minted. Nothing here is for sale.
      </p>

      {error && <p>Could not load archive statistics: {error}</p>}

      {summary && (
        <ul className="landing-stats">
          <li><strong>{n(summary.counts.projects)}</strong> projects</li>
          <li><strong>{n(summary.counts.artists)}</strong> artists</li>
          <li><strong>{n(summary.counts.iterations)}</strong> iterations</li>
          <li><strong>{n(summary.counts.seeds)}</strong> seeds preserved</li>
          <li><strong>{n(summary.counts.archived)}</strong> playable offline</li>
        </ul>
      )}

      {/* Art before charts: this is a gallery that happens to keep statistics,
          not a dashboard that happens to show pictures. */}
      {random.length > 0 && (
        <section>
          <h2>Random from the archive</h2>
          <div className="token-grid" data-testid="landing-random">
            {random.map((t) => <TokenCard key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {summary && (
        <section className="landing-coverage">
          <h2>What is preserved</h2>
          <p>
            Every project's details and every iteration's seed are stored here, so any
            piece can be regenerated. Generator code is larger, so it is archived
            selectively: <strong>{n(summary.counts.archived)}</strong> projects run with
            no network at all, while the rest still depend on IPFS staying up.
          </p>
          <div className="bar" title="Share of projects playable offline">
            <div className="bar-fill" style={{ width: `${archivedPct.toFixed(2)}%` }} />
          </div>
          <p className="landing-note">
            Those projects are chosen by how much collectors engaged with them, which is
            concentrated enough that a small archive covers most of it:
          </p>
          <ConcentrationCurve curve={summary.curve} />
          <p className="landing-note">
            The top {summary.curve[0].p}% of projects account for {summary.curve[0].share}%
            of all collector spending on the platform.
          </p>
        </section>
      )}

      {collected.length > 0 && (
        <section>
          <h2>Most collected</h2>
          <div className="token-grid" data-testid="landing-collected">
            {collected.map((t) => <TokenCard key={t.id} token={t} />)}
          </div>
          <Link to="/artwork">Browse all {n(summary?.counts.projects ?? 0)} projects →</Link>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Add styles**

Append to `src/index.css`:

```css
.landing-intro { max-width: 42rem; }
.landing-stats { display: flex; flex-wrap: wrap; gap: 1.5rem; list-style: none; padding: 0; }
.landing-stats strong { display: block; font-size: 1.5rem; }
.landing-note { max-width: 42rem; opacity: 0.8; }
.bar { background: rgba(127, 127, 127, 0.25); border-radius: 3px; height: 10px; overflow: hidden; }
/* Archived share is well under 2%, so guarantee the fill stays visible. */
.bar-fill { background: currentColor; height: 100%; min-width: 2px; }
.curve { color: inherit; max-width: 320px; width: 100%; }
.token-card { position: relative; }
.token-badge {
  position: absolute; top: 6px; right: 6px;
  background: rgba(0, 0, 0, 0.7); color: #fff;
  border-radius: 3px; font-size: 0.7rem; padding: 2px 6px;
}
.archived-filter { display: inline-flex; align-items: center; gap: 0.35rem; }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/pages/LandingPage.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/pages/LandingPage.tsx src/pages/LandingPage.test.tsx src/index.css
git commit -m "feat: add coverage and concentration visuals to the landing page"
```

---

### Task 9: Historical sales on the project page

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/pages/TokenPage.tsx`
- Test: `src/lib/data.test.ts`, `src/pages/TokenPage.test.tsx`

**Interfaces:**
- Consumes: `public/data/market/stats-NNN.json`, written by `scripts/snapshot-market.mjs`.
- Produces:
  - `MarketStats` interface in `src/lib/types.ts`: `{ pv: number, pn: number, sv: number, sn: number, floor: number | null, med: number | null, hi: number | null, lo: number | null, listed: number }`.
  - `loadProjectMarketStats(slug: string, projectId: number): Promise<MarketStats | null>` in `src/lib/data.ts` — `null` when the project never traded or is unknown.

- [ ] **Step 1: Write the failing test**

Append to `src/lib/data.test.ts`:

```typescript
test('loadProjectMarketStats reads the shard that holds the project', async () => {
  const stats = { pv: 1_000_000, pn: 10, sv: 2_500_000, sn: 4, floor: null, med: null, hi: 900_000, lo: 1, listed: 0 }
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    if (String(url).includes('slug-index.json')) {
      return Promise.resolve({ ok: true, json: async () => ({ 'tok-5': 3 }) })
    }
    return Promise.resolve({ ok: true, json: async () => ({ '5': stats }) })
  })
  vi.stubGlobal('fetch', fetchMock)
  data._resetCache()

  await expect(data.loadProjectMarketStats('tok-5', 5)).resolves.toEqual(stats)
  expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('market/stats-003.json'))).toBe(true)
})

test('loadProjectMarketStats returns null for an unknown project', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
  vi.stubGlobal('fetch', fetchMock)
  data._resetCache()

  await expect(data.loadProjectMarketStats('nope', 999)).resolves.toBeNull()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/data.test.ts -t loadProjectMarketStats`
Expected: FAIL — `data.loadProjectMarketStats is not a function`.

- [ ] **Step 3: Implement the loader**

Add to `src/lib/types.ts`:

```typescript
/** Per-project market history, in mutez. Divide by 1e6 for tez. */
export interface MarketStats {
  pv: number
  pn: number
  sv: number
  sn: number
  floor: number | null
  med: number | null
  hi: number | null
  lo: number | null
  listed: number
}
```

In `src/lib/data.ts`, extend the type import to include `MarketStats` and add:

```typescript
/** Market stats sharded to mirror `tokens/index-NNN.json`. */
const loadMarketShard = (i: number) =>
  getJson<Record<string, MarketStats | null>>(`market/stats-${String(i).padStart(3, '0')}.json`)

/**
 * A project's trading history, or null if it never traded.
 *
 * Loaded only when a project page opens: the full market data is 3 MB across 28
 * shards, and no other view needs a figure from it.
 */
export async function loadProjectMarketStats(
  slug: string,
  projectId: number,
): Promise<MarketStats | null> {
  const shardIdx = await shardIndexForSlug(slug)
  if (shardIdx === undefined) return null
  const shard = await loadMarketShard(shardIdx)
  return shard[String(projectId)] ?? null
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/data.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing page test**

Append to `src/pages/TokenPage.test.tsx`:

```tsx
test('shows historical sales in tez, and never a floor price', async () => {
  vi.spyOn(data, 'loadProjectMarketStats').mockResolvedValue({
    pv: 1_000_000, pn: 10, sv: 2_500_000, sn: 4,
    floor: 48_000_000, med: null, hi: 900_000, lo: 1, listed: 12,
  })
  renderAt('/token/tok-5')
  // 1 tez primary + 2.5 tez secondary
  expect(await screen.findByText(/3\.5 tez/)).toBeTruthy()
  expect(screen.getByText(/0\.9 tez/)).toBeTruthy()
  // Floor and listings describe a market that no longer exists.
  expect(screen.queryByText(/floor/i)).toBeNull()
  expect(screen.queryByText(/listed/i)).toBeNull()
})

test('says nothing about sales when a project never traded', async () => {
  vi.spyOn(data, 'loadProjectMarketStats').mockResolvedValue(null)
  renderAt('/token/tok-5')
  await screen.findByText('Tok 5')
  expect(screen.queryByText(/tez/i)).toBeNull()
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/pages/TokenPage.test.tsx -t tez`
Expected: FAIL — no such text rendered.

- [ ] **Step 7: Render the figures**

In `src/pages/TokenPage.tsx`, add the import:

```tsx
import { loadProjectMarketStats } from '../lib/data'
```

(If the file already imports named bindings from `../lib/data`, add `loadProjectMarketStats` to that existing import instead of writing a second one.)

Add state and loading beside the page's other effects, where `token` is the loaded project:

```tsx
  const [market, setMarket] = useState<MarketStats | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    loadProjectMarketStats(token.slug, token.id).then(
      (m) => { if (!cancelled) setMarket(m) },
      () => { if (!cancelled) setMarket(null) },
    )
    return () => { cancelled = true }
  }, [token])
```

Import the type alongside the existing type import:

```tsx
import type { MarketStats } from '../lib/types'
```

Add this helper above the component:

```tsx
const tez = (mutez: number) => `${(mutez / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })} tez`
```

Render it in the hero column, immediately after the existing tags line:

```tsx
          {market && market.pv + market.sv > 0 && (
            <p className="muted">
              {tez(market.pv + market.sv)} traded
              {market.hi != null && market.hi > 0 && ` · highest sale ${tez(market.hi)}`}
            </p>
          )}
```

The surrounding block currently reads:

```tsx
          <p className="muted">
            edition of {project.supply}
            {iterations && iterations.length > 0 && ` · ${iterations.length} iterations loaded`}
          </p>
          {project.tags.length > 0 && <p className="muted">{project.tags.join(', ')}</p>}
```

Using the same `muted` class as edition size and tags is the point: it puts sales at
exactly the weight of the other facts rather than featuring them.

Do not render `floor`, `med`, `lo`, or `listed`.

Note that the render body refers to the project as `project` (`const project = state.token`),
while the effects above use `token`. Use `token` in the effect and `market` in the JSX.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx vitest run src/pages/TokenPage.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/types.ts src/lib/data.ts src/lib/data.test.ts src/pages/TokenPage.tsx src/pages/TokenPage.test.tsx
git commit -m "feat: show historical sales on project pages"
```

---

### Task 10: Full verification

**Files:** none changed unless a failure is found.

- [ ] **Step 1: Run the whole suite**

Run: `npm test`
Expected: PASS. The suite was 134 tests before this plan and should now be roughly 160.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds. Note the reported `dist` size — it must stay under 1 GB for GitHub Pages, and was about 831 MB before this work.

- [ ] **Step 4: Check the app by hand**

Run: `npm run dev`, then confirm:
- `/` shows the landing page with counts, coverage bar, curve, and both strips
- `/artwork` shows the grid, defaulting to Random
- reloading `/artwork` gives a different order
- typing in search does not reshuffle the results
- "Most collected" puts well-known projects first
- "Fully archived only" narrows the grid, and those cards carry the Offline badge
- a project page shows Traded and Highest sale, and no floor or listing count

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found in end-to-end verification"
```
