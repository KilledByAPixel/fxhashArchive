import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BrowsePage from './BrowsePage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const tok = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: id, iterationsCount: id,
  createdAt: null, mintOpensAt: `2022-01-0${id}T00:00:00Z`, thumbnailUri: null, displayUri: null,
  generativeUri: null, tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null }, ...over,
})

beforeEach(() => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([
    tok(1), tok(2), tok(3, { flag: 'MALICIOUS' }),
  ])
})

afterEach(cleanup)

test('renders visible tokens newest-first, hides flagged', async () => {
  render(<MemoryRouter><BrowsePage /></MemoryRouter>)
  const cards = await screen.findAllByRole('link', { name: /Tok/ })
  expect(cards.map((c) => c.textContent)).toEqual(['Tok 2Alice', 'Tok 1Alice'])
  expect(screen.queryByText('Tok 3')).toBeNull()
})

test('search filters by name', async () => {
  render(<MemoryRouter><BrowsePage /></MemoryRouter>)
  await screen.findAllByRole('link', { name: /Tok/ })
  const { fireEvent } = await import('@testing-library/react')
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Tok 1' } })
  expect(screen.queryByText('Tok 2')).toBeNull()
  expect(screen.getByText('Tok 1')).toBeTruthy()
})

test('sorting by "Largest edition" reorders the grid by supply descending', async () => {
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([
    tok(1, { supply: 5 }),
    tok(2, { supply: 50 }),
    tok(3, { supply: 20 }),
  ])
  render(<MemoryRouter><BrowsePage /></MemoryRouter>)
  await screen.findAllByRole('link', { name: /Tok/ })
  const { fireEvent } = await import('@testing-library/react')
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'edition' } })
  const cards = await screen.findAllByRole('link', { name: /Tok/ })
  expect(cards.map((c) => c.textContent)).toEqual(['Tok 2Alice', 'Tok 3Alice', 'Tok 1Alice'])
})
