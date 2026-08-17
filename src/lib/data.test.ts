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
