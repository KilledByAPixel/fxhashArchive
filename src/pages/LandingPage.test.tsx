import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import * as data from '../lib/data'
import type { LeanToken } from '../lib/types'

const token = (id: number): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: 1, iterationsCount: 0,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null, displayUri: null,
  generativeUri: 'ipfs://gen', tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null },
})

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: {
    projects: 27430, artists: 5407, iterations: 1845509, seeds: 1802387, archived: 396,
    archivedShareOfVolume: 70.5,
  },
  ranked: [3, 1, 2],
  archived: [1],
  // Deliberately does NOT start at p:1 — the real curve starts at p:0.25 (see
  // CURVE_POINTS in scripts/summary-lib.mjs). A fixture starting at p:1 would let
  // a bug that reads curve[0] instead of the p===1 point pass by accident.
  curve: [
    { p: 0.25, share: 45.6 },
    { p: 0.5, share: 56.5 },
    { p: 1, share: 67.1 },
    { p: 10, share: 94.6 },
    { p: 100, share: 100 },
  ],
}

beforeEach(() => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([token(1), token(2), token(3)])
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const renderPage = () => render(<MemoryRouter><LandingPage /></MemoryRouter>)

test('shows the headline counts', async () => {
  renderPage()
  expect(await screen.findByText('1,802,387')).toBeTruthy()
  expect(screen.getByText('27,430')).toBeTruthy()
  expect(screen.getByText('396')).toBeTruthy()
})

test('contrasts share of projects against share of collector interest', async () => {
  renderPage()
  // 396 archived of 27,430 catalogued = 1.4% of projects, against 70.5% of all
  // collector spending. The whole point of showing them together is that the
  // second dwarfs the first, so assert both — either one alone proves nothing.
  const projects = await screen.findByTestId('share-projects')
  const interest = screen.getByTestId('share-interest')
  expect(projects.textContent).toContain('1.4%')
  expect(interest.textContent).toContain('70.5%')
})

test('seed coverage reads 100%, against the seeds that exist', async () => {
  renderPage()
  const seeds = await screen.findByTestId('share-seeds')
  expect(seeds.textContent).toContain('100.0%')
  // 1,845,509 iterations - 1,802,387 seeds = 43,122 mints that were never signed.
  // Naming them is what stops 100% looking like a rounded-up 97.7%.
  expect(screen.getByText(/43,122 remaining mints were never signed/)).toBeTruthy()
})

test('bar widths reflect their percentages', async () => {
  renderPage()
  const interest = await screen.findByTestId('share-interest')
  const fill = interest.querySelector('.bar-fill') as HTMLElement
  // jsdom normalises the trailing zero from '70.50%'
  expect(fill.style.width).toBe('70.5%')
})

test('a percentage outside 0-100 cannot overflow its bar', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({
    ...summary,
    counts: { ...summary.counts, archivedShareOfVolume: 140 },
  })
  renderPage()
  const interest = await screen.findByTestId('share-interest')
  const fill = interest.querySelector('.bar-fill') as HTMLElement
  expect(fill.style.width).toBe('100%')
})

test('shows a random strip and a most-collected strip', async () => {
  renderPage()
  expect(await screen.findByRole('heading', { name: /random/i })).toBeTruthy()
  expect(screen.getByRole('heading', { name: /collected/i })).toBeTruthy()
})

test('most-collected strip follows the ranking', async () => {
  renderPage()
  await screen.findByRole('heading', { name: /collected/i })
  const strip = screen.getByTestId('landing-collected')
  const names = [...strip.querySelectorAll('.token-name')].map((el) => el.textContent)
  expect(names).toEqual(['Tok 3', 'Tok 1', 'Tok 2'])
})

test('survives the catalog failing to load', async () => {
  vi.spyOn(data, 'loadAllTokens').mockRejectedValue(new Error('offline'))
  renderPage()
  // Statistics still render; the art strips simply do not appear.
  expect(await screen.findByText('27,430')).toBeTruthy()
})

test('badges the archived projects in the strips', async () => {
  renderPage()
  await screen.findByRole('heading', { name: /collected/i })
  // The fixture archives exactly one project (id 1), which appears in both
  // strips. The most-collected strip is where this matters most: in production
  // it is almost entirely archived projects, and omitting the prop rendered
  // zero badges on the one row where nearly every card should carry one.
  const collected = screen.getByTestId('landing-collected')
  const random = screen.getByTestId('landing-random')
  expect(collected.querySelectorAll('.token-badge')).toHaveLength(1)
  expect(random.querySelectorAll('.token-badge')).toHaveLength(1)
})
