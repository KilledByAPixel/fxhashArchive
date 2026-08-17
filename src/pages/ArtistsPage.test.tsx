import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import ArtistsPage from './ArtistsPage'
import ArtistPage from './ArtistPage'
import * as data from '../lib/data'
import type { Artist, LeanToken } from '../lib/types'

beforeEach(() => {
  vi.spyOn(data, 'loadArtists').mockResolvedValue([
    { id: 'tz1a', name: 'Alice', avatarUri: null, description: 'bio', tokenCount: 3 },
    { id: 'tz1b', name: 'Bob', avatarUri: null, description: null, tokenCount: 1 },
  ])
})

afterEach(cleanup)

test('lists artists with counts and links', async () => {
  render(<MemoryRouter><ArtistsPage /></MemoryRouter>)
  const alice = await screen.findByRole('link', { name: /Alice/ })
  expect(alice.getAttribute('href')).toContain('/artist/tz1a')
  expect(screen.getByText(/3 projects/)).toBeTruthy()
})

test('search filters artists', async () => {
  render(<MemoryRouter><ArtistsPage /></MemoryRouter>)
  await screen.findByRole('link', { name: /Alice/ })
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'bob' } })
  expect(screen.queryByText('Alice')).toBeNull()
  expect(screen.getByText('Bob')).toBeTruthy()
})

// Ruling 2 regression test: ArtistPage must reset `artist` and `tokens` when the
// `:id` route param changes, since React Router keeps the component mounted
// across a param-only navigation. Without the reset, navigating from artist A to
// artist B would show A's name/bio/projects until B's fetch resolves.
const artistA: Artist = { id: 'tz1a', name: 'Alice', avatarUri: null, description: 'Alice bio', tokenCount: 1 }
const artistB: Artist = { id: 'tz1b', name: 'Bob', avatarUri: null, description: 'Bob bio', tokenCount: 1 }

const tokenA: LeanToken = {
  id: 1, slug: 'alice-proj', name: 'Alice Project', flag: 'CLEAN', supply: 10, iterationsCount: 0,
  createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null, generativeUri: null,
  tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null },
}
const tokenB: LeanToken = {
  id: 2, slug: 'bob-proj', name: 'Bob Project', flag: 'CLEAN', supply: 10, iterationsCount: 0,
  createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null, generativeUri: null,
  tags: [], author: { id: 'tz1b', name: 'Bob', avatarUri: null },
}

test('resets artist and project grid when the :id param changes on an already-mounted page', async () => {
  vi.spyOn(data, 'loadTokensMap').mockResolvedValue({ tz1a: [1], tz1b: [2] })
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([tokenA, tokenB])

  // loadArtists resolves immediately for the first (mount) call, but the second
  // call — triggered by navigating to Bob while the page stays mounted — hangs
  // until we manually resolve it. This lets us inspect the DOM in the window
  // between "navigation happened" and "Bob's data arrived," which is exactly
  // where a missing state reset would leave Alice's content on screen.
  let resolveSecond!: (v: Artist[]) => void
  let call = 0
  vi.spyOn(data, 'loadArtists').mockImplementation(() => {
    call += 1
    if (call === 1) return Promise.resolve([artistA, artistB])
    return new Promise((resolve) => { resolveSecond = resolve })
  })

  render(
    <MemoryRouter initialEntries={['/artist/tz1a']}>
      <Link to="/artist/tz1b">go to Bob</Link>
      <Routes><Route path="/artist/:id" element={<ArtistPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeTruthy()
  expect(await screen.findByText('Alice Project')).toBeTruthy()

  fireEvent.click(screen.getByText('go to Bob'))

  // Bob's fetch is still pending here. A correct reset clears Alice's content
  // synchronously on navigation, before any new data has arrived.
  await new Promise((r) => setTimeout(r, 0))
  expect(screen.queryByRole('heading', { name: 'Alice' })).toBeNull()
  expect(screen.queryByText('Alice Project')).toBeNull()
  expect(screen.getByText(/loading/i)).toBeTruthy()

  resolveSecond([artistA, artistB])

  // Once Bob's data resolves, his content renders and Alice's stays gone.
  expect(await screen.findByRole('heading', { name: 'Bob' })).toBeTruthy()
  expect(await screen.findByText('Bob Project')).toBeTruthy()
  expect(screen.queryByText('Alice')).toBeNull()
  expect(screen.queryByText('Alice Project')).toBeNull()
})
