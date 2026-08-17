import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
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

beforeEach(() => {
  vi.spyOn(data, 'loadArtists').mockResolvedValue([artist])
  vi.spyOn(data, 'loadTokensMap').mockResolvedValue({ tz1a: [1, 2] })
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([tok(1), tok(2, { flag: 'MALICIOUS' })])
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

test('a failed load offers a retry instead of claiming the artist does not exist', async () => {
  vi.mocked(data.loadArtists).mockRejectedValueOnce(new Error('artists/index.json: HTTP 503'))

  renderAt('tz1a')

  expect(await screen.findByText(/could not load this artist/i)).toBeTruthy()
  expect(screen.queryByText(/not found/i)).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: /retry/i }))
  expect(await screen.findByRole('heading', { name: 'Alice' })).toBeTruthy()
})
