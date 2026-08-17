import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './App'

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
})
