import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import TokenPage from './TokenPage'
import * as data from '../lib/data'
import * as tzkt from '../lib/tzkt'
import type { LeanToken } from '../lib/types'
import type { Iteration } from '../lib/tzkt'

const token: LeanToken = {
  id: 5, slug: 'tok-5', name: 'Tok 5', flag: 'CLEAN', supply: 10, iterationsCount: 2,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null,
  displayUri: 'ipfs://QmDisp', generativeUri: 'ipfs://QmGen', tags: ['geo'],
  author: { id: 'tz1a', name: 'Alice', avatarUri: null },
}

const iter = (over: Partial<Iteration> = {}): Iteration => ({
  contract: 'KT1x', tokenId: '9', name: 'Tok 5 #1', iterationHash: 'oo9',
  artifactUri: null, displayUri: null, thumbnailUri: 'ipfs://t', attributes: [], minter: 'M', ...over,
})

/** The middle gentk contract — the one that used to be unreachable entirely. */
const PROJECT_CONTRACT = tzkt.GENTK_CONTRACTS[1]

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(token)
  // Default: no mapping entry, i.e. the fallback generatorUri join. Stated explicitly
  // because leaving it unmocked ran the real loader, whose relative-URL fetch happens
  // to fail in this environment — so these tests were exercising the fallback path by
  // accident, and would have silently changed meaning the day someone stubbed fetch.
  vi.spyOn(data, 'loadIterationIds').mockResolvedValue(null)
  // Likewise the contract mapping: the ids alone cannot say which gentk contract a
  // project's iterations live on, so the page has to resolve both.
  vi.spyOn(data, 'loadIterationContract').mockResolvedValue(PROJECT_CONTRACT)
  // Default: never traded. Stated explicitly so unrelated tests don't hit the real
  // loader, whose relative-URL fetch fails in jsdom.
  vi.spyOn(data, 'loadProjectMarketStats').mockResolvedValue(null)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  data._resetCache()
})

test('renders project info and iterations from tzkt', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([iter()])
  renderAt('/token/tok-5')
  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByRole('link', { name: /Tok 5 #1/ }).getAttribute('href')).toContain('/gentk/KT1x/9')

  // Edition size (supply) plus the authoritative mint count from the captured
  // mapping — never the structurally-zero `iterationsCount` field (2 on this
  // fixture), and never how many rows happen to be paged in, which changes as
  // you scroll. This fixture has no mapping entry, so no mint count shows.
  const editionLine = await screen.findByText(/edition of/i)
  expect(editionLine.textContent).toBe('edition of 10')
  expect(screen.queryByText(/iterations loaded/i)).toBeNull()
  expect(screen.queryByText(/2 iterations · supply/i)).toBeNull()
})

test('shows unavailable notice when tzkt fails', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockRejectedValue(new Error('down'))
  renderAt('/token/tok-5')
  expect(await screen.findByText(/iterations unavailable/i)).toBeTruthy()
})

test('shows a terminal message when the project has no generativeUri', async () => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue({ ...token, generativeUri: null })
  const fetchSpy = vi.spyOn(tzkt, 'fetchIterations').mockClear()
  renderAt('/token/tok-5')
  expect(await screen.findByText(/no iterations available/i)).toBeTruthy()
  expect(screen.queryByText(/loading iterations/i)).toBeNull()
  expect(fetchSpy).not.toHaveBeenCalled()
})

test('shows a message when tzkt returns zero iterations', async () => {
  // "Never minted" may only be claimed from the authoritative mapping saying so.
  // An empty generatorUri join is *not* evidence of that (it misses ~33% of tokens),
  // so this case is now sourced from the mapping; see the fallback test below.
  vi.spyOn(data, 'loadIterationIds').mockResolvedValueOnce([])
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([])
  renderAt('/token/tok-5')
  expect(await screen.findByText(/no iterations have been minted/i)).toBeTruthy()
})

test('resets state when the slug changes on an already-mounted page', async () => {
  const tokenA = token
  const tokenB: LeanToken = { ...token, slug: 'tok-6', name: 'Tok 6', generativeUri: 'ipfs://QmGenB' }

  vi.spyOn(data, 'findTokenBySlug').mockImplementation((slug: string) =>
    Promise.resolve(slug === 'tok-5' ? tokenA : slug === 'tok-6' ? tokenB : null),
  )
  vi.spyOn(tzkt, 'fetchIterations').mockImplementation((uri: string) =>
    Promise.resolve(
      uri === tokenA.generativeUri
        ? [iter({ contract: 'KT1a', tokenId: '1', name: 'A-Iter' })]
        : [iter({ contract: 'KT1b', tokenId: '2', name: 'B-Iter' })],
    ),
  )

  render(
    <MemoryRouter initialEntries={['/token/tok-5']}>
      <Link to="/token/tok-6">go to B</Link>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('A-Iter')).toBeTruthy()

  fireEvent.click(screen.getByText('go to B'))

  // Stale content from project A must not linger while B loads or after it loads.
  expect(await screen.findByRole('heading', { name: 'Tok 6' })).toBeTruthy()
  expect(await screen.findByText('B-Iter')).toBeTruthy()
  expect(screen.queryByText('A-Iter')).toBeNull()
  expect(screen.queryByText('Tok 5')).toBeNull()
})

// --- the committed iteration mapping ----------------------------------------
// The generatorUri join misses ~33% of on-chain tokens (the whole launch era),
// so the snapshot's project -> objkt-id mapping is the primary source.

test('renders iterations sourced from the mapping, not the generatorUri join', async () => {
  const loadIds = vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955', 'FX0-960'])
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([
    iter({ contract: 'KT1v1', tokenId: '955', name: 'BINGO #1' }),
    iter({ contract: 'KT1v1', tokenId: '960', name: 'BINGO #2' }),
  ])

  renderAt('/token/tok-5')

  expect(await screen.findByText('BINGO #1')).toBeTruthy()
  expect(screen.getByText('BINGO #2')).toBeTruthy()
  expect(loadIds).toHaveBeenCalledWith('tok-5', 5)
  expect(byIds).toHaveBeenCalledWith(['FX0-955', 'FX0-960'], PROJECT_CONTRACT, 0, 48)
  // The lossy join must not be consulted when the mapping answered.
  expect(join).not.toHaveBeenCalled()
  // Two ids in the mapping, so "2 minted" — the count of what was actually
  // minted, which stays put regardless of how far the iteration list is paged.
  expect((await screen.findByText(/edition of/i)).textContent).toBe('edition of 10 · 2 minted')
})

test('an empty mapping is the one case that may claim the project was never minted', async () => {
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue([])
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  expect(await screen.findByText(/no iterations have been minted for this project/i)).toBeTruthy()
  expect(screen.queryByText(/could not load/i)).toBeNull()
  // Nothing to ask the chain about, and no reason to fall back.
  expect(byIds).not.toHaveBeenCalled()
  expect(join).not.toHaveBeenCalled()
})

test('a failed mapping load falls back to the join and never asserts "never minted"', async () => {
  vi.spyOn(data, 'loadIterationIds').mockClear().mockRejectedValue(new Error('map-000.json: HTTP 404'))
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  expect(await screen.findByText(/could not load iterations for this project/i)).toBeTruthy()
  expect(screen.queryByText(/have been minted/i)).toBeNull()
  expect(join).toHaveBeenCalledWith('ipfs://QmGen', 0, 48)
})

test('a missing mapping entry falls back to the join and shows what it finds', async () => {
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(null)
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([iter({ name: 'Joined #1' })])
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  expect(await screen.findByText('Joined #1')).toBeTruthy()
  expect(join).toHaveBeenCalled()
  expect(byIds).not.toHaveBeenCalled()
})

test('a TzKT failure on the mapping path reports unavailable, without a silent fallback', async () => {
  // The primary path's failure state had no coverage at all: every test that reached
  // "Iterations unavailable" got there through the fallback join.
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955', 'FX0-960'])
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockRejectedValue(new Error('TzKT: HTTP 502'))
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  // The ids are held locally, so an unreachable indexer costs previews, not the
  // list — and not the names either: "<project> #<n>" is rebuilt from the project
  // and the iteration's position, which is exactly how fxhash named them.
  expect(await screen.findByText(/titles and preview images are unavailable/i)).toBeTruthy()
  expect(screen.getByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByText('Tok 5 #2')).toBeTruthy()
  // A bare gentk token id says nothing to a visitor and must not be what they see.
  expect(screen.queryByText('#955')).toBeNull()
  // Knowing the ids exist, an unreachable indexer must never read as "never minted".
  expect(screen.queryByText(/have been minted/i)).toBeNull()
  expect(byIds).toHaveBeenCalled()
  expect(join).not.toHaveBeenCalled()
})

test('a slug change resets a populated mapping, not just an empty one', async () => {
  const tokenB: LeanToken = { ...token, id: 6, slug: 'tok-6', name: 'Tok 6' }
  vi.spyOn(data, 'findTokenBySlug').mockImplementation(async (slug: string) =>
    slug === 'tok-5' ? token : tokenB)
  vi.spyOn(data, 'loadIterationIds').mockClear().mockImplementation(async (slug: string) =>
    slug === 'tok-5' ? ['FX0-1'] : ['FX0-2'])
  vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockImplementation(async (ids: string[], contract: string) =>
    ids.map((id) => iter({ contract, tokenId: id.split('-')[1], name: `iter-${id}` })))

  render(
    <MemoryRouter initialEntries={['/token/tok-5']}>
      <Link to="/token/tok-6">go to B</Link>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByText('iter-FX0-1')).toBeTruthy()
  fireEvent.click(screen.getByText('go to B'))

  expect(await screen.findByText('iter-FX0-2')).toBeTruthy()
  expect(screen.queryByText('iter-FX0-1')).toBeNull()
})

test('a zero-row first page still offers "Load more" for the remaining ids', async () => {
  // TzKT can answer a page with no rows while plenty of ids remain. Gating the button
  // on a non-empty grid stranded everything after that page with no way forward.
  const ids = Array.from({ length: 100 }, (_, i) => `FX0-${i}`)
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(ids)
  vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockImplementation(
    async (_ids: string[], contract: string, offset = 0, limit = 48) =>
      offset === 0
        ? []
        : ids.slice(offset, offset + limit).map((id) => iter({ contract, tokenId: id.split('-')[1], name: id })),
  )

  renderAt('/token/tok-5')

  const more = await screen.findByRole('button', { name: /load more/i })
  fireEvent.click(more)
  expect(await screen.findByText('FX0-48')).toBeTruthy()
})

// --- "could not load" is not "does not exist" --------------------------------

test('a failed project lookup offers a retry instead of claiming the project is gone', async () => {
  vi.mocked(data.findTokenBySlug).mockRejectedValueOnce(new Error('slug-index.json: HTTP 503'))

  renderAt('/token/tok-5')

  expect(await screen.findByText(/could not load this project/i)).toBeTruthy()
  expect(screen.queryByText(/not found/i)).toBeNull()

  // The mocked lookup succeeds on the retry, exactly as a recovered network would.
  fireEvent.click(screen.getByRole('button', { name: /retry/i }))
  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
})

test('a slug that genuinely is not in the snapshot still renders not-found', async () => {
  vi.mocked(data.findTokenBySlug).mockResolvedValue(null)
  renderAt('/token/no-such-project')
  expect(await screen.findByText(/not found/i)).toBeTruthy()
  expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
})

// --- moderation --------------------------------------------------------------

test('a moderated project is unreachable by direct link, through the real data layer', async () => {
  // Deliberately not mocking the data layer: the guarantee ("hidden from the browse
  // grid and lookups") only means anything if the lookup itself enforces it.
  vi.mocked(data.findTokenBySlug).mockRestore()
  data._resetCache()
  const flagged: LeanToken = { ...token, id: 7, slug: 'bad-tok', name: 'Plagiarised', flag: 'MALICIOUS' }
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const u = String(url)
    if (u.endsWith('tokens/slug-index.json')) return { ok: true, json: async () => ({ 'bad-tok': 0 }) } as Response
    if (u.endsWith('tokens/index-000.json')) return { ok: true, json: async () => [flagged] } as Response
    return { ok: false, status: 404 } as Response
  }))

  renderAt('/token/bad-tok')

  expect(await screen.findByText(/not found/i)).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Plagiarised' })).toBeNull()
  // Above all: no route to executing a flagged project's code.
  expect(screen.queryByRole('button', { name: /run live/i })).toBeNull()
})

test('"Load more" pages through the mapping by offset and stops at the end', async () => {
  const ids = Array.from({ length: 50 }, (_, i) => `FX0-${i}`)
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(ids)
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockImplementation(
    async (_ids: string[], contract: string, offset = 0, limit = 48) =>
      ids.slice(offset, offset + limit).map((id) => iter({ contract, tokenId: id.split('-')[1], name: id })),
  )

  renderAt('/token/tok-5')

  expect(await screen.findByText('FX0-0')).toBeTruthy()
  expect(screen.queryByText('FX0-49')).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /load more/i }))

  expect(await screen.findByText('FX0-49')).toBeTruthy()
  expect(byIds.mock.calls.map((c) => c[2])).toEqual([0, 48])
  expect(screen.queryByRole('button', { name: /load more/i })).toBeNull()
})

// --- which contract the iterations live on -----------------------------------
// The `FX{n}` prefix of an id is the issuer version, not the gentk contract, so the
// contract comes from its own mapping and is passed to TzKT explicitly.

test('ids with no contract entry fall back to the join rather than guessing a contract', async () => {
  // A wrong contract renders another project's artwork under this project's name,
  // which is far worse than the lossy join or an honest error.
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955'])
  vi.spyOn(data, 'loadIterationContract').mockClear().mockResolvedValue(null)
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([])
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([iter({ name: 'Joined #1' })])

  renderAt('/token/tok-5')

  expect(await screen.findByText('Joined #1')).toBeTruthy()
  expect(byIds).not.toHaveBeenCalled()
  expect(join).toHaveBeenCalledWith('ipfs://QmGen', 0, 48)
})

test('a failed contract lookup falls back to the join instead of guessing', async () => {
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955'])
  vi.spyOn(data, 'loadIterationContract').mockClear().mockRejectedValue(new Error('contracts.json: HTTP 404'))
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([])
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([iter({ name: 'Joined #1' })])

  renderAt('/token/tok-5')

  expect(await screen.findByText('Joined #1')).toBeTruthy()
  expect(byIds).not.toHaveBeenCalled()
  expect(join).toHaveBeenCalled()
})

test('no contract entry and no generativeUri says so, and still never guesses', async () => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue({ ...token, generativeUri: null })
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955'])
  vi.spyOn(data, 'loadIterationContract').mockClear().mockResolvedValue(null)
  const byIds = vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockResolvedValue([])
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  expect(await screen.findByText(/no iterations available/i)).toBeTruthy()
  expect(byIds).not.toHaveBeenCalled()
  expect(join).not.toHaveBeenCalled()
})

test('an empty mapping still claims "never minted" even without a contract entry', async () => {
  // A project with zero iterations has no contract entry by construction; that must
  // not downgrade the one case where "never minted" is actually known.
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue([])
  vi.spyOn(data, 'loadIterationContract').mockClear().mockResolvedValue(null)
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear().mockResolvedValue([])

  renderAt('/token/tok-5')

  expect(await screen.findByText(/no iterations have been minted/i)).toBeTruthy()
  expect(join).not.toHaveBeenCalled()
})

// --- historical trading figures -----------------------------------------
// An archive, not a marketplace: sales appear only as historical record
// (total traded, highest sale), never floor/med/lo/listed.

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

test('clears stale trading figures when navigating to a project with none of its own', async () => {
  // Trading figures displayed beneath the wrong project's name would be a factual
  // misstatement, not a cosmetic flicker — this archive's whole purpose is being
  // accurate about what belongs to what.
  const tokenA = token
  const tokenB: LeanToken = { ...token, id: 6, slug: 'tok-6', name: 'Tok 6' }

  vi.spyOn(data, 'findTokenBySlug').mockImplementation((slug: string) =>
    Promise.resolve(slug === 'tok-5' ? tokenA : slug === 'tok-6' ? tokenB : null),
  )
  vi.spyOn(data, 'loadProjectMarketStats').mockImplementation((slug: string) =>
    slug === 'tok-5'
      ? Promise.resolve({ pv: 5_000_000, pn: 1, sv: 0, sn: 0, floor: null, med: null, hi: null, lo: null, listed: 0 })
      // Deliberately never resolves for B: this proves the previous project's figures
      // are cleared by the synchronous per-slug reset, not merely overwritten once B's
      // own (still-pending) stats eventually load.
      : new Promise(() => {}),
  )

  render(
    <MemoryRouter initialEntries={['/token/tok-5']}>
      <Link to="/token/tok-6">go to B</Link>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText(/5 tez traded/)).toBeTruthy()

  fireEvent.click(screen.getByText('go to B'))

  expect(await screen.findByRole('heading', { name: 'Tok 6' })).toBeTruthy()
  // Project B's own market effect never resolves in this test. If A's figures had not
  // been cleared synchronously alongside the rest of the per-slug reset, they would
  // still be visible right now, under B's name.
  expect(screen.queryByText(/tez/i)).toBeNull()
})

test('with TzKT entirely unreachable, the whole edition is still listed from local ids', async () => {
  // The offline case: no indexer at all. Every id, and therefore the size of the
  // edition and each piece's identity, is known from the captured mapping — only
  // the titles and thumbnails ever needed the network.
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955', 'FX0-960', 'FX0-961'])
  vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockRejectedValue(new Error('offline'))
  const join = vi.spyOn(tzkt, 'fetchIterations').mockClear()

  renderAt('/token/tok-5')

  expect(await screen.findByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByText('Tok 5 #2')).toBeTruthy()
  expect(screen.getByText('Tok 5 #3')).toBeTruthy()
  // The count comes from the local ids, so a visitor can see how large the edition is.
  expect(screen.getByRole('heading', { name: /iterations \(3\)/i })).toBeTruthy()
  // The lossy join must not be attempted just because the id path failed.
  expect(join).not.toHaveBeenCalled()
})

test('missing thumbnails say why rather than leaving a blank tile', async () => {
  vi.spyOn(data, 'loadIterationIds').mockClear().mockResolvedValue(['FX0-955'])
  vi.spyOn(tzkt, 'fetchIterationsByIds').mockClear().mockRejectedValue(new Error('offline'))

  renderAt('/token/tok-5')

  await screen.findByText('Tok 5 #1')
  // Three different statements, and a visitor should be able to tell them apart:
  // "no image recorded" is about the artwork, "IPFS unreachable" is about the
  // gateways, and this one is about not having reached the indexer at all.
  expect(screen.getAllByTitle(/preview unavailable/i).length).toBeGreaterThan(0)
})
