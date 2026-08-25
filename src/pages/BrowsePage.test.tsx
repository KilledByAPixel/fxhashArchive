import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BrowsePage from './BrowsePage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const token = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: id, iterationsCount: 0,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null, displayUri: null,
  generativeUri: 'ipfs://gen', tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null },
  ...over,
})

const tokens = [token(1), token(2), token(3), token(4)]

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 4, artists: 1, iterations: 0, seeds: 0, archived: 1, archivedShareOfVolume: 25 },
  ranked: [3, 1, 4, 2],
  archived: [2], runners: [],
  featured: { top: [], sample: [] },
  thumbs: {},
}

beforeEach(() => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(tokens)
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const renderPage = () => render(<MemoryRouter><BrowsePage /></MemoryRouter>)
const names = () => screen.queryAllByText(/^Tok \d$/).map((el) => el.textContent)

test('largest-edition sorting is gone', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.queryByRole('option', { name: /edition/i })).toBeNull()
})

test('offers random, most collected, newest and oldest', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.getByRole('option', { name: /random/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /collected/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /newest/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /oldest/i })).toBeTruthy()
})

test('defaults to random, not newest', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('random')
})

test('most collected follows the ranking from summary.json', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'collected' } })
  expect(names()).toEqual(['Tok 3', 'Tok 1', 'Tok 4', 'Tok 2'])
})

test('unranked projects sort last while keeping their relative order', async () => {
  // Fixture where ranked deliberately omits some tokens, simulating projects with no trades
  const summaryWithUnranked = {
    generatedAt: '2026-08-18T00:00:00.000Z',
    counts: { projects: 4, artists: 1, iterations: 0, seeds: 0, archived: 0, archivedShareOfVolume: 0 },
    ranked: [3, 1], // Only tokens 3 and 1 have recorded trades; 2 and 4 are unranked
    archived: [], runners: [],
    featured: { top: [], sample: [] },
    thumbs: {},
  }
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summaryWithUnranked)
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'collected' } })
  // Ranked tokens (3, 1) first in rank order, then unranked tokens (2, 4) in catalog order
  expect(names()).toEqual(['Tok 3', 'Tok 1', 'Tok 2', 'Tok 4'])
})

test('random order is stable while typing in the search box', async () => {
  renderPage()
  const search = await screen.findByPlaceholderText(/search projects/i)
  const before = names()
  // A filter that matches everything: order must not be reshuffled by the keystroke.
  fireEvent.change(search, { target: { value: 'Tok' } })
  expect(names()).toEqual(before)
})

test('archived projects are badged', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  // summary.archived = [2], so exactly one badge for four projects.
  expect(screen.getAllByTitle(/fully archived/i)).toHaveLength(1)
})

test('the archived filter narrows the grid to archived projects', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.click(screen.getByLabelText(/fully archived only/i))
  expect(names()).toEqual(['Tok 2'])
})

test('the archived filter combines with search', async () => {
  renderPage()
  const search = await screen.findByPlaceholderText(/search projects/i)
  fireEvent.click(screen.getByLabelText(/fully archived only/i))
  fireEvent.change(search, { target: { value: 'Tok 3' } })
  expect(names()).toEqual([])
})

test('shows a note when the summary fails to load, but still shows the grid', async () => {
  vi.spyOn(data, 'loadSummary').mockRejectedValue(new Error('offline'))
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(
    await screen.findByText(/archive and ranking information could not be loaded/i),
  ).toBeTruthy()
  // The failure must not be mistaken for "nothing is archived": the grid itself
  // still renders normally.
  expect(names()).toHaveLength(4)
})

test('shows no summary-failure note when the summary loads fine', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.queryByText(/archive and ranking information could not be loaded/i)).toBeNull()
})

// Frank, looking at the live site: "I select newest, and this is from November
// 2023." It was Farol — made in November 2023, mint scheduled for April 2026.
// The snapshot is ordered by mintOpensAt, so Farol sat last in catalog order, and
// "Newest" reversed the catalog. Checked against the live fxhash API: the archive
// holds all 27,430 projects and the last one made is Scale, 2025-07-21.

/**
 * The Farol case in miniature: catalog order is mintOpensAt ascending, so the
 * project with the furthest-future mint comes last — and it is not the newest.
 */
const dated = [
  token(1, { createdAt: '2021-03-01T00:00:00Z', mintOpensAt: '2021-03-01T00:00:00Z' }),
  token(2, { createdAt: '2025-07-21T00:00:00Z', mintOpensAt: '2025-07-21T00:00:00Z' }),
  token(3, { createdAt: '2023-11-17T00:00:00Z', mintOpensAt: '2026-04-12T00:00:00Z' }),
]

const sortBy = async (mode: string) => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  fireEvent.change(screen.getByRole('combobox'), { target: { value: mode } })
  return names()
}

test('newest goes by when a project was made, not by where it sits in the snapshot', async () => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(dated)
  // Reversing the catalog would give 3, 2, 1 — putting the 2023 project first
  // because its mint opens in 2026. The 2025 project is the newest.
  expect(await sortBy('newest')).toEqual(['Tok 2', 'Tok 3', 'Tok 1'])
})

test('oldest is the same order the other way up', async () => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(dated)
  expect(await sortBy('oldest')).toEqual(['Tok 1', 'Tok 3', 'Tok 2'])
})

test('projects sharing a timestamp still come out in a settled order', async () => {
  const sameSecond = [
    token(3, { createdAt: '2022-05-05T00:00:00Z' }),
    token(1, { createdAt: '2022-05-05T00:00:00Z' }),
    token(2, { createdAt: '2022-05-05T00:00:00Z' }),
  ]
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(sameSecond)
  // 1,249 of the real projects share a timestamp with another, so this is the
  // common case, not a corner. Id breaks the tie, and it breaks it both ways.
  expect(await sortBy('oldest')).toEqual(['Tok 1', 'Tok 2', 'Tok 3'])
  cleanup()
  expect(await sortBy('newest')).toEqual(['Tok 3', 'Tok 2', 'Tok 1'])
})

test('a project with no date sorts last, whichever way round it is', async () => {
  const withNull = [
    token(1, { createdAt: null }),
    token(2, { createdAt: '2024-01-01T00:00:00Z' }),
    token(3, { createdAt: '2022-01-01T00:00:00Z' }),
  ]
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue(withNull)
  // An unknown date is not a very old one — it goes to the end either way, as an
  // unranked project does under "most collected".
  expect(await sortBy('newest')).toEqual(['Tok 2', 'Tok 3', 'Tok 1'])
  cleanup()
  expect(await sortBy('oldest')).toEqual(['Tok 3', 'Tok 2', 'Tok 1'])
})
