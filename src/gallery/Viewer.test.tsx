import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Viewer from './Viewer'
import * as data from '../lib/data'
import type { Painting } from './types'

const painting: Painting = {
  project: 5, slug: 'zartz', name: 'Zartz', artist: 'KilledByAPixel', year: 2021, room: 'tz1k',
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 3,
}
const rect = { left: 100, top: 50, width: 600, height: 600 }

beforeEach(() => {
  vi.spyOn(data, 'loadSummary').mockResolvedValue({ runners: [5], archived: [5] } as never)
  vi.spyOn(data, 'loadIterationIds').mockResolvedValue(['FX1-10', 'FX1-11', 'FX1-12'])
  vi.spyOn(data, 'loadProjectIteration').mockImplementation(async (_p, tokenId) => ({
    seed: tokenId === 12 ? null : `seed${tokenId}`, query: tokenId === 12 ? null : `?fxhash=seed${tokenId}`, artifact: null,
  }))
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })

const renderViewer = (onBack = vi.fn()) =>
  render(<MemoryRouter><Viewer painting={painting} rect={rect} onBack={onBack} /></MemoryRouter>)

test('runs the first minted edition from the archived runner, placed over the painting', async () => {
  renderViewer()
  const frame = await screen.findByTitle('Zartz #1 (archived copy)')
  expect(frame.getAttribute('src')).toContain('data/generators/5/_run.html?fxhash=seed10')
  const box = frame.parentElement as HTMLElement
  expect(box.style.left).toBe('100px')
  expect(box.style.width).toBe('600px')
  // The bar sits just under the frame, inside the black mat the frame quad draws
  // around the painting; 12 px put its text half over the wall below.
  const bar = document.querySelector('.gallery-bar') as HTMLElement
  expect(bar.style.top).toBe('654px')
  expect(bar.style.left).toBe('100px')
  expect(screen.getByText(/of 3/)).toBeTruthy()
})

test('steps the edition with the buttons and the arrow keys, wrapping', async () => {
  renderViewer()
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.click(screen.getByRole('button', { name: '›' }))
  expect((await screen.findByTitle('Zartz #2 (archived copy)')).getAttribute('src')).toContain('seed11')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  // #3 was never signed: no seed, so the explanation, not a frame
  expect(await screen.findByText(/never signed/)).toBeTruthy()
})

test('the untouched toggle drops the runner; Back and Escape leave', async () => {
  const onBack = vi.fn()
  renderViewer(onBack)
  await screen.findByTitle('Zartz #1 (archived copy)')
  fireEvent.click(screen.getByRole('button', { name: /untouched/ }))
  expect((await screen.findByTitle('Zartz #1 (archived copy)')).getAttribute('src')).toContain('/5/index.html?fxhash=seed10')
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(onBack).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { code: 'Escape' })
  expect(onBack).toHaveBeenCalledTimes(2)
})

test('links to the project page', async () => {
  renderViewer()
  await screen.findByTitle('Zartz #1 (archived copy)')
  expect(screen.getByRole('link', { name: /project page/i }).getAttribute('href')).toBe('/token/zartz')
})
