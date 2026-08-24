import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Viewer from './Viewer'
import * as data from '../lib/data'
import type { Painting } from './types'

const painting: Painting = {
  project: 5, slug: 'zartz', name: 'Zartz', artist: 'KilledByAPixel', year: 2021, room: 'tz1k',
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 3, w: 1.2, h: 1.2,
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
  // The overlay covers the painting rather than matching it edge for edge. An
  // exact rect lands on fractions of a pixel, the browser lays elements out on
  // whole ones, and the sliver it dropped showed the painting underneath along
  // the bottom of the running piece.
  const box = frame.parentElement as HTMLElement
  const px = (v: string) => parseFloat(v)
  expect(px(box.style.left)).toBeLessThanOrEqual(rect.left)
  expect(px(box.style.top)).toBeLessThanOrEqual(rect.top)
  expect(px(box.style.left) + px(box.style.width)).toBeGreaterThanOrEqual(rect.left + rect.width)
  expect(px(box.style.top) + px(box.style.height)).toBeGreaterThanOrEqual(rect.top + rect.height)
  // and only just: the overhang has to stay on the mat, not creep over the picture
  expect(rect.left - px(box.style.left)).toBeLessThanOrEqual(2)
  // The bar sits just under the frame, inside the black mat the frame quad draws
  // around the painting; 12 px put its text half over the wall below.
  const bar = document.querySelector('.gallery-bar') as HTMLElement
  expect(px(bar.style.top)).toBeCloseTo(px(box.style.top) + px(box.style.height) + 4, 6)
  expect(bar.style.left).toBe(box.style.left)
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

// ---- the preview, as #0 ----------------------------------------------------------
// Frank: the thumbnail on the wall is one particular iteration, so the piece should
// open on that one and match the wall, with the minted editions to either side.

test('opens on the preview seed when the painting has one; the editions follow, and ‹ from #0 wraps to the last', async () => {
  const withPreview = { ...painting, preview: '?fxhash=prevseed&fxiteration=1&fxminter=tz1x#0x82ff' }
  render(<MemoryRouter><Viewer painting={withPreview} rect={rect} onBack={vi.fn()} /></MemoryRouter>)
  const frame = await screen.findByTitle('Zartz #0 (archived copy)')
  expect(frame.getAttribute('src')).toContain('data/generators/5/_run.html?fxhash=prevseed&fxiteration=1&fxminter=tz1x#0x82ff')
  expect(screen.getByText(/preview/)).toBeTruthy()
  expect(screen.getByText(/of 3/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: '›' }))
  expect((await screen.findByTitle('Zartz #1 (archived copy)')).getAttribute('src')).toContain('seed10')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  await screen.findByTitle('Zartz #0 (archived copy)')
  fireEvent.keyDown(window, { code: 'ArrowLeft' })
  expect(await screen.findByText(/never signed/)).toBeTruthy()   // #3, the last
})

test('without a preview seed the first edition opens, as before', async () => {
  renderViewer()
  await screen.findByTitle('Zartz #1 (archived copy)')
  expect(screen.queryByText(/preview/)).toBeNull()
})
