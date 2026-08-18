import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './App'
import * as data from './lib/data'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const summary = {
  generatedAt: '2026-08-18T00:00:00.000Z',
  counts: { projects: 27430, artists: 5407, iterations: 1845509, seeds: 1802387, archived: 396 },
  ranked: [1], archived: [1], curve: [{ p: 1, share: 67.9 }],
}

function renderAt(path: string) {
  vi.spyOn(data, 'loadSummary').mockResolvedValue(summary)
  vi.spyOn(data, 'loadAllTokens').mockResolvedValue([])
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

test('header links to both artwork and artists', () => {
  renderAt('/')
  expect(screen.getByRole('link', { name: 'fxhash viewer' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artwork' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artists' })).toBeTruthy()
})

test('root renders the landing page, not the grid', async () => {
  renderAt('/')
  // level: 1 is required: a second, sibling <h2> ("Random from the archive")
  // also matches /archive/i, so without pinning the level this passes only by
  // accident of the fixture stubbing loadAllTokens to [] (which suppresses that
  // h2). The moment the fixture gains a token, an unqualified match throws a
  // confusing "found multiple elements" error.
  expect(await screen.findByRole('heading', { level: 1, name: /archive/i })).toBeTruthy()
})

test('/artwork renders the grid', async () => {
  renderAt('/artwork')
  expect(await screen.findByPlaceholderText(/search projects/i)).toBeTruthy()
})

test('unknown route renders not-found', () => {
  renderAt('/definitely/not/a/route')
  expect(screen.getByText(/not found/i)).toBeTruthy()
  expect(screen.getAllByRole('link', { name: 'fxhash viewer' })).toHaveLength(1)
})
