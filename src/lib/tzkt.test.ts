import { test, expect, vi, beforeEach } from 'vitest'
import {
  fetchIterations,
  fetchIteration,
  fetchIterationsByIds,
  MAX_IDS_PER_QUERY,
  GENTK_CONTRACTS,
  fetchOwner,
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
    // Only the middle gentk contract "owns" this project in the mock
    const rows = u.includes(GENTK_CONTRACTS[1]) && u.includes('generatorUri') ? [row('7')] : []
    if (u.includes('tokenId=7')) return { ok: true, json: async () => [row('7')] } as Response
    return { ok: true, json: async () => rows } as Response
  }))
})

test('GENTK_CONTRACTS lists all three gentk contracts, in index order', async () => {
  // There are three, not two. The middle one holds more tokens than either of the
  // others; while it was missing, every project on it rendered zero iterations.
  expect(GENTK_CONTRACTS).toEqual([
    'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE',
    'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
    'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr',
  ])
})

test('fetchIterations queries every gentk contract and merges', async () => {
  const iters = await fetchIterations('ipfs://QmGen')
  const urls = vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
  // The join fallback has to ask all three, or it silently misses a whole contract.
  expect(urls).toHaveLength(3)
  for (const contract of GENTK_CONTRACTS) {
    expect(urls.some((u) => u.includes(`contract=${contract}`))).toBe(true)
  }
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

test('fetchIteration encodes both route params, not just the token id', async () => {
  // Both come straight off the URL hash, so both are user-controlled and neither
  // should be able to smuggle extra query parameters into the TzKT request.
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] }) as unknown as Response))
  await fetchIteration('KT1x&limit=10000', '7&select=metadata')
  const url = String(vi.mocked(fetch).mock.calls[0][0])
  expect(url).toContain('contract=KT1x%26limit%3D10000')
  expect(url).toContain('tokenId=7%26select%3Dmetadata')
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
// Objkt ids look like FX{version}-{tokenId}, where the version is the *issuer*
// version — NOT the gentk contract. There are three gentk contracts and FX0 ids
// exist on two of them, so the contract is passed in explicitly by the caller
// (from the committed iterations/contracts.json) and the prefix is never consulted.

const idsIn = (url: string) => /tokenId\.in=([^&]*)/.exec(url)?.[1].split(',') ?? []

/** Answers a tokenId.in batch with one row per requested id, optionally reordered. */
const batchMock = (opts: { reverse?: boolean; fail?: boolean; omit?: string[] } = {}) =>
  vi.fn(async (url: string) => {
    const u = String(url)
    if (opts.fail) throw new Error('network down')
    const ids = idsIn(u).filter((id) => !opts.omit?.includes(id))
    const rows = (opts.reverse ? [...ids].reverse() : ids).map((id) => row(id))
    return { ok: true, json: async () => rows } as Response
  })

const urlsCalled = () => vi.mocked(fetch).mock.calls.map((c) => String(c[0]))
const tokenIdsOf = (iters: { tokenId: string }[]) => iters.map((i) => i.tokenId)

test('fetchIterationsByIds batches one tokenId.in query against the contract it is given', async () => {
  vi.stubGlobal('fetch', batchMock())
  const iters = await fetchIterationsByIds(['FX0-955', 'FX0-960', 'FX0-961'], GENTK_CONTRACTS[1])
  const urls = urlsCalled()
  expect(urls).toHaveLength(1)
  expect(urls[0]).toContain(`contract=${GENTK_CONTRACTS[1]}`)
  expect(urls[0]).toContain('tokenId.in=955,960,961')
  expect(urls[0]).toContain('select=tokenId,firstMinter,metadata')
  expect(urls[0]).not.toContain('generatorUri')
  expect(tokenIdsOf(iters)).toEqual(['955', '960', '961'])
  expect(iters[0]).toMatchObject({ name: 'Piece #955', iterationHash: 'oo955', minter: 'Minter' })
})

test('fetchIterationsByIds never infers the contract from the FX prefix', async () => {
  // The bug this replaces: `FX0-…` ids on the middle contract were queried against
  // gentk v1, which returns nothing (or, worse, another project's token).
  vi.stubGlobal('fetch', batchMock())
  const iters = await fetchIterationsByIds(['FX0-1', 'FX2-2'], GENTK_CONTRACTS[1])
  const urls = urlsCalled()
  expect(urls).toHaveLength(1)
  expect(urls[0]).not.toContain(GENTK_CONTRACTS[0])
  expect(urls[0]).not.toContain(GENTK_CONTRACTS[2])
  // Mixed prefixes are one project on one contract: one batch, and every row
  // reported on the contract the caller named.
  expect(idsIn(urls[0])).toEqual(['1', '2'])
  expect(iters.every((i) => i.contract === GENTK_CONTRACTS[1])).toBe(true)
})

test('fetchIterationsByIds queries whatever contract it is given, including v1', async () => {
  vi.stubGlobal('fetch', batchMock())
  await fetchIterationsByIds(['FX1-4'], GENTK_CONTRACTS[0])
  expect(urlsCalled()[0]).toContain(`contract=${GENTK_CONTRACTS[0]}`)
})

test('fetchIterationsByIds preserves mint order even when TzKT shuffles rows', async () => {
  vi.stubGlobal('fetch', batchMock({ reverse: true }))
  const asked = ['FX0-3', 'FX0-9', 'FX0-1', 'FX0-4', 'FX0-2']
  const iters = await fetchIterationsByIds(asked, GENTK_CONTRACTS[1])
  expect(tokenIdsOf(iters)).toEqual(['3', '9', '1', '4', '2'])
})

test('fetchIterationsByIds drops ids TzKT does not return rather than inventing or shifting rows', async () => {
  // A missing row must leave a gap: the ids after it keep their own rows instead of
  // sliding up, which would show every later iteration under the wrong number.
  vi.stubGlobal('fetch', batchMock({ omit: ['2'] }))
  const iters = await fetchIterationsByIds(['FX0-1', 'FX0-2', 'FX0-3'], GENTK_CONTRACTS[1])
  expect(tokenIdsOf(iters)).toEqual(['1', '3'])
  expect(iters.map((i) => i.name)).toEqual(['Piece #1', 'Piece #3'])
})

test('fetchIterationsByIds slices the id list and only names the current page', async () => {
  vi.stubGlobal('fetch', batchMock())
  const all = Array.from({ length: 10 }, (_, i) => `FX0-${i}`)
  const iters = await fetchIterationsByIds(all, GENTK_CONTRACTS[1], 4, 3)
  expect(tokenIdsOf(iters)).toEqual(['4', '5', '6'])
  const urls = urlsCalled()
  expect(urls).toHaveLength(1)
  expect(idsIn(urls[0])).toEqual(['4', '5', '6'])
  // Ids outside the page must never appear in the query.
  expect(idsIn(urls[0])).not.toContain('9')
})

test('fetchIterationsByIds returns [] for an offset past the end without querying', async () => {
  vi.stubGlobal('fetch', batchMock())
  expect(await fetchIterationsByIds(['FX0-1'], GENTK_CONTRACTS[1], 48, 48)).toEqual([])
  expect(urlsCalled()).toHaveLength(0)
})

test('fetchIterationsByIds rejects when its query fails, so the page can say "unavailable"', async () => {
  vi.stubGlobal('fetch', batchMock({ fail: true }))
  await expect(fetchIterationsByIds(['FX0-1', 'FX0-2'], GENTK_CONTRACTS[1])).rejects.toThrow(/network down/)
})

test('fetchIterationsByIds ignores malformed ids', async () => {
  vi.stubGlobal('fetch', batchMock())
  const iters = await fetchIterationsByIds(['FX0-1', 'nonsense'], GENTK_CONTRACTS[1])
  expect(tokenIdsOf(iters)).toEqual(['1'])
  expect(await fetchIterationsByIds(['nonsense'], GENTK_CONTRACTS[1])).toEqual([])
  expect(urlsCalled()).toHaveLength(1)
})

test('fetchIterationsByIds guards against unbounded page sizes blowing up the URL', async () => {
  vi.stubGlobal('fetch', batchMock())
  const all = Array.from({ length: 5000 }, (_, i) => `FX0-${i}`)
  await expect(fetchIterationsByIds(all, GENTK_CONTRACTS[1], 0, MAX_IDS_PER_QUERY + 1)).rejects.toThrow(RangeError)
  expect(urlsCalled()).toHaveLength(0)
  // The documented maximum is still allowed.
  await fetchIterationsByIds(all, GENTK_CONTRACTS[1], 0, MAX_IDS_PER_QUERY)
  expect(urlsCalled()).toHaveLength(1)
})

// --- current ownership -------------------------------------------------------
// The only fact on an iteration page that this repository cannot supply. Every
// test here is therefore also a test that its absence costs nothing.

test('fetchOwner asks for live holders of exactly one token', async () => {
  const calls: string[] = []
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    calls.push(String(url))
    return { ok: true, json: async () => [{ account: { address: 'tz1owner', alias: 'Holder' }, balance: '1' }] } as Response
  }))

  const owner = await fetchOwner(GENTK_CONTRACTS[1], '1592717')

  expect(owner).toEqual({ address: 'tz1owner', alias: 'Holder' })
  // balance.gt=0 is what makes this "who holds it now" rather than "who ever did":
  // TzKT keeps a zero-balance row for every past holder.
  expect(calls[0]).toContain('balance.gt=0')
  expect(calls[0]).toContain(`token.contract=${GENTK_CONTRACTS[1]}`)
  expect(calls[0]).toContain('token.tokenId=1592717')
})

test('an unheld token has no owner, which is not an error', async () => {
  // Burned, or a supply that never settled. Reporting null lets the page leave the
  // row out; throwing would make it look like the lookup failed.
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] }) as Response))
  expect(await fetchOwner(GENTK_CONTRACTS[1], '1')).toBe(null)
})

test('an owner with no registered alias still reports its address', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => [{ account: { address: 'tz1anon' }, balance: '1' }],
  }) as Response))
  expect(await fetchOwner(GENTK_CONTRACTS[1], '1')).toEqual({ address: 'tz1anon', alias: null })
})

test('a failed lookup rejects rather than claiming nobody owns it', async () => {
  // The caller drops the row either way, but "we could not ask" and "nobody holds
  // it" are different facts and conflating them is how this archive tells lies.
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503 }) as Response))
  await expect(fetchOwner(GENTK_CONTRACTS[1], '1')).rejects.toThrow(/503/)
})

test('the minter address survives alongside the alias', async () => {
  // It was already in every response and thrown away by `alias ?? address`, so
  // linking the minter costs no extra request.
  const it = await fetchIteration(GENTK_CONTRACTS[1], '7')
  expect(it?.minter).toBe('Minter')
  expect(it?.minterAddress).toBe('tz1minter')
})
