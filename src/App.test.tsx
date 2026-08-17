import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './App'

afterEach(cleanup)

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

test('renders nav and browse route by default', () => {
  renderAt('/')
  expect(screen.getByRole('link', { name: 'fxhash viewer' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Artists' })).toBeTruthy()
})

test('unknown route renders not-found', () => {
  renderAt('/definitely/not/a/route')
  expect(screen.getByText(/not found/i)).toBeTruthy()
  expect(screen.getAllByRole('link', { name: 'fxhash viewer' })).toHaveLength(1)
})
