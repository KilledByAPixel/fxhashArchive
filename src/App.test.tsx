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
  // This file has no explicit afterEach(cleanup); it relies on RTL's automatic
  // cleanup, which only registers when vitest runs with `globals: true`. A second
  // nav here would mean the previous test's tree is still mounted.
  expect(screen.getAllByRole('link', { name: 'fxhash viewer' })).toHaveLength(1)
})
