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
  counts: { projects: 4, artists: 1, iterations: 0, seeds: 0, archived: 1 },
  ranked: [3, 1, 4, 2],
  archived: [2],
  curve: [{ p: 1, share: 50 }],
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

test('offers random, most collected and newest', async () => {
  renderPage()
  await screen.findByPlaceholderText(/search projects/i)
  expect(screen.getByRole('option', { name: /random/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /collected/i })).toBeTruthy()
  expect(screen.getByRole('option', { name: /newest/i })).toBeTruthy()
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
    counts: { projects: 4, artists: 1, iterations: 0, seeds: 0, archived: 0 },
    ranked: [3, 1], // Only tokens 3 and 1 have recorded trades; 2 and 4 are unranked
    archived: [],
    curve: [{ p: 1, share: 50 }],
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
  expect(screen.getAllByTitle(/playable offline/i)).toHaveLength(1)
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
