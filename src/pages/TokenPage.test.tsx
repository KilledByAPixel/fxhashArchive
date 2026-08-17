import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import TokenPage from './TokenPage'
import * as data from '../lib/data'
import * as tzkt from '../lib/tzkt'
import type { LeanToken } from '../lib/types'
import type { Iteration } from '../lib/tzkt'

const token: LeanToken = {
  id: 5, slug: 'tok-5', name: 'Tok 5', flag: 'CLEAN', supply: 10, iterationsCount: 2,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null,
  displayUri: 'ipfs://QmDisp', generativeUri: 'ipfs://QmGen', tags: ['geo'],
  author: { id: 'tz1a', name: 'Alice', avatarUri: null },
}

const iter = (over: Partial<Iteration> = {}): Iteration => ({
  contract: 'KT1x', tokenId: '9', name: 'Tok 5 #1', iterationHash: 'oo9',
  artifactUri: null, displayUri: null, thumbnailUri: 'ipfs://t', attributes: [], minter: 'M', ...over,
})

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue(token)
})

afterEach(cleanup)

test('renders project info and iterations from tzkt', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([iter()])
  renderAt('/token/tok-5')
  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByRole('link', { name: /Tok 5 #1/ }).getAttribute('href')).toContain('/gentk/KT1x/9')

  // Ruling 1: edition size (supply) plus the *loaded* tzkt count, never the
  // structurally-zero `iterationsCount` field (which is 2 on this fixture).
  const editionLine = await screen.findByText(/edition of/i)
  expect(editionLine.textContent).toBe('edition of 10 · 1 iterations loaded')
  expect(screen.queryByText(/2 iterations · supply/i)).toBeNull()
})

test('shows unavailable notice when tzkt fails', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockRejectedValue(new Error('down'))
  renderAt('/token/tok-5')
  expect(await screen.findByText(/iterations unavailable/i)).toBeTruthy()
})

test('shows a terminal message when the project has no generativeUri', async () => {
  vi.spyOn(data, 'findTokenBySlug').mockResolvedValue({ ...token, generativeUri: null })
  const fetchSpy = vi.spyOn(tzkt, 'fetchIterations').mockClear()
  renderAt('/token/tok-5')
  expect(await screen.findByText(/no iterations available/i)).toBeTruthy()
  expect(screen.queryByText(/loading iterations/i)).toBeNull()
  expect(fetchSpy).not.toHaveBeenCalled()
})

test('shows a message when tzkt returns zero iterations', async () => {
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([])
  renderAt('/token/tok-5')
  expect(await screen.findByText(/no iterations have been minted/i)).toBeTruthy()
})

test('resets state when the slug changes on an already-mounted page', async () => {
  const tokenA = token
  const tokenB: LeanToken = { ...token, slug: 'tok-6', name: 'Tok 6', generativeUri: 'ipfs://QmGenB' }

  vi.spyOn(data, 'findTokenBySlug').mockImplementation((slug: string) =>
    Promise.resolve(slug === 'tok-5' ? tokenA : slug === 'tok-6' ? tokenB : null),
  )
  vi.spyOn(tzkt, 'fetchIterations').mockImplementation((uri: string) =>
    Promise.resolve(
      uri === tokenA.generativeUri
        ? [iter({ contract: 'KT1a', tokenId: '1', name: 'A-Iter' })]
        : [iter({ contract: 'KT1b', tokenId: '2', name: 'B-Iter' })],
    ),
  )

  render(
    <MemoryRouter initialEntries={['/token/tok-5']}>
      <Link to="/token/tok-6">go to B</Link>
      <Routes><Route path="/token/:slug" element={<TokenPage />} /></Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('A-Iter')).toBeTruthy()

  fireEvent.click(screen.getByText('go to B'))

  // Stale content from project A must not linger while B loads or after it loads.
  expect(await screen.findByRole('heading', { name: 'Tok 6' })).toBeTruthy()
  expect(await screen.findByText('B-Iter')).toBeTruthy()
  expect(screen.queryByText('A-Iter')).toBeNull()
  expect(screen.queryByText('Tok 5')).toBeNull()
})
