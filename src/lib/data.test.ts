import { test, expect, vi, beforeEach } from 'vitest'
import { loadMeta, loadShard, findTokenBySlug, isVisible, loadIterationIds, _resetCache } from './data'
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
  // Iteration-id shards mirror tokens/index-NNN.json one-for-one.
  'iterations/map-000.json': { '1': ['FX0-5', 'FX1-6'], '2': [] },
  'iterations/map-001.json': { '3': ['FX0-9'] },
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

test('loadIterationIds resolves the map shard via the slug index', async () => {
  expect(await loadIterationIds('tok-3', 3)).toEqual(['FX0-9'])
  const urls = vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
  expect(urls.some((u) => u.endsWith('iterations/map-001.json'))).toBe(true)
  // Never a hardcoded leading slash — the app deploys to a Pages subpath.
  expect(urls.every((u) => u.includes('data/'))).toBe(true)
})

test('loadIterationIds returns an empty array for a genuinely never-minted project', async () => {
  expect(await loadIterationIds('tok-2', 2)).toEqual([])
})

test('loadIterationIds returns null when the project is unknown, not an empty array', async () => {
  // Unknown slug — we cannot even find the shard.
  expect(await loadIterationIds('nope', 42)).toBeNull()
  // Known slug, but the project id is absent from the map: still "we do not know".
  expect(await loadIterationIds('tok-1', 999)).toBeNull()
})

test('loadIterationIds rejects when the map shard cannot be loaded', async () => {
  _resetCache()
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const u = String(url)
    if (u.endsWith('tokens/slug-index.json')) {
      return { ok: true, json: async () => routes['tokens/slug-index.json'] } as Response
    }
    return { ok: false, status: 404 } as Response
  }))
  await expect(loadIterationIds('tok-3', 3)).rejects.toThrow(/404/)
})

test('loadIterationIds memoizes the map shard across projects', async () => {
  await loadIterationIds('tok-1', 1)
  const before = vi.mocked(fetch).mock.calls.length
  await loadIterationIds('tok-2', 2)
  expect(vi.mocked(fetch).mock.calls.length).toBe(before)
})

test('isVisible hides moderated flags', () => {
  expect(isVisible(tok(1))).toBe(true)
  expect(isVisible(tok(1, { flag: 'MALICIOUS' }))).toBe(false)
  expect(isVisible(tok(1, { flag: 'REPORTED' }))).toBe(false)
})
