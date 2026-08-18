import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import IterationPage from './IterationPage'
import * as tzkt from '../lib/tzkt'
import * as data from '../lib/data'
import type { Iteration } from '../lib/tzkt'

const iteration: Iteration = {
  contract: 'KT1x', tokenId: '9', name: 'Piece #9', iterationHash: 'oo9',
  artifactUri: 'ipfs://QmGen/?fxhash=oo9', displayUri: 'ipfs://QmDisp', thumbnailUri: null,
  attributes: [{ name: 'Palette', value: 'Warm' }], minter: 'Minter',
}

beforeEach(() => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(iteration)
})

afterEach(() => { cleanup(); vi.restoreAllMocks() })

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/gentk/KT1x/9']}>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

test('shows image, hash, traits, minter; no iframe by default', async () => {
  renderPage()
  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.getByText('oo9')).toBeTruthy()
  expect(screen.getByText(/Palette/)).toBeTruthy()
  expect(document.querySelector('iframe')).toBeNull()
})

test('run live swaps in sandboxed iframe pointing at artifactUri', async () => {
  renderPage()
  fireEvent.click(await screen.findByRole('button', { name: /run live/i }))
  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
  expect(frame.getAttribute('src')).toBe('https://ipfs.io/ipfs/QmGen/?fxhash=oo9')
})

test('run live button toggles back to the static image', async () => {
  renderPage()
  fireEvent.click(await screen.findByRole('button', { name: /run live/i }))
  expect(document.querySelector('iframe')).not.toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /show image/i }))
  expect(document.querySelector('iframe')).toBeNull()
})

test('hides the run live button when the iteration has no artifactUri', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({ ...iteration, artifactUri: null })
  renderPage()
  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: /run live/i })).toBeNull()
})

test('resets iteration and live state when the route param changes on an already-mounted page', async () => {
  const iterA = iteration
  const iterB: Iteration = {
    contract: 'KT1y', tokenId: '3', name: 'Piece #3', iterationHash: 'oo3',
    artifactUri: 'ipfs://QmGenB/?fxhash=oo3', displayUri: 'ipfs://QmDispB', thumbnailUri: null,
    attributes: [{ name: 'Palette', value: 'Cool' }], minter: 'Minter B',
  }

  vi.spyOn(tzkt, 'fetchIteration').mockImplementation((contract: string, tokenId: string) =>
    Promise.resolve(contract === 'KT1x' && tokenId === '9' ? iterA : iterB),
  )

  render(
    <MemoryRouter initialEntries={['/gentk/KT1x/9']}>
      <Link to="/gentk/KT1y/3">go to B</Link>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  fireEvent.click(await screen.findByRole('button', { name: /run live/i }))
  expect(document.querySelector('iframe')).not.toBeNull()

  fireEvent.click(screen.getByText('go to B'))

  // Stale content and the "live" toggle from A must not linger while B loads or after.
  expect(await screen.findByRole('heading', { name: 'Piece #3' })).toBeTruthy()
  expect(screen.queryByText('Piece #9')).toBeNull()
  expect(document.querySelector('iframe')).toBeNull()
  expect(screen.getByRole('button', { name: /run live/i })).toBeTruthy()
})

test('an in-flight fetch for a superseded param cannot overwrite the newer iteration', async () => {
  const iterA = iteration
  const iterB: Iteration = {
    contract: 'KT1y', tokenId: '3', name: 'Piece #3', iterationHash: 'oo3',
    artifactUri: null, displayUri: 'ipfs://QmDispB', thumbnailUri: null,
    attributes: [], minter: 'Minter B',
  }

  let resolveA!: (v: Iteration | null) => void
  vi.spyOn(tzkt, 'fetchIteration').mockImplementation((contract: string) =>
    contract === 'KT1x'
      ? new Promise((resolve) => { resolveA = resolve })
      : Promise.resolve(iterB),
  )

  render(
    <MemoryRouter initialEntries={['/gentk/KT1x/9']}>
      <Link to="/gentk/KT1y/3">go to B</Link>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByText(/loading/i)).toBeTruthy()
  fireEvent.click(screen.getByText('go to B'))
  expect(await screen.findByRole('heading', { name: 'Piece #3' })).toBeTruthy()

  // The stale A fetch resolves after B has already rendered — must be ignored.
  resolveA(iterA)
  await new Promise((r) => setTimeout(r, 0))
  expect(screen.getByRole('heading', { name: 'Piece #3' })).toBeTruthy()
  expect(screen.queryByText('Piece #9')).toBeNull()
})

// --- "could not load" is not "does not exist" --------------------------------

test('a resolved-but-absent iteration renders not-found', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(null)
  renderPage()
  expect(await screen.findByText(/not found/i)).toBeTruthy()
  expect(screen.queryByText(/could not load/i)).toBeNull()
})

test('a rejected fetch renders a retry-able error, not not-found', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockRejectedValue(new Error('TzKT: HTTP 502'))
  renderPage()
  expect(await screen.findByText(/could not load/i)).toBeTruthy()
  expect(screen.queryByText(/not found/i)).toBeNull()
})

// --- the archived copy -------------------------------------------------------
// A gentk URL names a contract and a token, not a project, so the project id is
// carried in the link from the project page. With it, the page can run the copy
// stored in this repo instead of streaming from IPFS.

const renderWithProject = (search = '?p=42') =>
  render(
    <MemoryRouter initialEntries={[`/gentk/KT1x/9${search}`]}>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

const archivedSummary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 1, artists: 1, iterations: 1, seeds: 1, archived: 1, archivedShareOfVolume: 100 },
  ranked: [42], archived: [42],
  featured: { top: [], sample: [] },
}

test('with the indexer dead, an archived iteration still renders from local files', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockRejectedValue(new Error('offline'))
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooLOCAL')

  renderWithProject()

  const frame = (await screen.findByTitle(/archived generator/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('data/generators/42/index.html?fxhash=ooLOCAL')
  // The seed is the identity of the piece, so it is still shown even with no indexer.
  expect(screen.getByText('ooLOCAL')).toBeTruthy()
  // The old behaviour was a dead end here.
  expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
})

test('the archived copy is offered as a choice when the indexer is alive', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooLOCAL')

  renderWithProject()
  await screen.findByRole('heading', { name: 'Piece #9' })

  fireEvent.click(await screen.findByRole('button', { name: /run archived copy/i }))
  const frame = (await screen.findByTitle(/archived generator/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('fxhash=ooLOCAL')
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
})

test('a project that is not archived gets no local option', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({ ...archivedSummary, archived: [] })
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooLOCAL')

  renderWithProject()
  await screen.findByRole('heading', { name: 'Piece #9' })
  expect(screen.queryByRole('button', { name: /run archived copy/i })).toBeNull()
})

test('without the project hint the page behaves exactly as before', async () => {
  const summary = vi.spyOn(data, 'loadSummary')
  const seed = vi.spyOn(data, 'loadProjectSeed')

  renderPage()
  await screen.findByRole('heading', { name: 'Piece #9' })

  // A cold deep link cannot know the project, so it must not even ask.
  expect(summary).not.toHaveBeenCalled()
  expect(seed).not.toHaveBeenCalled()
  expect(screen.queryByRole('button', { name: /run archived copy/i })).toBeNull()
})
