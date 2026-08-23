import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import ArtistPage from './ArtistPage'
import * as data from '../lib/data'
import type { Artist, LeanToken } from '../lib/types'

const artist: Artist = {
  id: 'tz1a', name: 'Alice', avatarUri: null, description: 'Makes things', tokenCount: 2,
}

const tok = (id: number, over: Partial<LeanToken> = {}): LeanToken => ({
  id, slug: `tok-${id}`, name: `Tok ${id}`, flag: 'CLEAN', supply: 1, iterationsCount: 0,
  createdAt: null, mintOpensAt: null, thumbnailUri: null, displayUri: null,
  generativeUri: null, tags: [], author: { id: 'tz1a', name: 'Alice', avatarUri: null }, ...over,
})

const renderAt = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/artist/${id}`]}>
      <Routes><Route path="/artist/:id" element={<ArtistPage />} /></Routes>
    </MemoryRouter>,
  )

const noCollabs: data.Collaborations = {
  generatedAt: '2026-08-19T00:00:00.000Z',
  counts: { contracts: 0, projects: 0, artists: 0 },
  byProject: {},
  byArtist: {},
}

beforeEach(() => {
  vi.spyOn(data, 'loadArtists').mockResolvedValue([artist])
  vi.spyOn(data, 'loadTokensMap').mockResolvedValue({ tz1a: [1, 2] })
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([tok(1), tok(2, { flag: 'MALICIOUS' })])
  vi.spyOn(data, 'loadCollaborations').mockResolvedValue(noCollabs)
})

afterEach(cleanup)

test('renders the artist and only their visible projects', async () => {
  renderAt('tz1a')
  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeTruthy()
  expect(screen.getByText('Makes things')).toBeTruthy()
  expect(screen.getByText('Tok 1')).toBeTruthy()
  expect(screen.queryByText('Tok 2')).toBeNull() // moderated
})

test('an unknown artist id renders not-found', async () => {
  renderAt('tz1nobody')
  expect(await screen.findByText(/not found/i)).toBeTruthy()
  expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
})

// --- collaborations -----------------------------------------------------------
// A project minted through a shared collaboration contract is recorded under that
// contract, so it used to belong to nobody and appear on no artist's page.

const collabs: data.Collaborations = {
  generatedAt: '2026-08-19T00:00:00.000Z',
  counts: { contracts: 1, projects: 1, artists: 2 },
  byProject: {
    '3': {
      contract: 'KT1collab',
      collaborators: [
        { id: 'tz1a', name: 'Alice', share: 90 },
        { id: 'tz1b', name: 'Bob', share: 10 },
      ],
    },
  },
  byArtist: { tz1a: [3], tz1b: [3] },
}

test('a collaboration appears on the pages of each artist who made it', async () => {
  vi.spyOn(data, 'loadCollaborations').mockResolvedValue(collabs)
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([
    tok(1),
    tok(3, { name: 'Joint Work', author: { id: 'KT1collab', name: null, avatarUri: null } }),
  ])

  renderAt('tz1a')
  expect(await screen.findByText('Joint Work')).toBeTruthy()
  // And credited to the people, not to the contract they minted through.
  expect(screen.getByText('Alice and Bob')).toBeTruthy()
  expect(screen.queryByText('KT1collab')).toBeNull()
})

test('an artist known only from a collaboration still gets a page', async () => {
  // The artists index was built from people who minted something of their own, and
  // a third of collaborators never did. Answering "not found" to a link this site
  // renders itself is worse than a sparse page.
  vi.spyOn(data, 'loadCollaborations').mockResolvedValue(collabs)
  vi.spyOn(data, 'loadTokensMap').mockResolvedValue({ tz1a: [1, 2] })
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([
    tok(3, { name: 'Joint Work', author: { id: 'KT1collab', name: null, avatarUri: null } }),
  ])

  renderAt('tz1b')
  expect(await screen.findByRole('heading', { name: 'Bob' })).toBeTruthy()
  expect(screen.getByText('Joint Work')).toBeTruthy()
  expect(screen.queryByText(/not found/i)).toBeNull()
})

test('a failed load offers a retry instead of claiming the artist does not exist', async () => {
  vi.mocked(data.loadArtists).mockRejectedValueOnce(new Error('artists/index.json: HTTP 503'))

  renderAt('tz1a')

  expect(await screen.findByText(/could not load this artist/i)).toBeTruthy()
  expect(screen.queryByText(/not found/i)).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /retry/i }))
  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeTruthy()
})

test('badges the artist works whose code is fully archived', async () => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({
    generatedAt: '2026-08-18T00:00:00.000Z',
    counts: {
      projects: 2, artists: 1, iterations: 0, seeds: 0, archived: 1,
      archivedShareOfVolume: 50,
    },
    ranked: [1], archived: [1], runners: [],
    featured: { top: [], sample: [] },
    thumbs: {},
  })
  renderAt('tz1a')
  // An artist checking their own page is who the preservation request form is
  // for, so the archived state has to be visible right here.
  await screen.findByText('Tok 1')
  expect(screen.getAllByTitle(/fully archived/i)).toHaveLength(1)
})

test('an artist with a room links to it; one without has no link', async () => {
  const gallery = {
    generatedAt: 'T', counts: { paintings: 5, artists: 1, soloRooms: 1, years: [2021, 2022] as [number, number] },
    atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: [], small: [] },
    spawn: { x: 0, z: 4, yaw: 0 },
    rooms: [{ id: 'tz1a', kind: 'solo' as const, title: 'Alice', rect: { x: 0, z: 0, w: 8, d: 8 }, entry: { x: 0, z: 1, yaw: 0 } }],
    walls: [], paintings: [], signs: [],
  }
  vi.spyOn(data, 'loadGallery').mockResolvedValue(gallery)
  renderAt('tz1a')
  expect((await screen.findByRole('link', { name: /room in the gallery/i })).getAttribute('href')).toBe('/gallery?room=tz1a')
  cleanup()
  vi.spyOn(data, 'loadGallery').mockResolvedValue({ ...gallery, rooms: [] })
  renderAt('tz1a')
  await screen.findByRole('heading', { name: 'Alice' })
  expect(screen.queryByRole('link', { name: /room in the gallery/i })).toBeNull()
})

test('does not keep showing the previous artist\'s room link while navigating to one with none', async () => {
  // hasRoom is reset synchronously alongside state/tokens when the id changes, the
  // same way TokenPage resets isArchived — otherwise the stale link (still pointing
  // at the old id, via the closed-over `id` in its href) hangs around until
  // loadGallery's own fetch for the new artist happens to resolve.
  const bob: Artist = { id: 'tz1b', name: 'Bob', avatarUri: null, description: null, tokenCount: 0 }
  vi.spyOn(data, 'loadArtists').mockResolvedValue([artist, bob])
  vi.spyOn(data, 'loadTokensMap').mockResolvedValue({ tz1a: [1], tz1b: [] })
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([tok(1)])
  const gallery = {
    generatedAt: 'T', counts: { paintings: 5, artists: 1, soloRooms: 1, years: [2021, 2022] as [number, number] },
    atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: [], small: [] },
    spawn: { x: 0, z: 4, yaw: 0 },
    rooms: [{ id: 'tz1a', kind: 'solo' as const, title: 'Alice', rect: { x: 0, z: 0, w: 8, d: 8 }, entry: { x: 0, z: 1, yaw: 0 } }],
    walls: [], paintings: [], signs: [],
  }
  vi.spyOn(data, 'loadGallery')
    .mockResolvedValueOnce(gallery)
    // Bob's own load never resolves, so the only way this test can pass is the
    // synchronous reset — nothing here ever tells the page Bob has no room.
    .mockReturnValueOnce(new Promise(() => {}))

  render(
    <MemoryRouter initialEntries={['/artist/tz1a']}>
      <Link to="/artist/tz1b">go to Bob</Link>
      <Routes><Route path="/artist/:id" element={<ArtistPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('link', { name: /room in the gallery/i })).toBeTruthy()

  fireEvent.click(screen.getByText('go to Bob'))

  expect(await screen.findByRole('heading', { name: 'Bob' })).toBeTruthy()
  expect(screen.queryByRole('link', { name: /room in the gallery/i })).toBeNull()
})
