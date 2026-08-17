# fxhash Static Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A read-only static SPA on GitHub Pages that browses the full fxhash catalog from a committed JSON snapshot, with iterations served live from TzKT and art from IPFS.

**Architecture:** Three data tiers. Tier 1: a Node snapshot script pulls the project catalog + artist profiles from fxhash's GraphQL API into sharded JSON committed under `public/data/` (fxhash API is used ONLY at snapshot time, never at runtime). Tier 2: iterations are fetched at runtime from TzKT (independent Tezos indexer) by joining on `metadata.generatorUri`. Tier 3: images and generator code load from IPFS via a gateway-fallback chain.

**Tech Stack:** Vite + React 18 + TypeScript, react-router-dom (HashRouter), Vitest + @testing-library/react (jsdom), plain Node 20+ ESM for the snapshot script (global `fetch`), GitHub Actions for deploy + weekly re-snapshot.

**Spec:** `docs/superpowers/specs/2026-08-17-fxhash-viewer-design.md`

## Global Constraints

- Node 20+; npm; all scripts are ESM (`.mjs` or `"type": "module"` semantics via Vite for `src/`).
- fxhash GraphQL endpoint: `https://api.fxhash.xyz/graphql`. Page size hard cap: **`take` must be ≤ 50** (verified). Deterministic paging: `sort: { mintOpensAt: "ASC" }` with **string** values `"ASC"`/`"DESC"` (verified; there is NO id sort field).
- fxhash API calls are allowed **only** in `scripts/` — nothing under `src/` may reference `api.fxhash.xyz`.
- TzKT REST base: `https://api.tzkt.io/v1`. Gentk contracts: v1 `KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE`, v2 `KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr`.
- IPFS gateway order: `https://ipfs.io/ipfs/`, `https://dweb.link/ipfs/`, `https://cloudflare-ipfs.com/ipfs/`. Gateway conversion MUST preserve path and query string (artifactUri carries `?fxhash=...&fxparams=...`).
- Snapshot shard size: 1000 tokens per shard; shard filenames `index-000.json` (zero-padded to 3).
- Hidden moderation flags (not rendered by default): `MALICIOUS`, `HIDDEN`, `REPORTED`, `AUTO_DETECT_COPY`.
- Vite `base: './'`; routing is hash-based (`createHashRouter`) — GitHub Pages cannot rewrite deep links.
- Live artwork rendering only ever inside `<iframe sandbox="allow-scripts">` (no `allow-same-origin`).
- Commit messages end with the Co-Authored-By line per user's global config.

## File Structure

```
package.json / vite.config.ts / tsconfig.json / index.html / .gitignore
scripts/snapshot-lib.mjs        pure transforms (unit-tested, no I/O)
scripts/snapshot-lib.test.mjs
scripts/snapshot.mjs            CLI: fetch pages, apply lib, write public/data/
public/data/                    committed snapshot output (Task 3)
src/main.tsx                    bootstrap + router
src/styles.css                  minimal global styles
src/lib/types.ts                shared interfaces
src/lib/ipfs.ts (+.test.ts)     ipfs:// → gateway URL helper
src/lib/data.ts (+.test.ts)     Tier-1 snapshot loader (cached fetches)
src/lib/tzkt.ts (+.test.ts)     Tier-2 iteration queries
src/components/Layout.tsx       header/nav shell
src/components/IpfsImage.tsx    img with gateway-fallback chain
src/components/TokenCard.tsx    grid card for one project
src/pages/BrowsePage.tsx (+.test.tsx)
src/pages/TokenPage.tsx
src/pages/IterationPage.tsx
src/pages/ArtistsPage.tsx
src/pages/ArtistPage.tsx
src/pages/NotFoundPage.tsx
.github/workflows/deploy.yml    build + Pages deploy on push to master
.github/workflows/snapshot.yml  weekly cron re-snapshot + commit
README.md
```

Task order note: Tasks 1–3 produce the committed snapshot. **The fxhash API can die any day; do these first and do not reorder them later.**

---

### Task 1: Project scaffold (Vite + React + TS + Vitest)

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/App.test.tsx`

**Interfaces:**
- Consumes: nothing (first code task).
- Produces: working `npm run dev` / `npm run build` / `npm test`; `src/App.tsx` default export `App(): JSX.Element` (replaced by router in Task 7).

- [ ] **Step 1: Write config + entry files** (scaffold by hand — `npm create vite` is interactive in a non-empty dir)

`.gitignore`:
```
node_modules/
dist/
```

`package.json`:
```json
{
  "name": "fxhash-viewer",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "snapshot": "node scripts/snapshot.mjs"
  }
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'jsdom' },
})
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>fxhash viewer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.tsx`:
```tsx
export default function App() {
  return <h1>fxhash viewer</h1>
}
```

`src/styles.css`:
```css
:root { color-scheme: dark; font-family: system-ui, sans-serif; }
body { margin: 0; background: #111; color: #eee; }
a { color: #9ecbff; text-decoration: none; }
img { max-width: 100%; }
```

- [ ] **Step 2: Install dependencies**

Run: `npm install react react-dom react-router-dom` then
`npm install -D vite @vitejs/plugin-react typescript vitest jsdom @testing-library/react @types/react @types/react-dom`

- [ ] **Step 3: Write a smoke test** — `src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import App from './App'

test('renders app title', () => {
  render(<App />)
  expect(screen.getByText('fxhash viewer')).toBeTruthy()
})
```

- [ ] **Step 4: Run tests and build**

Run: `npm test` — expect 1 passed. Run: `npm run build` — expect `dist/` produced without errors.

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "feat: scaffold Vite + React + TS + Vitest app"
```

---

### Task 2: Snapshot transform library (pure functions)

**Files:**
- Create: `scripts/snapshot-lib.mjs`
- Test: `scripts/snapshot-lib.test.mjs`

**Interfaces:**
- Consumes: raw fxhash `generativeTokens` records (shape shown in test fixture below).
- Produces (all pure, used by Task 3):
  - `leanToken(raw) -> LeanToken` (author reduced to `{id,name,avatarUri}`, no description)
  - `shardTokens(tokens, size=1000) -> LeanToken[][]`
  - `buildSlugIndex(shards) -> Record<slug, shardIndex>`
  - `buildArtists(rawTokens) -> Artist[]` sorted by tokenCount desc (`{id,name,avatarUri,description,tokenCount}`)
  - `buildTokensMap(tokens) -> Record<authorId, tokenId[]>`
  - `buildMeta(tokens, shardCount, generatedAt) -> {generatedAt,tokenCount,shardCount,shardSize}`

- [ ] **Step 1: Write failing tests** — `scripts/snapshot-lib.test.mjs`:
```js
import { test, expect } from 'vitest'
import { leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta } from './snapshot-lib.mjs'

const raw = (id, over = {}) => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN',
  supply: 10, iterationsCount: 5, createdAt: '2022-01-01T00:00:00.000Z',
  mintOpensAt: '2022-01-01T00:00:00.000Z',
  thumbnailUri: 'ipfs://thumb', displayUri: 'ipfs://disp', generativeUri: 'ipfs://gen',
  tags: ['a'], author: { id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio' },
  ...over,
})

test('leanToken keeps fields, drops author description', () => {
  const t = leanToken(raw(1))
  expect(t.slug).toBe('tok-1')
  expect(t.author).toEqual({ id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av' })
})

test('leanToken tolerates nulls (old/collab tokens)', () => {
  const t = leanToken(raw(2, { tags: null, author: null, thumbnailUri: null, flag: null }))
  expect(t.tags).toEqual([])
  expect(t.author).toBeNull()
  expect(t.thumbnailUri).toBeNull()
  expect(t.flag).toBe('NONE')
})

test('shardTokens splits into fixed-size shards', () => {
  const shards = shardTokens([1, 2, 3, 4, 5].map((i) => leanToken(raw(i))), 2)
  expect(shards.map((s) => s.length)).toEqual([2, 2, 1])
})

test('buildSlugIndex maps slug to shard index', () => {
  const shards = shardTokens([1, 2, 3].map((i) => leanToken(raw(i))), 2)
  expect(buildSlugIndex(shards)).toEqual({ 'tok-1': 0, 'tok-2': 0, 'tok-3': 1 })
})

test('buildArtists aggregates by author, sorted by tokenCount desc', () => {
  const tokens = [raw(1), raw(2), raw(3, { author: { id: 'tz1x', name: 'Bob', avatarUri: null, description: null } })]
  const artists = buildArtists([...tokens, raw(4, { author: null })])
  expect(artists).toEqual([
    { id: 'tz1abc', name: 'Alice', avatarUri: 'ipfs://av', description: 'bio', tokenCount: 2 },
    { id: 'tz1x', name: 'Bob', avatarUri: null, description: null, tokenCount: 1 },
  ])
})

test('buildTokensMap maps author id to token ids', () => {
  const tokens = [1, 2].map((i) => leanToken(raw(i)))
  expect(buildTokensMap(tokens)).toEqual({ tz1abc: [1, 2] })
})

test('buildMeta summarizes snapshot', () => {
  expect(buildMeta([leanToken(raw(1))], 1, 'T')).toEqual({ generatedAt: 'T', tokenCount: 1, shardCount: 1, shardSize: 1000 })
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run scripts/snapshot-lib.test.mjs` → FAIL (module not found).

- [ ] **Step 3: Implement** — `scripts/snapshot-lib.mjs`:
```js
export const SHARD_SIZE = 1000

export function leanToken(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    flag: raw.flag ?? 'NONE',
    supply: raw.supply ?? 0,
    iterationsCount: raw.iterationsCount ?? 0,
    createdAt: raw.createdAt ?? null,
    mintOpensAt: raw.mintOpensAt ?? null,
    thumbnailUri: raw.thumbnailUri ?? null,
    displayUri: raw.displayUri ?? null,
    generativeUri: raw.generativeUri ?? null,
    tags: raw.tags ?? [],
    author: raw.author
      ? { id: raw.author.id, name: raw.author.name ?? null, avatarUri: raw.author.avatarUri ?? null }
      : null,
  }
}

export function shardTokens(tokens, size = SHARD_SIZE) {
  const shards = []
  for (let i = 0; i < tokens.length; i += size) shards.push(tokens.slice(i, i + size))
  return shards
}

export function buildSlugIndex(shards) {
  const index = {}
  shards.forEach((shard, i) => shard.forEach((t) => { index[t.slug] = i }))
  return index
}

export function buildArtists(rawTokens) {
  const byId = new Map()
  for (const t of rawTokens) {
    const a = t.author
    if (!a) continue
    const cur = byId.get(a.id) ?? {
      id: a.id, name: a.name ?? null, avatarUri: a.avatarUri ?? null,
      description: a.description ?? null, tokenCount: 0,
    }
    cur.tokenCount += 1
    byId.set(a.id, cur)
  }
  return [...byId.values()].sort((x, y) => y.tokenCount - x.tokenCount)
}

export function buildTokensMap(tokens) {
  const map = {}
  for (const t of tokens) {
    if (!t.author) continue
    ;(map[t.author.id] ??= []).push(t.id)
  }
  return map
}

export function buildMeta(tokens, shardCount, generatedAt) {
  return { generatedAt, tokenCount: tokens.length, shardCount, shardSize: SHARD_SIZE }
}
```

- [ ] **Step 4: Run tests** — `npx vitest run scripts/snapshot-lib.test.mjs` → 7 passed.

- [ ] **Step 5: Commit**
```bash
git add scripts/
git commit -m "feat: snapshot transform library"
```

---

### Task 3: Snapshot CLI — fetch and COMMIT THE DATA (time-critical)

**Files:**
- Create: `scripts/snapshot.mjs`
- Create (generated): `public/data/**`

**Interfaces:**
- Consumes: everything from `scripts/snapshot-lib.mjs`.
- Produces: committed snapshot at `public/data/` — `meta.json`, `tokens/index-NNN.json`, `tokens/slug-index.json`, `artists/index.json`, `artists/tokens-map.json`. Task 5 reads these paths verbatim.

- [ ] **Step 1: Implement the CLI** — `scripts/snapshot.mjs` (I/O layer; logic already tested in Task 2, so no new unit tests — the smoke run in Step 2 is the test):
```js
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leanToken, shardTokens, buildSlugIndex, buildArtists, buildTokensMap, buildMeta } from './snapshot-lib.mjs'

const ENDPOINT = 'https://api.fxhash.xyz/graphql'
const TAKE = 50 // API hard cap
const DELAY_MS = 100

const QUERY = `query ($skip: Int!, $take: Int!) {
  generativeTokens(skip: $skip, take: $take, sort: { mintOpensAt: "ASC" }) {
    id slug name flag supply iterationsCount createdAt mintOpensAt
    thumbnailUri displayUri generativeUri tags
    author { id name avatarUri description }
  }
}`

const args = process.argv.slice(2)
const limitArg = args.indexOf('--limit')
const LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity
const outArg = args.indexOf('--out')
const OUT = outArg >= 0 ? args[outArg + 1] : 'public/data'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchPage(skip, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { skip, take: TAKE } }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300))
    return json.data.generativeTokens
  } catch (err) {
    if (attempt >= 4) throw err
    console.warn(`skip=${skip} attempt ${attempt} failed (${err.message}); retrying`)
    await sleep(1000 * 2 ** attempt)
    return fetchPage(skip, attempt + 1)
  }
}

const seen = new Set()
const rawTokens = []
for (let skip = 0; rawTokens.length < LIMIT; skip += TAKE) {
  const page = await fetchPage(skip)
  for (const t of page) if (!seen.has(t.id)) { seen.add(t.id); rawTokens.push(t) }
  if (skip % 2000 === 0) console.log(`fetched ${rawTokens.length}...`)
  if (page.length < TAKE) break
  await sleep(DELAY_MS)
}

const tokens = rawTokens.slice(0, LIMIT).map(leanToken)
const shards = shardTokens(tokens)
const writeJson = (p, v) => writeFile(join(OUT, p), JSON.stringify(v))

await mkdir(join(OUT, 'tokens'), { recursive: true })
await mkdir(join(OUT, 'artists'), { recursive: true })
await Promise.all(shards.map((s, i) => writeJson(`tokens/index-${String(i).padStart(3, '0')}.json`, s)))
await writeJson('tokens/slug-index.json', buildSlugIndex(shards))
await writeJson('artists/index.json', buildArtists(rawTokens.slice(0, LIMIT)))
await writeJson('artists/tokens-map.json', buildTokensMap(tokens))
await writeJson('meta.json', buildMeta(tokens, shards.length, new Date().toISOString()))
console.log(`DONE: ${tokens.length} tokens, ${shards.length} shards -> ${OUT}`)
```

- [ ] **Step 2: Smoke test with a small limit**

Run: `node scripts/snapshot.mjs --limit 120`
Expected: `DONE: 120 tokens, 1 shards -> public/data`. Open `public/data/tokens/index-000.json` and verify records have `slug`, `thumbnailUri`, `author`. Verify `meta.json` says `tokenCount: 120`.

- [ ] **Step 3: Full run** (~650 requests; 5–10 minutes — use a 600000ms tool timeout or run in background)

Run: `node scripts/snapshot.mjs`
Expected: `DONE: ~32000 tokens, ~32 shards`. Sanity-check: `meta.json` tokenCount ≥ 30000; total size of `public/data/` roughly 10–25 MB.

- [ ] **Step 4: Commit the snapshot immediately** (this is the irreplaceable artifact)
```bash
git add scripts/snapshot.mjs public/data
git commit -m "feat: snapshot CLI + full fxhash catalog snapshot"
```

- [ ] **Step 5: Push to GitHub NOW if a remote exists** — if the user has created the GitHub repo already, `git push`; otherwise flag to the user that the snapshot exists only locally until pushed.

---

### Task 4: IPFS gateway helper

**Files:**
- Create: `src/lib/ipfs.ts`
- Test: `src/lib/ipfs.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `GATEWAYS: string[]`; `ipfsToHttp(uri: string | null | undefined, gatewayIndex?: number): string | null`. Used by IpfsImage (Task 8), IterationPage (Task 10), and any avatar rendering.

- [ ] **Step 1: Write failing tests** — `src/lib/ipfs.test.ts`:
```ts
import { test, expect } from 'vitest'
import { ipfsToHttp, GATEWAYS } from './ipfs'

test('converts ipfs:// to first gateway by default', () => {
  expect(ipfsToHttp('ipfs://QmAbC')).toBe('https://ipfs.io/ipfs/QmAbC')
})

test('preserves path and query string (artifactUri case)', () => {
  expect(ipfsToHttp('ipfs://QmAbC/?fxhash=oo123&fxparams=0xff')).toBe(
    'https://ipfs.io/ipfs/QmAbC/?fxhash=oo123&fxparams=0xff',
  )
})

test('selects gateway by index, clamping to last', () => {
  expect(ipfsToHttp('ipfs://QmAbC', 1)).toBe('https://dweb.link/ipfs/QmAbC')
  expect(ipfsToHttp('ipfs://QmAbC', 99)).toBe(GATEWAYS[GATEWAYS.length - 1] + 'QmAbC')
})

test('passes through non-ipfs URIs and handles null', () => {
  expect(ipfsToHttp('https://example.com/x.png')).toBe('https://example.com/x.png')
  expect(ipfsToHttp(null)).toBeNull()
  expect(ipfsToHttp(undefined)).toBeNull()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/ipfs.test.ts` → FAIL.

- [ ] **Step 3: Implement** — `src/lib/ipfs.ts`:
```ts
export const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
]

export function ipfsToHttp(uri: string | null | undefined, gatewayIndex = 0): string | null {
  if (!uri) return null
  if (!uri.startsWith('ipfs://')) return uri
  const i = Math.min(gatewayIndex, GATEWAYS.length - 1)
  return GATEWAYS[i] + uri.slice('ipfs://'.length)
}
```

- [ ] **Step 4: Run tests** — `npx vitest run src/lib/ipfs.test.ts` → 4 passed.

- [ ] **Step 5: Commit**
```bash
git add src/lib/ipfs.ts src/lib/ipfs.test.ts
git commit -m "feat: ipfs gateway helper"
```

---

### Task 5: Types + Tier-1 snapshot data loader

**Files:**
- Create: `src/lib/types.ts`, `src/lib/data.ts`
- Test: `src/lib/data.test.ts`

**Interfaces:**
- Consumes: JSON files written by Task 3 (paths under `BASE_URL + 'data/'`).
- Produces (used by all pages):
  - types `LeanToken`, `LeanAuthor`, `Artist`, `SnapshotMeta`
  - `loadMeta(): Promise<SnapshotMeta>`; `loadShard(i: number): Promise<LeanToken[]>`; `loadAllTokens(): Promise<LeanToken[]>`; `findTokenBySlug(slug: string): Promise<LeanToken | null>`; `loadArtists(): Promise<Artist[]>`; `loadTokensMap(): Promise<Record<string, number[]>>`; `isVisible(t: LeanToken): boolean`

- [ ] **Step 1: Write types** — `src/lib/types.ts`:
```ts
export interface LeanAuthor {
  id: string
  name: string | null
  avatarUri: string | null
}

export interface LeanToken {
  id: number
  slug: string
  name: string
  flag: string
  supply: number
  iterationsCount: number
  createdAt: string | null
  mintOpensAt: string | null
  thumbnailUri: string | null
  displayUri: string | null
  generativeUri: string | null
  tags: string[]
  author: LeanAuthor | null
}

export interface Artist {
  id: string
  name: string | null
  avatarUri: string | null
  description: string | null
  tokenCount: number
}

export interface SnapshotMeta {
  generatedAt: string
  tokenCount: number
  shardCount: number
  shardSize: number
}
```

- [ ] **Step 2: Write failing tests** — `src/lib/data.test.ts`:
```ts
import { test, expect, vi, beforeEach } from 'vitest'
import { loadMeta, loadShard, findTokenBySlug, isVisible, _resetCache } from './data'
import type { LeanToken } from './types'

const tok = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: 1, iterationsCount: 1,
  createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null,
  generativeUri: null, tags: [], author: null, ...over,
})

const routes: Record<string, unknown> = {
  'meta.json': { generatedAt: 'T', tokenCount: 3, shardCount: 2, shardSize: 2 },
  'tokens/index-000.json': [tok(1), tok(2)],
  'tokens/index-001.json': [tok(3)],
  'tokens/slug-index.json': { 'tok-1': 0, 'tok-2': 0, 'tok-3': 1 },
}

beforeEach(() => {
  _resetCache()
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const key = Object.keys(routes).find((k) => String(url).endsWith(k))
    if (!key) return { ok: false, status: 404 } as Response
    return { ok: true, json: async () => routes[key] } as Response
  }))
})

test('loadMeta fetches and caches', async () => {
  expect((await loadMeta()).shardCount).toBe(2)
  await loadMeta()
  expect(vi.mocked(fetch).mock.calls.length).toBe(1)
})

test('loadShard pads shard number', async () => {
  const shard = await loadShard(1)
  expect(shard[0].id).toBe(3)
  expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain('index-001.json')
})

test('findTokenBySlug resolves via slug index; null when missing', async () => {
  expect((await findTokenBySlug('tok-3'))?.id).toBe(3)
  expect(await findTokenBySlug('nope')).toBeNull()
})

test('isVisible hides moderated flags', () => {
  expect(isVisible(tok(1))).toBe(true)
  expect(isVisible(tok(1, { flag: 'MALICIOUS' }))).toBe(false)
  expect(isVisible(tok(1, { flag: 'REPORTED' }))).toBe(false)
})
```

- [ ] **Step 3: Run to verify failure** — `npx vitest run src/lib/data.test.ts` → FAIL.

- [ ] **Step 4: Implement** — `src/lib/data.ts`:
```ts
import type { LeanToken, Artist, SnapshotMeta } from './types'

const BASE = `${import.meta.env.BASE_URL}data/`
const HIDDEN_FLAGS = new Set(['MALICIOUS', 'HIDDEN', 'REPORTED', 'AUTO_DETECT_COPY'])

export const isVisible = (t: LeanToken) => !HIDDEN_FLAGS.has(t.flag)

let cache = new Map<string, Promise<unknown>>()

/** Test hook — clears memoized fetches. */
export const _resetCache = () => { cache = new Map() }

function getJson<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    cache.set(path, fetch(BASE + path).then((res) => {
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
      return res.json()
    }))
  }
  return cache.get(path) as Promise<T>
}

export const loadMeta = () => getJson<SnapshotMeta>('meta.json')
export const loadShard = (i: number) =>
  getJson<LeanToken[]>(`tokens/index-${String(i).padStart(3, '0')}.json`)
export const loadArtists = () => getJson<Artist[]>('artists/index.json')
export const loadTokensMap = () => getJson<Record<string, number[]>>('artists/tokens-map.json')

export async function loadAllTokens(): Promise<LeanToken[]> {
  const meta = await loadMeta()
  const shards = await Promise.all(Array.from({ length: meta.shardCount }, (_, i) => loadShard(i)))
  return shards.flat()
}

export async function findTokenBySlug(slug: string): Promise<LeanToken | null> {
  const index = await getJson<Record<string, number>>('tokens/slug-index.json')
  const shardIdx = index[slug]
  if (shardIdx === undefined) return null
  const shard = await loadShard(shardIdx)
  return shard.find((t) => t.slug === slug) ?? null
}
```

- [ ] **Step 5: Run tests** — `npx vitest run src/lib/data.test.ts` → 4 passed.

- [ ] **Step 6: Commit**
```bash
git add src/lib/types.ts src/lib/data.ts src/lib/data.test.ts
git commit -m "feat: tier-1 snapshot data loader"
```

---

### Task 6: TzKT iteration client (Tier 2)

**Files:**
- Create: `src/lib/tzkt.ts`
- Test: `src/lib/tzkt.test.ts`

**Interfaces:**
- Consumes: a project's `generativeUri` (from `LeanToken`).
- Produces (used by TokenPage and IterationPage):
  - `interface Iteration { contract: string; tokenId: string; name: string | null; iterationHash: string | null; artifactUri: string | null; displayUri: string | null; thumbnailUri: string | null; attributes: { name: string; value: unknown }[]; minter: string | null }`
  - `fetchIterations(generativeUri: string, offset?: number, limit?: number): Promise<Iteration[]>`
  - `fetchIteration(contract: string, tokenId: string): Promise<Iteration | null>`

- [ ] **Step 1: Write failing tests** — `src/lib/tzkt.test.ts`:
```ts
import { test, expect, vi, beforeEach } from 'vitest'
import { fetchIterations, fetchIteration, GENTK_CONTRACTS } from './tzkt'

const row = (tokenId: string) => ({
  tokenId,
  firstMinter: { address: 'tz1minter', alias: 'Minter' },
  metadata: {
    name: `Piece #${tokenId}`,
    iterationHash: `oo${tokenId}`,
    artifactUri: `ipfs://QmGen/?fxhash=oo${tokenId}`,
    displayUri: 'ipfs://QmDisp',
    thumbnailUri: 'ipfs://QmThumb',
    attributes: [{ name: 'Palette', value: 'Warm' }],
  },
})

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const u = String(url)
    // Only the v2 contract "owns" this project in the mock
    const rows = u.includes(GENTK_CONTRACTS[1]) && u.includes('generatorUri') ? [row('7')] : []
    if (u.includes('tokenId=7')) return { ok: true, json: async () => [row('7')] } as Response
    return { ok: true, json: async () => rows } as Response
  }))
})

test('fetchIterations queries both contracts and merges', async () => {
  const iters = await fetchIterations('ipfs://QmGen')
  expect(iters).toHaveLength(1)
  expect(iters[0]).toMatchObject({
    contract: GENTK_CONTRACTS[1],
    tokenId: '7',
    iterationHash: 'oo7',
    minter: 'Minter',
    attributes: [{ name: 'Palette', value: 'Warm' }],
  })
})

test('fetchIterations URL filters by generatorUri and pages', async () => {
  await fetchIterations('ipfs://QmGen', 48, 24)
  const urls = vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
  expect(urls.some((u) => u.includes('metadata.generatorUri=ipfs%3A%2F%2FQmGen'))).toBe(true)
  expect(urls.some((u) => u.includes('offset=48') && u.includes('limit=24'))).toBe(true)
})

test('fetchIteration returns single token or null', async () => {
  const it = await fetchIteration(GENTK_CONTRACTS[1], '7')
  expect(it?.name).toBe('Piece #7')
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] }) as unknown as Response))
  expect(await fetchIteration(GENTK_CONTRACTS[1], '999')).toBeNull()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/tzkt.test.ts` → FAIL.

- [ ] **Step 3: Implement** — `src/lib/tzkt.ts`:
```ts
const TZKT = 'https://api.tzkt.io/v1'

/** gentk v1, gentk v2 — a project's iterations live on exactly one of these. */
export const GENTK_CONTRACTS = [
  'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE',
  'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr',
]

export interface Iteration {
  contract: string
  tokenId: string
  name: string | null
  iterationHash: string | null
  artifactUri: string | null
  displayUri: string | null
  thumbnailUri: string | null
  attributes: { name: string; value: unknown }[]
  minter: string | null
}

interface TzktRow {
  tokenId: string
  firstMinter?: { address?: string; alias?: string }
  metadata?: Record<string, unknown>
}

function toIteration(contract: string, row: TzktRow): Iteration {
  const md = (row.metadata ?? {}) as Record<string, any>
  return {
    contract,
    tokenId: row.tokenId,
    name: md.name ?? null,
    iterationHash: md.iterationHash ?? null,
    artifactUri: md.artifactUri ?? null,
    displayUri: md.displayUri ?? null,
    thumbnailUri: md.thumbnailUri ?? null,
    attributes: Array.isArray(md.attributes) ? md.attributes : [],
    minter: row.firstMinter?.alias ?? row.firstMinter?.address ?? null,
  }
}

async function getRows(url: string): Promise<TzktRow[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TzKT: HTTP ${res.status}`)
  return res.json()
}

export async function fetchIterations(generativeUri: string, offset = 0, limit = 48): Promise<Iteration[]> {
  const uri = encodeURIComponent(generativeUri)
  const results = await Promise.all(
    GENTK_CONTRACTS.map(async (contract) => {
      const url =
        `${TZKT}/tokens?contract=${contract}&metadata.generatorUri=${uri}` +
        `&offset=${offset}&limit=${limit}&select=tokenId,firstMinter,metadata`
      return (await getRows(url)).map((r) => toIteration(contract, r))
    }),
  )
  return results.flat()
}

export async function fetchIteration(contract: string, tokenId: string): Promise<Iteration | null> {
  const url = `${TZKT}/tokens?contract=${contract}&tokenId=${encodeURIComponent(tokenId)}&select=tokenId,firstMinter,metadata`
  const rows = await getRows(url)
  return rows.length ? toIteration(contract, rows[0]) : null
}
```

- [ ] **Step 4: Run tests** — `npx vitest run src/lib/tzkt.test.ts` → 3 passed.

- [ ] **Step 5: One-off live sanity check** (manual, not a committed test): run `npx vitest run` to confirm nothing broke, then verify against real TzKT with:
`curl "https://api.tzkt.io/v1/tokens?contract=KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr&metadata.generatorUri=ipfs%3A%2F%2FQmNetgRYXjGDXkEBYid64SXJvuRc4STLzmH2ZCB91mqAf6&limit=2&select=tokenId,metadata"`
Expected: 2 JSON rows with `iterationHash`.

- [ ] **Step 6: Commit**
```bash
git add src/lib/tzkt.ts src/lib/tzkt.test.ts
git commit -m "feat: tzkt iteration client"
```

---

### Task 7: App shell, hash router, layout, 404

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx`
- Create: `src/components/Layout.tsx`, `src/pages/NotFoundPage.tsx`
- Create (placeholders replaced by later tasks): `src/pages/BrowsePage.tsx`, `src/pages/TokenPage.tsx`, `src/pages/IterationPage.tsx`, `src/pages/ArtistsPage.tsx`, `src/pages/ArtistPage.tsx`

**Interfaces:**
- Consumes: page components (placeholder `<h2>` stubs for now).
- Produces: route table used by all later tasks — `#/`, `#/token/:slug`, `#/gentk/:contract/:tokenId`, `#/artists`, `#/artist/:id`, wildcard → NotFound. Layout renders `<Outlet />`.

- [ ] **Step 1: Update the smoke test** — replace `src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import App from './App'

test('renders nav and browse route by default', () => {
  window.location.hash = '#/'
  render(<App />)
  expect(screen.getByRole('link', { name: 'fxhash viewer' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artists' })).toBeTruthy()
})

test('unknown route renders not-found', () => {
  window.location.hash = '#/definitely/not/a/route'
  render(<App />)
  expect(screen.getByText(/not found/i)).toBeTruthy()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/App.test.tsx` → FAIL.

- [ ] **Step 3: Implement.** Each placeholder page (BrowsePage, TokenPage, IterationPage, ArtistsPage, ArtistPage) is, until its own task replaces it:
```tsx
export default function BrowsePage() {
  return <h2>Browse</h2>
}
```
(adjust the name/text per file)

`src/pages/NotFoundPage.tsx`:
```tsx
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div>
      <h2>Not found</h2>
      <p>That page doesn't exist. <Link to="/">Back to browsing</Link>.</p>
    </div>
  )
}
```

`src/components/Layout.tsx`:
```tsx
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">fxhash viewer</Link>
        <nav>
          <Link to="/artists">Artists</Link>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        Unofficial read-only archive viewer. Data: snapshot + TzKT + IPFS.
      </footer>
    </>
  )
}
```

`src/App.tsx`:
```tsx
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import BrowsePage from './pages/BrowsePage'
import TokenPage from './pages/TokenPage'
import IterationPage from './pages/IterationPage'
import ArtistsPage from './pages/ArtistsPage'
import ArtistPage from './pages/ArtistPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <BrowsePage /> },
      { path: '/token/:slug', element: <TokenPage /> },
      { path: '/gentk/:contract/:tokenId', element: <IterationPage /> },
      { path: '/artists', element: <ArtistsPage /> },
      { path: '/artist/:id', element: <ArtistPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

Append to `src/styles.css`:
```css
.site-header { display: flex; gap: 1.5rem; align-items: baseline; padding: 1rem 1.5rem; border-bottom: 1px solid #333; }
.brand { font-weight: 700; color: #fff; }
.site-main { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
.site-footer { padding: 1rem 1.5rem; color: #888; font-size: 0.85rem; border-top: 1px solid #333; margin-top: 3rem; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all pass (2 App tests + earlier suites).

- [ ] **Step 5: Commit**
```bash
git add src/
git commit -m "feat: app shell with hash routing and layout"
```

---

### Task 8: Browse page + shared grid components

**Files:**
- Create: `src/components/IpfsImage.tsx`, `src/components/TokenCard.tsx`
- Modify: `src/pages/BrowsePage.tsx`, `src/styles.css`
- Test: `src/pages/BrowsePage.test.tsx`

**Interfaces:**
- Consumes: `loadAllTokens`, `isVisible` (Task 5); `ipfsToHttp`, `GATEWAYS` (Task 4); `LeanToken` (Task 5).
- Produces: `IpfsImage({ uri, alt, className? })` — img with gateway fallback on error, gray placeholder `div.img-fallback` when exhausted or uri null; `TokenCard({ token: LeanToken })` — links to `/token/${token.slug}`. Both reused by Tasks 9–11.

- [ ] **Step 1: Write failing tests** — `src/pages/BrowsePage.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BrowsePage from './BrowsePage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const tok = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: id, iterationsCount: id,
  createdAt: null, mintOpensAt: `2022-01-0${id}T00:00:00Z`, thumbnailUri: null, displayUri: null,
  generativeUri: null, tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null }, ...over,
})

beforeEach(() => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([
    tok(1), tok(2), tok(3, { flag: 'MALICIOUS' }),
  ])
})

test('renders visible tokens newest-first, hides flagged', async () => {
  render(<MemoryRouter><BrowsePage /></MemoryRouter>)
  const cards = await screen.findAllByRole('link', { name: /Tok/ })
  expect(cards.map((c) => c.textContent)).toEqual(['Tok 2Alice', 'Tok 1Alice'])
  expect(screen.queryByText('Tok 3')).toBeNull()
})

test('search filters by name', async () => {
  render(<MemoryRouter><BrowsePage /></MemoryRouter>)
  await screen.findAllByRole('link', { name: /Tok/ })
  const { fireEvent } = await import('@testing-library/react')
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Tok 1' } })
  expect(screen.queryByText('Tok 2')).toBeNull()
  expect(screen.getByText('Tok 1')).toBeTruthy()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/pages/BrowsePage.test.tsx` → FAIL.

- [ ] **Step 3: Implement.**

`src/components/IpfsImage.tsx`:
```tsx
import { useState } from 'react'
import { ipfsToHttp, GATEWAYS } from '../lib/ipfs'

interface Props { uri: string | null; alt: string; className?: string }

export default function IpfsImage({ uri, alt, className }: Props) {
  const [gateway, setGateway] = useState(0)
  const src = ipfsToHttp(uri, gateway)
  if (!src || gateway >= GATEWAYS.length) {
    return <div className={`img-fallback ${className ?? ''}`} title={alt} />
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setGateway((g) => g + 1)}
    />
  )
}
```

`src/components/TokenCard.tsx`:
```tsx
import { Link } from 'react-router-dom'
import IpfsImage from './IpfsImage'
import type { LeanToken } from '../lib/types'

export default function TokenCard({ token }: { token: LeanToken }) {
  return (
    <Link to={`/token/${token.slug}`} className="token-card">
      <IpfsImage uri={token.thumbnailUri} alt={token.name} className="token-thumb" />
      <div className="token-name">{token.name}</div>
      <div className="token-author">{token.author?.name ?? token.author?.id ?? 'unknown'}</div>
    </Link>
  )
}
```

`src/pages/BrowsePage.tsx`:
```tsx
import { useEffect, useMemo, useState } from 'react'
import { loadAllTokens, isVisible } from '../lib/data'
import type { LeanToken } from '../lib/types'
import TokenCard from '../components/TokenCard'

const PAGE = 60
type SortMode = 'newest' | 'minted'

export default function BrowsePage() {
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('newest')
  const [shown, setShown] = useState(PAGE)

  useEffect(() => {
    loadAllTokens().then(setTokens, (e) => setError(String(e)))
  }, [])

  const visible = useMemo(() => {
    if (!tokens) return []
    const q = query.trim().toLowerCase()
    const filtered = tokens.filter(
      (t) => isVisible(t) && (!q ||
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.author?.name ?? '').toLowerCase().includes(q)),
    )
    return sort === 'minted'
      ? [...filtered].sort((a, b) => b.iterationsCount - a.iterationsCount)
      : [...filtered].reverse() // snapshot is mint-date ASC, so reverse = newest first
  }, [tokens, query, sort])

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
        <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="newest">Newest</option>
          <option value="minted">Most minted</option>
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

Append to `src/styles.css`:
```css
.token-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.token-card { display: block; background: #1a1a1a; border-radius: 8px; overflow: hidden; padding-bottom: 0.5rem; }
.token-thumb, .img-fallback { width: 100%; aspect-ratio: 1; object-fit: cover; background: #2a2a2a; display: block; }
.token-name { padding: 0.5rem 0.75rem 0; font-weight: 600; color: #fff; }
.token-author { padding: 0 0.75rem; color: #aaa; font-size: 0.85rem; }
.browse-controls { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.25rem; }
.browse-controls input { flex: 1; max-width: 360px; background: #1a1a1a; border: 1px solid #333; color: #eee; padding: 0.5rem 0.75rem; border-radius: 6px; }
.browse-controls select { background: #1a1a1a; color: #eee; border: 1px solid #333; padding: 0.5rem; border-radius: 6px; }
.count { color: #888; font-size: 0.85rem; }
.load-more { display: block; margin: 1.5rem auto; padding: 0.6rem 1.5rem; background: #222; color: #eee; border: 1px solid #444; border-radius: 6px; cursor: pointer; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all pass.

- [ ] **Step 5: Visual check** — `npm run dev`, open the printed URL. Expect the real snapshot catalog to render with thumbnails (also the first real IPFS-gateway CORS check from a browser). Note result.

- [ ] **Step 6: Commit**
```bash
git add src/
git commit -m "feat: browse page with search, sort, and ipfs image fallback"
```

---

### Task 9: Project (token) detail page with live iterations

**Files:**
- Modify: `src/pages/TokenPage.tsx`, `src/styles.css`
- Test: `src/pages/TokenPage.test.tsx`

**Interfaces:**
- Consumes: `findTokenBySlug` (Task 5), `fetchIterations`, `Iteration` (Task 6), `IpfsImage` (Task 8).
- Produces: iteration cards linking to `/gentk/${it.contract}/${it.tokenId}`.

- [ ] **Step 1: Write failing tests** — `src/pages/TokenPage.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TokenPage from './TokenPage'
import * as data from '../lib/data'
import * as tzkt from '../lib/tzkt'

const token = {
  id: 5, slug: 'tok-5', name: 'Tok 5', flag: 'CLEAN', supply: 10, iterationsCount: 2,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null,
  displayUri: 'ipfs://QmDisp', generativeUri: 'ipfs://QmGen', tags: ['geo'],
  author: { id: 'tz1a', name: 'Alice', avatarUri: null },
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(token)
})

test('renders project info and iterations from tzkt', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([
    { contract: 'KT1x', tokenId: '9', name: 'Tok 5 #1', iterationHash: 'oo9',
      artifactUri: null, displayUri: null, thumbnailUri: 'ipfs://t', attributes: [], minter: 'M' },
  ])
  renderAt('/token/tok-5')
  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByRole('link', { name: /Tok 5 #1/ }).getAttribute('href')).toContain('/gentk/KT1x/9')
})

test('shows unavailable notice when tzkt fails', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockRejectedValue(new Error('down'))
  renderAt('/token/tok-5')
  expect(await screen.findByText(/iterations unavailable/i)).toBeTruthy()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/pages/TokenPage.test.tsx` → FAIL.

- [ ] **Step 3: Implement** — `src/pages/TokenPage.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTokenBySlug } from '../lib/data'
import { fetchIterations, type Iteration } from '../lib/tzkt'
import type { LeanToken } from '../lib/types'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

const PAGE = 48

export default function TokenPage() {
  const { slug } = useParams()
  const [token, setToken] = useState<LeanToken | null | undefined>(undefined)
  const [iterations, setIterations] = useState<Iteration[] | null>(null)
  const [iterError, setIterError] = useState(false)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { findTokenBySlug(slug!).then(setToken, () => setToken(null)) }, [slug])

  useEffect(() => {
    if (!token?.generativeUri) return
    fetchIterations(token.generativeUri, offset, PAGE).then(
      (page) => {
        setIterations((prev) => [...(prev ?? []), ...page])
        if (page.length < PAGE) setDone(true)
      },
      () => setIterError(true),
    )
  }, [token, offset])

  if (token === undefined) return <p>Loading…</p>
  if (token === null) return <NotFoundPage />

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={token.displayUri ?? token.thumbnailUri} alt={token.name} className="hero-img" />
        <div>
          <h2>{token.name}</h2>
          <p>
            by{' '}
            {token.author
              ? <Link to={`/artist/${token.author.id}`}>{token.author.name ?? token.author.id}</Link>
              : 'unknown'}
          </p>
          <p className="muted">{token.iterationsCount} iterations · supply {token.supply}</p>
          {token.tags.length > 0 && <p className="muted">{token.tags.join(', ')}</p>}
        </div>
      </div>

      <h3>Iterations</h3>
      {iterError && <p>Iterations unavailable right now (TzKT unreachable). Try again later.</p>}
      {!iterError && iterations === null && <p>Loading iterations…</p>}
      {iterations && (
        <>
          <div className="token-grid">
            {iterations.map((it) => (
              <Link key={`${it.contract}-${it.tokenId}`} to={`/gentk/${it.contract}/${it.tokenId}`} className="token-card">
                <IpfsImage uri={it.thumbnailUri ?? it.displayUri} alt={it.name ?? it.tokenId} className="token-thumb" />
                <div className="token-name">{it.name ?? `#${it.tokenId}`}</div>
              </Link>
            ))}
          </div>
          {!done && (
            <button className="load-more" onClick={() => setOffset((o) => o + PAGE)}>Load more</button>
          )}
        </>
      )}
    </div>
  )
}
```

Append to `src/styles.css`:
```css
.token-hero { display: flex; gap: 1.5rem; margin-bottom: 2rem; align-items: flex-start; }
.hero-img { width: 320px; border-radius: 8px; }
.muted { color: #888; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all pass.

- [ ] **Step 5: Visual check** — `npm run dev`, click into a project from Browse; iterations should populate from live TzKT (this is the TzKT-CORS-from-browser check; dev origin differs from Pages but a CORS failure here would already be a red flag).

- [ ] **Step 6: Commit**
```bash
git add src/
git commit -m "feat: project detail page with live tzkt iterations"
```

---

### Task 10: Iteration detail page with opt-in live render

**Files:**
- Modify: `src/pages/IterationPage.tsx`, `src/styles.css`
- Test: `src/pages/IterationPage.test.tsx`

**Interfaces:**
- Consumes: `fetchIteration` (Task 6), `ipfsToHttp` (Task 4), `IpfsImage` (Task 8).
- Produces: terminal page; no downstream consumers.

- [ ] **Step 1: Write failing tests** — `src/pages/IterationPage.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import IterationPage from './IterationPage'
import * as tzkt from '../lib/tzkt'

const iteration = {
  contract: 'KT1x', tokenId: '9', name: 'Piece #9', iterationHash: 'oo9',
  artifactUri: 'ipfs://QmGen/?fxhash=oo9', displayUri: 'ipfs://QmDisp', thumbnailUri: null,
  attributes: [{ name: 'Palette', value: 'Warm' }], minter: 'Minter',
}

beforeEach(() => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(iteration)
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/gentk/KT1x/9']}>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

test('shows image, hash, traits, minter; no iframe by default', async () => {
  renderPage()
  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.getByText('oo9')).toBeTruthy()
  expect(screen.getByText(/Palette/)).toBeTruthy()
  expect(document.querySelector('iframe')).toBeNull()
})

test('run live swaps in sandboxed iframe pointing at artifactUri', async () => {
  renderPage()
  fireEvent.click(await screen.findByRole('button', { name: /run live/i }))
  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
  expect(frame.getAttribute('src')).toBe('https://ipfs.io/ipfs/QmGen/?fxhash=oo9')
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/pages/IterationPage.test.tsx` → FAIL.

- [ ] **Step 3: Implement** — `src/pages/IterationPage.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchIteration, type Iteration } from '../lib/tzkt'
import { ipfsToHttp } from '../lib/ipfs'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

export default function IterationPage() {
  const { contract, tokenId } = useParams()
  const [it, setIt] = useState<Iteration | null | undefined>(undefined)
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetchIteration(contract!, tokenId!).then(setIt, () => setIt(null))
  }, [contract, tokenId])

  if (it === undefined) return <p>Loading…</p>
  if (it === null) return <NotFoundPage />

  const liveSrc = ipfsToHttp(it.artifactUri)

  return (
    <div>
      <h2>{it.name ?? `#${it.tokenId}`}</h2>
      <div className="iteration-view">
        {live && liveSrc
          ? <iframe src={liveSrc} sandbox="allow-scripts" className="live-frame" title={it.name ?? 'artwork'} />
          : <IpfsImage uri={it.displayUri ?? it.thumbnailUri} alt={it.name ?? 'artwork'} className="iteration-img" />}
      </div>
      {liveSrc && (
        <button className="load-more" onClick={() => setLive((v) => !v)}>
          {live ? 'Show image' : 'Run live'}
        </button>
      )}
      <dl className="iteration-meta">
        <dt>Hash</dt><dd><code>{it.iterationHash ?? 'unknown'}</code></dd>
        <dt>Minted by</dt><dd>{it.minter ?? 'unknown'}</dd>
        {it.attributes.map((a) => (
          <span key={a.name}><dt>{a.name}</dt><dd>{String(a.value)}</dd></span>
        ))}
      </dl>
    </div>
  )
}
```

Append to `src/styles.css`:
```css
.iteration-img { max-height: 70vh; border-radius: 8px; }
.live-frame { width: 100%; height: 70vh; border: 1px solid #333; border-radius: 8px; background: #000; }
.iteration-meta { display: grid; grid-template-columns: max-content 1fr; gap: 0.25rem 1rem; }
.iteration-meta dt { color: #888; }
.iteration-meta dd { margin: 0; }
.iteration-meta span { display: contents; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all pass.

- [ ] **Step 5: Visual check** — dev server: open an iteration, click "Run live", confirm the artwork actually executes from IPFS in the sandboxed frame.

- [ ] **Step 6: Commit**
```bash
git add src/
git commit -m "feat: iteration page with sandboxed live render"
```

---

### Task 11: Artist directory + artist page

**Files:**
- Modify: `src/pages/ArtistsPage.tsx`, `src/pages/ArtistPage.tsx`, `src/styles.css`
- Test: `src/pages/ArtistsPage.test.tsx`

**Interfaces:**
- Consumes: `loadArtists`, `loadTokensMap`, `loadAllTokens`, `isVisible` (Task 5); `TokenCard`, `IpfsImage` (Task 8).
- Produces: terminal pages; artist cards link to `/artist/${artist.id}`.

- [ ] **Step 1: Write failing tests** — `src/pages/ArtistsPage.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ArtistsPage from './ArtistsPage'
import * as data from '../lib/data'

beforeEach(() => {
  vi.spyOn(data, 'loadArtists').mockResolvedValue([
    { id: 'tz1a', name: 'Alice', avatarUri: null, description: 'bio', tokenCount: 3 },
    { id: 'tz1b', name: 'Bob', avatarUri: null, description: null, tokenCount: 1 },
  ])
})

test('lists artists with counts and links', async () => {
  render(<MemoryRouter><ArtistsPage /></MemoryRouter>)
  const alice = await screen.findByRole('link', { name: /Alice/ })
  expect(alice.getAttribute('href')).toContain('/artist/tz1a')
  expect(screen.getByText(/3 projects/)).toBeTruthy()
})

test('search filters artists', async () => {
  render(<MemoryRouter><ArtistsPage /></MemoryRouter>)
  await screen.findByRole('link', { name: /Alice/ })
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'bob' } })
  expect(screen.queryByText('Alice')).toBeNull()
  expect(screen.getByText('Bob')).toBeTruthy()
})
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/pages/ArtistsPage.test.tsx` → FAIL.

- [ ] **Step 3: Implement.**

`src/pages/ArtistsPage.tsx`:
```tsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadArtists } from '../lib/data'
import type { Artist } from '../lib/types'
import IpfsImage from '../components/IpfsImage'

const PAGE = 100

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)

  useEffect(() => { loadArtists().then(setArtists, (e) => setError(String(e))) }, [])

  const visible = useMemo(() => {
    if (!artists) return []
    const q = query.trim().toLowerCase()
    return artists.filter((a) => !q || (a.name ?? a.id).toLowerCase().includes(q))
  }, [artists, query])

  if (error) return <p>Failed to load artists: {error}</p>
  if (!artists) return <p>Loading artists…</p>

  return (
    <div>
      <div className="browse-controls">
        <input placeholder="Search artists…" value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }} />
        <span className="count">{visible.length} artists</span>
      </div>
      <div className="artist-list">
        {visible.slice(0, shown).map((a) => (
          <Link key={a.id} to={`/artist/${a.id}`} className="artist-row">
            <IpfsImage uri={a.avatarUri} alt={a.name ?? a.id} className="avatar" />
            <div>
              <div className="token-name">{a.name ?? a.id}</div>
              <div className="muted">{a.tokenCount} projects</div>
            </div>
          </Link>
        ))}
      </div>
      {shown < visible.length && (
        <button className="load-more" onClick={() => setShown((s) => s + PAGE)}>Load more</button>
      )}
    </div>
  )
}
```

`src/pages/ArtistPage.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadArtists, loadTokensMap, loadAllTokens, isVisible } from '../lib/data'
import type { Artist, LeanToken } from '../lib/types'
import TokenCard from '../components/TokenCard'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

export default function ArtistPage() {
  const { id } = useParams()
  const [artist, setArtist] = useState<Artist | null | undefined>(undefined)
  const [tokens, setTokens] = useState<LeanToken[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [artists, map, all] = await Promise.all([loadArtists(), loadTokensMap(), loadAllTokens()])
        if (cancelled) return
        const found = artists.find((a) => a.id === id) ?? null
        setArtist(found)
        const ids = new Set(map[id!] ?? [])
        setTokens(all.filter((t) => ids.has(t.id) && isVisible(t)))
      } catch {
        if (!cancelled) setArtist(null)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (artist === undefined) return <p>Loading…</p>
  if (artist === null) return <NotFoundPage />

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={artist.avatarUri} alt={artist.name ?? artist.id} className="avatar-lg" />
        <div>
          <h2>{artist.name ?? artist.id}</h2>
          <p className="muted"><code>{artist.id}</code></p>
          {artist.description && <p>{artist.description}</p>}
        </div>
      </div>
      <h3>{tokens.length} projects</h3>
      <div className="token-grid">
        {tokens.map((t) => <TokenCard key={t.id} token={t} />)}
      </div>
    </div>
  )
}
```

Append to `src/styles.css`:
```css
.artist-list { display: flex; flex-direction: column; gap: 0.5rem; }
.artist-row { display: flex; gap: 1rem; align-items: center; padding: 0.5rem; border-radius: 8px; background: #1a1a1a; }
.avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.avatar-lg { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all pass.

- [ ] **Step 5: Commit**
```bash
git add src/
git commit -m "feat: artist directory and artist pages"
```

---

### Task 12: GitHub Actions (deploy + weekly snapshot), README, ship it

**Files:**
- Create: `.github/workflows/deploy.yml`, `.github/workflows/snapshot.yml`, `README.md`

**Interfaces:**
- Consumes: `npm run build` (Task 1), `npm run snapshot` (Task 3).
- Produces: live GitHub Pages site; weekly snapshot refresh that doubles as an fxhash-API liveness canary.

- [ ] **Step 1: Write the deploy workflow** — `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write the snapshot workflow** — `.github/workflows/snapshot.yml`:
```yaml
name: Weekly snapshot refresh
on:
  schedule:
    - cron: '17 4 * * 1' # Mondays 04:17 UTC
  workflow_dispatch:
permissions:
  contents: write
jobs:
  snapshot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node scripts/snapshot.mjs
      - name: Commit if changed
        run: |
          git config user.name "snapshot-bot"
          git config user.email "actions@users.noreply.github.com"
          git add public/data
          git diff --cached --quiet || git commit -m "chore: weekly snapshot refresh"
          git push
```

- [ ] **Step 3: Write README.md** — must cover: what this is (unofficial read-only fxhash archive viewer), why (fxhash.xyz offline), the three data tiers table from the spec, `npm install` / `npm run dev` / `npm test` / `npm run snapshot`, deploy-on-push, and a note that this hosts no artwork itself — everything loads from public IPFS gateways and TzKT.

- [ ] **Step 4: Verify build + full test suite locally**

Run: `npm test` → all pass. Run: `npm run build` → success. Run `npm run preview`, open the URL, click through: browse → project → iteration → run live → artist. All five surfaces work.

- [ ] **Step 5: Commit and push**
```bash
git add .github README.md
git commit -m "feat: pages deploy + weekly snapshot workflows and readme"
```
Then (user may need to do these parts): create the GitHub repo, `git remote add origin ...`, `git push -u origin master`, and in repo Settings → Pages set Source to "GitHub Actions".

- [ ] **Step 6: Post-deploy verification on the real origin** (the definitive CORS check from `*.github.io`):
1. Open the Pages URL — catalog grid renders.
2. Open a project — iterations load from TzKT (watch devtools network tab for CORS errors).
3. Open an iteration — image loads; "Run live" executes the piece.
4. Hard-refresh a deep link like `.../#/token/<slug>` — no 404.
Record any failures as new issues; TzKT CORS failure would trigger the spec's documented fallback discussion.

---

## Self-Review Notes

- Spec coverage: browse/search/sort (T8), project + iterations + unavailable state (T9), iteration + sandboxed live render (T10), artists (T11), snapshot + canary cron (T3/T12), gateway fallback (T4/T8), moderation flags (T2/T5/T8), hash-routing deep links (T7/T12). Articles + full iteration snapshot correctly absent (out of scope).
- Type consistency: `LeanToken`/`Artist`/`SnapshotMeta` defined once in Task 5 and mirrored by the untyped lib in Task 2; `Iteration` defined once in Task 6; consumers import, never redefine.
- Deliberate simplifications: "Load more" buttons instead of IntersectionObserver infinite scroll (testable, degrades to nothing); BrowsePage loads all shards up front (~10–25 MB raw, served gzipped by Pages) — acceptable for v1, revisit only if real-world load feels bad.
