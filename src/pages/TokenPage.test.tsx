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

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(token)
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

  // Ruling 1: edition size (supply) plus the *loaded* tzkt count, never the
  // structurally-zero `iterationsCount` field (which is 2 on this fixture).
  const editionLine = await screen.findByText(/edition of/i)
  expect(editionLine.textContent).toBe('edition of 10 · 1 iterations loaded')
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
  expect(byIds).toHaveBeenCalledWith(['FX0-955', 'FX0-960'], 0, 48)
  // The lossy join must not be consulted when the mapping answered.
  expect(join).not.toHaveBeenCalled()
  expect((await screen.findByText(/edition of/i)).textContent).toBe('edition of 10 · 2 iterations loaded')
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
    async (_ids: string[], offset = 0, limit = 48) =>
      ids.slice(offset, offset + limit).map((id) => iter({ contract: 'KT1v1', tokenId: id.split('-')[1], name: id })),
  )

  renderAt('/token/tok-5')

  expect(await screen.findByText('FX0-0')).toBeTruthy()
  expect(screen.queryByText('FX0-49')).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /load more/i }))

  expect(await screen.findByText('FX0-49')).toBeTruthy()
  expect(byIds.mock.calls.map((c) => c[1])).toEqual([0, 48])
  expect(screen.queryByRole('button', { name: /load more/i })).toBeNull()
})
