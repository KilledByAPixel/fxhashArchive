import { test, expect, vi, beforeEach } from 'vitest'
import {
  loadMeta, loadShard, findTokenBySlug, isVisible, loadIterationIds,
  loadIterationContract, loadSummary, loadProjectMarketStats, loadProjectSeed, loadProjectIteration, _resetCache,
} from './data'
import type { LeanToken } from './types'

const tok = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: 1, iterationsCount: 1,
  createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null,
  generativeUri: null, tags: [], author: null, ...over,
})

const routes: Record<string, unknown> = {
  'meta.json': { generatedAt: 'T', tokenCount: 3, shardCount: 2, shardSize: 2 },
  'tokens/index-000.json': [tok(1), tok(2)],
  'tokens/index-001.json': [tok(3), tok(4, { flag: 'MALICIOUS' })],
  'tokens/slug-index.json': { 'tok-1': 0, 'tok-2': 0, 'tok-3': 1, 'tok-4': 1 },
  // Iteration-id shards mirror tokens/index-NNN.json one-for-one.
  'iterations/map-000.json': { '1': ['FX0-5', 'FX1-6'], '2': [] },
  'iterations/map-001.json': { '3': ['FX0-9'] },
  // Which gentk contract each project's iterations live on. The index addresses
  // `contracts`; the `FX{n}` prefix of an id says nothing about it.
  'iterations/contracts.json': {
    contracts: ['KT1v1', 'KT1v2', 'KT1v3'],
    byProject: { '1': 0, '2': 1, '3': 2 },
  },
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

test('findTokenBySlug hides moderated projects, so a direct link cannot reach one', async () => {
  // Moderation is a documented guarantee, not a browse-grid decoration: the flagged
  // slug must resolve to "not found" exactly like an unknown one.
  expect(await findTokenBySlug('tok-4')).toBeNull()
  expect(await findTokenBySlug('tok-3')).not.toBeNull()
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

test('a failed fetch is not memoized, so the next attempt really retries', async () => {
  // A cached rejection would make one transient failure of tokens/slug-index.json
  // turn *every* project deep link into "Not found" for the rest of the session.
  _resetCache()
  let attempts = 0
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    attempts += 1
    if (attempts === 1) throw new Error('network blip')
    const key = Object.keys(routes).find((k) => String(url).endsWith(k))
    if (!key) return { ok: false, status: 404 } as Response
    return { ok: true, json: async () => routes[key] } as Response
  }))

  await expect(loadMeta()).rejects.toThrow('network blip')
  expect((await loadMeta()).shardCount).toBe(2)
  expect(attempts).toBe(2)

  // Successes are still memoized — the retry path must not defeat the cache.
  await loadMeta()
  expect(attempts).toBe(2)
})

test('a slug lookup that failed once can succeed on a later attempt', async () => {
  _resetCache()
  let fail = true
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (fail) throw new Error('slug-index unreachable')
    const key = Object.keys(routes).find((k) => String(url).endsWith(k))
    if (!key) return { ok: false, status: 404 } as Response
    return { ok: true, json: async () => routes[key] } as Response
  }))

  await expect(findTokenBySlug('tok-3')).rejects.toThrow(/unreachable/)
  fail = false
  expect((await findTokenBySlug('tok-3'))?.id).toBe(3)
})

test('isVisible hides moderated flags', () => {
  expect(isVisible(tok(1))).toBe(true)
  expect(isVisible(tok(1, { flag: 'MALICIOUS' }))).toBe(false)
  expect(isVisible(tok(1, { flag: 'REPORTED' }))).toBe(false)
})

// --- which gentk contract a project's iterations live on ---------------------
// There are three gentk contracts and the `FX{n}` prefix of an iteration id is the
// *issuer* version, not the contract — FX0 ids exist on two different contracts.
// Guessing renders another project's artwork, so the mapping is the only source.

test('loadIterationContract returns the mapped contract address for a project', async () => {
  expect(await loadIterationContract(3)).toBe('KT1v3')
  expect(await loadIterationContract(1)).toBe('KT1v1')
  expect(await loadIterationContract(2)).toBe('KT1v2')
  const urls = vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
  expect(urls.some((u) => u.endsWith('data/iterations/contracts.json'))).toBe(true)
  // Never a hardcoded leading slash — the app deploys to a Pages subpath, so every
  // data path has to hang off BASE_URL.
  expect(urls.every((u) => u.startsWith(`${import.meta.env.BASE_URL}data/`))).toBe(true)
})

test('loadIterationContract returns null for a project with no entry, never a guess', async () => {
  expect(await loadIterationContract(999)).toBeNull()
})

test('loadIterationContract memoizes the contracts file across projects', async () => {
  await loadIterationContract(1)
  const before = vi.mocked(fetch).mock.calls.length
  await loadIterationContract(2)
  await loadIterationContract(3)
  expect(vi.mocked(fetch).mock.calls.length).toBe(before)
})

test('loadIterationContract rejects when the contracts file cannot be loaded', async () => {
  _resetCache()
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404 }) as Response))
  await expect(loadIterationContract(3)).rejects.toThrow(/404/)
})

test('loadIterationContract returns null for an out-of-range contract index', async () => {
  // Corrupt data must degrade to "we do not know" rather than to `undefined`
  // leaking into a TzKT URL as the contract.
  _resetCache()
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => ({ contracts: ['KT1v1'], byProject: { '3': 7 } }),
  }) as Response))
  expect(await loadIterationContract(3)).toBeNull()
})

test('loadSummary fetches summary.json', async () => {
  const summary = {
    generatedAt: '2026-08-18T00:00:00.000Z',
    counts: { projects: 3, artists: 2, iterations: 9, seeds: 8, archived: 1 },
    ranked: [2, 1], archived: [1], curve: [{ p: 1, share: 50 }],
  }
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => summary })
  vi.stubGlobal('fetch', fetchMock)
  _resetCache()

  await expect(loadSummary()).resolves.toEqual(summary)
  expect(fetchMock.mock.calls[0][0]).toContain('data/summary.json')
})

// --- per-project trading history -----------------------------------------
// Sharded to mirror tokens/index-NNN.json; loaded only when a project page
// opens, since the full market data is 3 MB across 28 shards.

test('loadProjectMarketStats reads the shard that holds the project', async () => {
  const stats = { pv: 1_000_000, pn: 10, sv: 2_500_000, sn: 4, floor: null, med: null, hi: 900_000, lo: 1, listed: 0 }
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    if (String(url).includes('slug-index.json')) {
      return Promise.resolve({ ok: true, json: async () => ({ 'tok-5': 3 }) })
    }
    return Promise.resolve({ ok: true, json: async () => ({ '5': stats }) })
  })
  vi.stubGlobal('fetch', fetchMock)
  _resetCache()

  await expect(loadProjectMarketStats('tok-5', 5)).resolves.toEqual(stats)
  expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('market/stats-003.json'))).toBe(true)
})

test('loadProjectMarketStats returns null for an unknown project', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
  vi.stubGlobal('fetch', fetchMock)
  _resetCache()

  await expect(loadProjectMarketStats('nope', 999)).resolves.toBeNull()
})

test('loadProjectSeed reads the seed out of the local chunk, by tokenId', async () => {
  const chunk = { contract: 1, address: 'KT1U6', from: 589146, size: 3, seeds: ['ooA', null, 'ooC'] }
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    if (String(url).includes('contracts.json')) {
      return Promise.resolve({ ok: true, json: async () => ({ contracts: ['KT1K', 'KT1U6'], byProject: { '5': 1 } }) })
    }
    return Promise.resolve({ ok: true, json: async () => chunk })
  })
  vi.stubGlobal('fetch', fetchMock)
  _resetCache()

  // Indexed by the chunk's own `from`, not by tokenId modulo the chunk size — the
  // second contract starts at 589146, which is not on a chunk boundary.
  await expect(loadProjectSeed(5, 589148)).resolves.toBe('ooC')
  expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('seeds/1/0058.json'))).toBe(true)
})

test('loadProjectSeed returns null for an unsigned mint, not undefined', async () => {
  const chunk = { contract: 0, address: 'KT1K', from: 0, size: 3, seeds: ['ooA', null, 'ooC'] }
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) =>
    Promise.resolve({
      ok: true,
      json: async () => (String(url).includes('contracts.json')
        ? { contracts: ['KT1K'], byProject: { '5': 0 } }
        : chunk),
    })))
  _resetCache()
  await expect(loadProjectSeed(5, 1)).resolves.toBeNull()
})

test('loadProjectSeed returns null when the project has no known contract', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true, json: async () => ({ contracts: ['KT1K'], byProject: {} }),
  }))
  _resetCache()
  await expect(loadProjectSeed(999, 1)).resolves.toBeNull()
})

test('loadProjectIteration carries the params fragment out of the captured artifact', async () => {
  const chunk = {
    contract: 2, address: 'KT1E', from: 0, size: 1,
    seeds: ['ooSEED'],
    // fx(params): the minter's chosen parameters ride in the fragment.
    artifacts: ['ipfs://QmX/?fxhash=ooSEED&fxiteration=1&fxchain=TEZOS#0x4031000000000000'],
  }
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) =>
    Promise.resolve({
      ok: true,
      json: async () => (String(url).includes('contracts.json')
        ? { contracts: ['KT1E'], byProject: { '7': 0 } }
        : chunk),
    })))
  _resetCache()

  const local = await loadProjectIteration(7, 0)
  expect(local.seed).toBe('ooSEED')
  expect(local.query).toBe('?fxhash=ooSEED&fxiteration=1&fxchain=TEZOS#0x4031000000000000')
})

test('loadProjectIteration reports no query when the artifact had none', async () => {
  const chunk = { contract: 0, address: 'KT1K', from: 0, size: 1, seeds: ['ooSEED'], artifacts: ['ipfs://QmX'] }
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) =>
    Promise.resolve({
      ok: true,
      json: async () => (String(url).includes('contracts.json')
        ? { contracts: ['KT1K'], byProject: { '7': 0 } }
        : chunk),
    })))
  _resetCache()

  // The caller then falls back to ?fxhash=<seed>, which is right for those eras.
  await expect(loadProjectIteration(7, 0)).resolves.toEqual({ seed: 'ooSEED', query: null })
})
