import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TokenPage from './TokenPage'
import * as data from '../lib/data'
import { GENTK_CONTRACTS } from '../lib/tzkt'
import type { LeanToken } from '../lib/types'

/**
 * The regression this file pins down, exercised through the real TzKT layer rather
 * than a mocked one.
 *
 * `iterations/map-NNN.json` stores ids as `FX{n}-{tokenId}` where `n` is the *issuer*
 * version, not the gentk contract. There are three gentk contracts and `FX0` ids live
 * on two of them, so inferring the contract from the prefix sent every project on the
 * middle contract — the largest of the three — to a contract that holds none of its
 * tokens, and the page rendered "Could not load iterations for this project."
 */

const V1 = GENTK_CONTRACTS[0]
const MIDDLE = GENTK_CONTRACTS[1]

const token: LeanToken = {
  id: 20319, slug: 'century-xxx-metafranke', name: 'Century XXX', flag: 'CLEAN',
  supply: 1000, iterationsCount: 0, createdAt: null, mintOpensAt: null,
  thumbnailUri: null, displayUri: 'ipfs://QmDisp', generativeUri: 'ipfs://QmGen',
  tags: [], author: { id: 'tz1a', name: 'metafranke', avatarUri: null },
}

/** Answers a `tokenId.in` batch, but only for the contract that really holds them. */
const tzktMock = (owner: string) =>
  vi.fn(async (url: string) => {
    const u = String(url)
    const ids = /tokenId\.in=([^&]*)/.exec(u)?.[1].split(',') ?? []
    if (!u.includes(`contract=${owner}`)) return { ok: true, json: async () => [] } as Response
    return {
      ok: true,
      json: async () =>
        ids.map((id) => ({
          tokenId: id,
          firstMinter: { alias: 'metafranke' },
          metadata: { name: `Century XXX #${id}`, thumbnailUri: 'ipfs://QmThumb' },
        })),
    } as Response
  })

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/token/century-xxx-metafranke']}>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(token)
  vi.spyOn(data, 'loadIterationIds').mockResolvedValue(['FX0-100', 'FX0-101'])
  vi.spyOn(data, 'loadIterationContract').mockResolvedValue(MIDDLE)
  // The iteration player reads seed data through the same global fetch this file
  // stubs with a TzKT-shaped response, so leaving it unmocked fed it nonsense and
  // made these tests intermittently slow and flaky. It is not what this file tests.
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: null, query: null, artifact: null })
  // This file pins the *count* of real fetch calls against the stubbed TzKT
  // endpoint below, so the market-stats loader — which is unrelated to what this
  // file tests — must not add a fetch of its own to that count.
  vi.spyOn(data, 'loadProjectMarketStats').mockResolvedValue(null)
  // Mocked so the archived-player lookup does not add a second real fetch and
  // break this test's "exactly one TzKT call" assertion, which exists because a
  // whole gentk contract was once unreachable.
  vi.spyOn(data, 'loadSummary').mockRejectedValue(new Error('not needed here'))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  data._resetCache()
})

test('renders the iterations of a project that lives on the middle gentk contract', async () => {
  vi.stubGlobal('fetch', tzktMock(MIDDLE))

  renderPage()

  expect(await screen.findByText('Century XXX #100')).toBeTruthy()
  expect(screen.getByText('Century XXX #101')).toBeTruthy()
  expect(screen.queryByText(/could not load iterations/i)).toBeNull()

  // Only the indexer calls are the subject here. The page also reads local data
  // files (the player's seed lookup), and counting every fetch made this assertion
  // a tripwire for unrelated features rather than for querying the wrong contract.
  const urls = vi.mocked(fetch).mock.calls
    .map((c) => String(c[0]))
    .filter((u) => u.includes('tzkt.io'))
  expect(urls).toHaveLength(1)
  expect(urls[0]).toContain(`contract=${MIDDLE}`)
  // The `FX0-` prefix must not drag the query onto gentk v1.
  expect(urls.some((u) => u.includes(V1))).toBe(false)
})

test('iteration links point at the project\'s real contract, not one guessed from the prefix', async () => {
  vi.stubGlobal('fetch', tzktMock(MIDDLE))

  renderPage()

  const link = await screen.findByRole('link', { name: /Century XXX #100/ })
  expect(link.getAttribute('href')).toContain(`/gentk/${MIDDLE}/100`)
  expect(link.getAttribute('href')).not.toContain(V1)
})
