import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import * as data from '../lib/data'
import type { CardToken } from '../lib/types'

const card = (id: number): CardToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN',
  thumbnailUri: null, author: { id: 'tz1a', name: 'Alice' },
})

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: {
    projects: 27430, artists: 5407, iterations: 1845509, seeds: 1802387, archived: 396,
    archivedShareOfVolume: 70.5,
  },
  ranked: [3, 1, 2],
  archived: [1],
  // The strips now come from here rather than the 16.5 MB catalog. `top` is in
  // rank order; `sample` is the pool the random strip shuffles.
  featured: {
    top: [card(3), card(1), card(2)],
    sample: [card(1), card(2), card(3)],
  },
  thumbs: {},
}

beforeEach(() => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
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

test('never fetches the full catalog — the strips come from summary.json', async () => {
  const all = vi.spyOn(data, 'loadAllTokens')
  renderPage()
  await screen.findByRole('heading', { name: /collected/i })
  // This is the point of the featured cards: 200 KB instead of 16.5 MB across 29
  // requests, on the page every visitor lands on first.
  expect(all).not.toHaveBeenCalled()
})

test('says so when the summary fails, rather than showing an empty page', async () => {
  vi.spyOn(data, 'loadSummary').mockRejectedValue(new Error('offline'))
  renderPage()
  expect(await screen.findByText(/could not load archive statistics/i)).toBeTruthy()
  // The heading and intro are static, so they still explain what this site is.
  expect(screen.getByRole('heading', { level: 1, name: /archive/i })).toBeTruthy()
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
