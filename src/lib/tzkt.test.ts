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
