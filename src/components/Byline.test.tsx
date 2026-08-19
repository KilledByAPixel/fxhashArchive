import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Byline, { bylineLabel } from './Byline'

afterEach(cleanup)

const at = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

test('a solo project links its one artist', () => {
  at(<Byline author={{ id: 'tz1a', name: 'Alice' }} />)
  const link = screen.getByRole('link', { name: 'Alice' })
  expect(link.getAttribute('href')).toBe('/artist/tz1a')
})

test('a collaboration credits every artist, not the contract they minted through', () => {
  // The catalog records the KT1 collaboration contract as the author, which named
  // nobody. This is the whole point of reading the members off chain.
  at(
    <Byline
      author={{ id: 'KT1collab', name: null }}
      collaborators={[
        { id: 'tz1a', name: 'Alice', share: 90 },
        { id: 'tz1b', name: 'Bob', share: 5 },
        { id: 'tz1c', name: 'Cleo', share: 5 },
      ]}
    />,
  )
  expect(screen.getByRole('link', { name: 'Alice' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Bob' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Cleo' })).toBeTruthy()
  expect(screen.queryByText(/KT1collab/)).toBeNull()
  // Reads as a credit: "by Alice, Bob and Cleo".
  expect(document.body.textContent).toContain('by Alice, Bob and Cleo')
})

test('a collaborator with no registered name shows a short address, still linked', () => {
  // 41 collaborator addresses have no name anywhere on chain. An address is the
  // honest answer; hiding them would drop a person from the credit entirely.
  at(
    <Byline
      author={{ id: 'KT1collab', name: null }}
      collaborators={[
        { id: 'tz1a', name: 'Alice', share: 50 },
        { id: 'tz1QDkAea9R3ChnHFpZQhKshUBvcNRCGooDt', name: null, share: 50 },
      ]}
    />,
  )
  const link = screen.getByRole('link', { name: /tz1QDkAe/ })
  expect(link.getAttribute('href')).toBe('/artist/tz1QDkAea9R3ChnHFpZQhKshUBvcNRCGooDt')
})

test('an unknown author says so rather than rendering an empty credit', () => {
  at(<Byline author={null} />)
  expect(document.body.textContent).toContain('by unknown')
})

test('the card label summarises past two names', () => {
  // A card has room for one line, and a four-way credit would wrap into the
  // thumbnail below it. The full credit is on the project page.
  const person = (id: string, name: string | null) => ({ id, name, share: 1 })
  expect(bylineLabel([person('tz1a', 'Alice')])).toBe('Alice')
  expect(bylineLabel([person('tz1a', 'Alice'), person('tz1b', 'Bob')])).toBe('Alice and Bob')
  expect(
    bylineLabel([person('tz1a', 'Alice'), person('tz1b', 'Bob'), person('tz1c', 'Cleo')]),
  ).toBe('Alice and 2 others')
})
