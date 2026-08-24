import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'

afterEach(cleanup)

import { REPO_URL } from '../lib/links'

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

test('footer links to the source repository', () => {
  renderLayout()
  const link = screen.getByRole('link', { name: /source on github/i })
  expect(link.getAttribute('href')).toBe(REPO_URL)
})

test('repository link opens in a new tab without exposing window.opener', () => {
  renderLayout()
  const link = screen.getByRole('link', { name: /source on github/i })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toContain('noopener')
})

test('header links to the gallery', () => {
  renderLayout()
  expect(screen.getByRole('link', { name: 'Gallery' }).getAttribute('href')).toBe('/gallery')
})
