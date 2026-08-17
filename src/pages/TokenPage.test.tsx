import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TokenPage from './TokenPage'
import * as data from '../lib/data'
import * as tzkt from '../lib/tzkt'

const token = {
  id: 5, slug: 'tok-5', name: 'Tok 5', flag: 'CLEAN', supply: 10, iterationsCount: 2,
  createdAt: null, mintOpensAt: '2022-01-01T00:00:00Z', thumbnailUri: null,
  displayUri: 'ipfs://QmDisp', generativeUri: 'ipfs://QmGen', tags: ['geo'],
  author: { id: 'tz1a', name: 'Alice', avatarUri: null },
}

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
  vi.spyOn(tzkt, 'fetchIterations').mockResolvedValue([
    { contract: 'KT1x', tokenId: '9', name: 'Tok 5 #1', iterationHash: 'oo9',
      artifactUri: null, displayUri: null, thumbnailUri: 'ipfs://t', attributes: [], minter: 'M' },
  ])
  renderAt('/token/tok-5')
  expect(await screen.findByRole('heading', { name: 'Tok 5' })).toBeTruthy()
  expect(await screen.findByText('Tok 5 #1')).toBeTruthy()
  expect(screen.getByRole('link', { name: /Tok 5 #1/ }).getAttribute('href')).toContain('/gentk/KT1x/9')
  expect(screen.getByText(/edition of 10/i)).toBeTruthy()
  expect(screen.queryByText(/iterationsCount/i)).toBeNull()
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
