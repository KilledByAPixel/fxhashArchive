import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import IterationPage from './IterationPage'
import * as tzkt from '../lib/tzkt'
import * as data from '../lib/data'
import type { Iteration } from '../lib/tzkt'
// Asserted against the configured primary rather than a literal host: which gateway
// is usable changes (ipfs.io now serves a Cloudflare challenge), the contract does not.
import { GATEWAYS } from '../lib/ipfs'
import { liveWrapperSrc } from '../components/PieceFrame'

const iteration: Iteration = {
  contract: 'KT1x', tokenId: '9', name: 'Piece #9', iterationHash: 'oo9',
  artifactUri: 'ipfs://QmGen/?fxhash=oo9', displayUri: 'ipfs://QmDisp', thumbnailUri: null,
  attributes: [{ name: 'Palette', value: 'Warm' }], minter: 'Minter', minterAddress: null,
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

test('running the artwork swaps in sandboxed iframe pointing at artifactUri', async () => {
  renderPage()
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))
  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
  expect(frame.getAttribute('src')).toBe(liveWrapperSrc(`${GATEWAYS[0]}QmGen/?fxhash=oo9`))
})

test('the run button toggles back to the static image', async () => {
  renderPage()
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))
  expect(document.querySelector('iframe')).not.toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /show image/i }))
  expect(document.querySelector('iframe')).toBeNull()
})

test('hides the run button when the iteration has no artifactUri', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({ ...iteration, artifactUri: null })
  renderPage()
  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: /run artwork/i })).toBeNull()
})

test('resets iteration and live state when the route param changes on an already-mounted page', async () => {
  const iterA = iteration
  const iterB: Iteration = {
    contract: 'KT1y', tokenId: '3', name: 'Piece #3', iterationHash: 'oo3',
    artifactUri: 'ipfs://QmGenB/?fxhash=oo3', displayUri: 'ipfs://QmDispB', thumbnailUri: null,
    attributes: [{ name: 'Palette', value: 'Cool' }], minter: 'Minter B', minterAddress: null,
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
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))
  expect(document.querySelector('iframe')).not.toBeNull()

  fireEvent.click(screen.getByText('go to B'))

  // Stale content and the "live" toggle from A must not linger while B loads or after.
  expect(await screen.findByRole('heading', { name: 'Piece #3' })).toBeTruthy()
  expect(screen.queryByText('Piece #9')).toBeNull()
  expect(document.querySelector('iframe')).toBeNull()
  expect(screen.getByRole('button', { name: /run artwork/i })).toBeTruthy()
})

test('an in-flight fetch for a superseded param cannot overwrite the newer iteration', async () => {
  const iterA = iteration
  const iterB: Iteration = {
    contract: 'KT1y', tokenId: '3', name: 'Piece #3', iterationHash: 'oo3',
    artifactUri: null, displayUri: 'ipfs://QmDispB', thumbnailUri: null,
    attributes: [], minter: 'Minter B', minterAddress: null,
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
  ranked: [42], archived: [42], runners: [],
  featured: { top: [], sample: [] },
  thumbs: {},
}

test('with the indexer dead, an archived iteration still renders from local files', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockRejectedValue(new Error('offline'))
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })

  renderWithProject()

  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('data/generators/42/index.html?fxhash=ooLOCAL')
  // The seed is the identity of the piece, so it is still shown even with no indexer.
  expect(screen.getByText('ooLOCAL')).toBeTruthy()
  // The old behaviour was a dead end here.
  expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
})

test('with no indexer, the piece is still named the way fxhash named it', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockRejectedValue(new Error('offline'))
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })
  const bySlug = vi.spyOn(data, 'findTokenBySlug').mockResolvedValue({
    id: 42, slug: 'tok-5', name: 'Tok 5', flag: 'CLEAN', supply: 10, iterationsCount: 1,
    createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null,
    generativeUri: null, tags: [], author: null,
  })

  renderWithProject('?p=42&s=tok-5&i=7')

  // "#9" is a gentk token id: a number that identifies the piece to a database and
  // to nobody else. The project page knew the real name without a network, so it
  // hands over the two halves it takes to rebuild it.
  expect(await screen.findByRole('heading', { name: 'Tok 5 #7' })).toBeTruthy()
  expect(bySlug).toHaveBeenCalledWith('tok-5')
  // Demoted out of the title, not dropped.
  expect(screen.getByText('#9')).toBeTruthy()
})

test('the labelling hints never decide which generator runs', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockRejectedValue(new Error('offline'))
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(null)

  // A slug pointing somewhere else entirely: `p` alone selects the code to run, and
  // it is still checked against the archived set. Otherwise a hand-edited link could
  // serve one project's artwork under another's name.
  renderWithProject('?p=42&s=some-other-project&i=7')

  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('data/generators/42/')
  // No name resolved, so no invented title either.
  expect(await screen.findByRole('heading', { name: '#9' })).toBeTruthy()
})

test('one button, and it prefers the archived copy over the gateway', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })

  renderWithProject()
  await screen.findByRole('heading', { name: 'Piece #9' })

  // Asking a visitor to choose between "Run live" and "Run archived copy" made them
  // decide something that is our business, not theirs. They want to see it move.
  expect(screen.getAllByRole('button', { name: /^run /i })).toHaveLength(1)
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))
  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('fxhash=ooLOCAL')
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
})

test('the IPFS original stays reachable, as a link rather than a rival button', async () => {
  // Only matters to someone checking that the archived copy matches the original,
  // so it earns a link and not equal billing with the thing everyone wants.
  vi.spyOn(data, 'loadSummary').mockResolvedValue(archivedSummary)
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })

  renderWithProject()
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))
  await screen.findByTitle(/archived copy/i)

  fireEvent.click(screen.getByRole('button', { name: /stream the original/i }))
  const frame = (await screen.findByTitle('Piece #9')) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toBe(liveWrapperSrc(`${GATEWAYS[0]}QmGen/?fxhash=oo9`))
})

test('an unarchived project runs the original from IPFS under the same button', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({ ...archivedSummary, archived: [] })
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooLOCAL', query: null, artifact: 'ipfs://QmLive/' })

  renderWithProject()
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))

  // Not archived, so there is nothing local to prefer — but the button still runs it.
  const frame = (await screen.findByTitle('Piece #9')) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toBe(liveWrapperSrc(`${GATEWAYS[0]}QmGen/?fxhash=oo9`))
  expect(screen.queryByTitle(/archived copy/i)).toBeNull()
})

test('without the project hint the page behaves exactly as before', async () => {
  const summary = vi.spyOn(data, 'loadSummary')
  const seed = vi.spyOn(data, 'loadProjectIteration')

  renderPage()
  await screen.findByRole('heading', { name: 'Piece #9' })

  // A cold deep link cannot know the project, so it must not even ask.
  expect(summary).not.toHaveBeenCalled()
  expect(seed).not.toHaveBeenCalled()
  // The live artifact is still runnable from the indexer's record, just not the
  // archived copy — the button is present, it simply has one source to choose from.
  expect(screen.getByRole('button', { name: /run artwork/i })).toBeTruthy()
  expect(screen.queryByText(/stream the original/i)).toBeNull()
})

// --- current ownership -------------------------------------------------------

const OWNER = 'tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac'
const MINTER = 'tz1gH5qBndFDibwQ1jyZ3QDGcm35qYD7ndru'

test('shows who holds the piece now, beside who minted it', async () => {
  // Usually two different people, which is the interesting part: minting is a fact
  // about 2022 and ownership is a fact about today.
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({
    ...iteration, minter: 'Minter', minterAddress: MINTER,
  })
  vi.spyOn(tzkt, 'fetchOwner').mockResolvedValue({ address: OWNER, alias: 'Holder' })

  renderPage()

  expect(await screen.findByText('Owned by')).toBeTruthy()
  const owner = await screen.findByRole('link', { name: 'Holder' })
  expect(owner.getAttribute('href')).toBe(`https://tzkt.io/${OWNER}`)
  expect(screen.getByRole('link', { name: 'Minter' }).getAttribute('href')).toBe(
    `https://tzkt.io/${MINTER}`,
  )
})

test('an unreachable indexer costs the row, and nothing else', async () => {
  // The whole premise of the site is that it works without one. Ownership is the
  // single live-only fact on the page, so it is the single thing that may vanish.
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({ ...iteration, minterAddress: MINTER })
  vi.spyOn(tzkt, 'fetchOwner').mockRejectedValue(new Error('TzKT: HTTP 503'))

  renderPage()

  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.getByText('oo9')).toBeTruthy()
  expect(screen.getByText(/Palette/)).toBeTruthy()
  expect(screen.queryByText('Owned by')).toBeNull()
  // No error, no retry prompt: a missing enrichment is not a broken page.
  expect(screen.queryByText(/could not load/i)).toBeNull()
})

test('a token nobody holds says nothing rather than guessing', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({ ...iteration, minterAddress: MINTER })
  vi.spyOn(tzkt, 'fetchOwner').mockResolvedValue(null)

  renderPage()

  expect(await screen.findByRole('heading', { name: 'Piece #9' })).toBeTruthy()
  expect(screen.queryByText('Owned by')).toBeNull()
})

test('a minter with no address on file is still named, just not linked', async () => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({ ...iteration, minter: 'Minter', minterAddress: null })
  vi.spyOn(tzkt, 'fetchOwner').mockResolvedValue(null)

  renderPage()

  expect(await screen.findByText('Minter')).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Minter' })).toBeNull()
})
