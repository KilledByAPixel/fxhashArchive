import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import GalleryPage from './GalleryPage'

// The real view needs WebGL and three.js; neither belongs in jsdom.
vi.mock('../gallery/GalleryView', () => ({ default: () => <div>the museum</div> }))

afterEach(() => { cleanup(); vi.restoreAllMocks() })

test('without WebGL it says so and points at the grid', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  render(<MemoryRouter><GalleryPage /></MemoryRouter>)
  expect(screen.getByText(/needs WebGL/)).toBeTruthy()
  expect(screen.getByRole('link', { name: /the grid/ }).getAttribute('href')).toBe('/artwork')
})

test('with WebGL it loads the view', async () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as never)
  render(<MemoryRouter><GalleryPage /></MemoryRouter>)
  expect(await screen.findByText('the museum')).toBeTruthy()
})
