import { test, expect, vi, beforeEach } from 'vitest'
import {
  fetchIterations,
  fetchIteration,
  fetchIterationsByIds,
  MAX_IDS_PER_QUERY,
  GENTK_CONTRACTS,
} from './tzkt'

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

test('fetchIterations returns the populated contract\'s rows when the other contract fails', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const u = String(url)
    if (u.includes(GENTK_CONTRACTS[0])) {
      throw new Error('network blip')
    }
    if (u.includes(GENTK_CONTRACTS[1]) && u.includes('generatorUri')) {
      return { ok: true, json: async () => [row('7')] } as Response
    }
    return { ok: true, json: async () => [] } as Response
  }))
  const iters = await fetchIterations('ipfs://QmGen')
  expect(iters).toHaveLength(1)
  expect(iters[0]).toMatchObject({ contract: GENTK_CONTRACTS[1], tokenId: '7', iterationHash: 'oo7' })
})

test('fetchIterations rethrows when every contract query fails', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => {
    throw new Error('network down')
  }))
  await expect(fetchIterations('ipfs://QmGen')).rejects.toThrow('network down')
})

// --- fetchIterationsByIds: the authoritative objkt-id path -------------------
// Objkt ids look like FX{version}-{tokenId}; version 0 -> gentk v1, 1 -> gentk v2,
// i.e. the version index addresses GENTK_CONTRACTS directly.

const idsIn = (url: string) => /tokenId\.in=([^&]*)/.exec(url)?.[1].split(',') ?? []
const versionOf = (url: string) => GENTK_CONTRACTS.findIndex((c) => url.includes(c))

/** Answers a tokenId.in batch with one row per requested id, optionally reordered. */
const batchMock = (opts: { reverse?: boolean; fail?: number[] } = {}) =>
  vi.fn(async (url: string) => {
    const u = String(url)
    const version = versionOf(u)
    if (opts.fail?.includes(version)) throw new Error(`network down v${version}`)
    const ids = idsIn(u)
    const rows = (opts.reverse ? [...ids].reverse() : ids).map((id) => row(id))
    return { ok: true, json: async () => rows } as Response
  })

const urlsCalled = () => vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
const asObjktIds = (iters: { contract: string; tokenId: string }[]) =>
  iters.map((i) => `FX${GENTK_CONTRACTS.indexOf(i.contract)}-${i.tokenId}`)

test('fetchIterationsByIds batches one tokenId.in query against the right contract', async () => {
  vi.stubGlobal('fetch', batchMock())
  const iters = await fetchIterationsByIds(['FX0-955', 'FX0-960', 'FX0-961'])
  const urls = urlsCalled()
  expect(urls).toHaveLength(1)
  expect(urls[0]).toContain(`contract=${GENTK_CONTRACTS[0]}`)
  expect(urls[0]).toContain('tokenId.in=955,960,961')
  expect(urls[0]).toContain('select=tokenId,firstMinter,metadata')
  expect(urls[0]).not.toContain('generatorUri')
  expect(asObjktIds(iters)).toEqual(['FX0-955', 'FX0-960', 'FX0-961'])
  expect(iters[0]).toMatchObject({ name: 'Piece #955', iterationHash: 'oo955', minter: 'Minter' })
})

test('fetchIterationsByIds issues one request per version present and merges them', async () => {
  vi.stubGlobal('fetch', batchMock())
  const iters = await fetchIterationsByIds(['FX0-1', 'FX1-2', 'FX0-3'])
  const urls = urlsCalled()
  expect(urls).toHaveLength(2)
  const v1 = urls.find((u) => u.includes(GENTK_CONTRACTS[0]))!
  const v2 = urls.find((u) => u.includes(GENTK_CONTRACTS[1]))!
  expect(idsIn(v1)).toEqual(['1', '3'])
  expect(idsIn(v2)).toEqual(['2'])
  expect(asObjktIds(iters).sort()).toEqual(['FX0-1', 'FX0-3', 'FX1-2'])
})

test('fetchIterationsByIds preserves mint order even when TzKT shuffles rows', async () => {
  vi.stubGlobal('fetch', batchMock({ reverse: true }))
  const asked = ['FX0-3', 'FX1-9', 'FX0-1', 'FX1-4', 'FX0-2']
  expect(asObjktIds(await fetchIterationsByIds(asked))).toEqual(asked)
})

test('fetchIterationsByIds slices the id list and only names the current page', async () => {
  vi.stubGlobal('fetch', batchMock())
  const all = Array.from({ length: 10 }, (_, i) => `FX0-${i}`)
  const iters = await fetchIterationsByIds(all, 4, 3)
  expect(asObjktIds(iters)).toEqual(['FX0-4', 'FX0-5', 'FX0-6'])
  const urls = urlsCalled()
  expect(urls).toHaveLength(1)
  expect(idsIn(urls[0])).toEqual(['4', '5', '6'])
  // Ids outside the page must never appear in the query.
  expect(urls[0]).not.toContain('tokenId.in=0')
  expect(idsIn(urls[0])).not.toContain('9')
})

test('fetchIterationsByIds returns [] for an offset past the end without querying', async () => {
  vi.stubGlobal('fetch', batchMock())
  expect(await fetchIterationsByIds(['FX0-1'], 48, 48)).toEqual([])
  expect(urlsCalled()).toHaveLength(0)
})

test('fetchIterationsByIds keeps the rows of a version that succeeded when another fails', async () => {
  vi.stubGlobal('fetch', batchMock({ fail: [0] }))
  const iters = await fetchIterationsByIds(['FX0-1', 'FX1-2'])
  expect(asObjktIds(iters)).toEqual(['FX1-2'])
})

test('fetchIterationsByIds rejects only when every version query fails', async () => {
  vi.stubGlobal('fetch', batchMock({ fail: [0, 1] }))
  await expect(fetchIterationsByIds(['FX0-1', 'FX1-2'])).rejects.toThrow(/network down/)
})

test('fetchIterationsByIds drops ids TzKT does not return rather than inventing rows', async () => {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const ids = idsIn(String(url)).filter((id) => id !== '2')
    return { ok: true, json: async () => ids.map((id) => row(id)) } as Response
  }))
  expect(asObjktIds(await fetchIterationsByIds(['FX0-1', 'FX0-2', 'FX0-3']))).toEqual(['FX0-1', 'FX0-3'])
})

test('fetchIterationsByIds ignores malformed or unknown-version ids', async () => {
  vi.stubGlobal('fetch', batchMock())
  expect(asObjktIds(await fetchIterationsByIds(['FX0-1', 'nonsense', 'FX9-4']))).toEqual(['FX0-1'])
  expect(await fetchIterationsByIds(['nonsense'])).toEqual([])
  expect(urlsCalled()).toHaveLength(1)
})

test('fetchIterationsByIds guards against unbounded page sizes blowing up the URL', async () => {
  vi.stubGlobal('fetch', batchMock())
  const all = Array.from({ length: 5000 }, (_, i) => `FX0-${i}`)
  await expect(fetchIterationsByIds(all, 0, MAX_IDS_PER_QUERY + 1)).rejects.toThrow(RangeError)
  expect(urlsCalled()).toHaveLength(0)
  // The documented maximum is still allowed.
  await fetchIterationsByIds(all, 0, MAX_IDS_PER_QUERY)
  expect(urlsCalled()).toHaveLength(1)
})
