import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import TzktLink, { TzktTokenLink, ObjktLink, TokenLinks, isTezosAddress } from './ChainLinks'

afterEach(cleanup)

test('shows the name TzKT has on file', () => {
  render(<TzktLink address="tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac" alias="Brendon" />)
  const link = screen.getByRole('link', { name: /Brendon/ })
  expect(link.getAttribute('href')).toBe('https://tzkt.io/tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac')
})

test('falls back to a shortened address, which is still checkable by eye', () => {
  render(<TzktLink address="tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac" alias={null} />)
  expect(screen.getByRole('link', { name: 'tz1givSC…iVac' })).toBeTruthy()
})

test('the href is built from the address, never from the alias', () => {
  // The alias is text TzKT supplies, on a page that also runs untrusted art. It is
  // rendered and nothing more; only the address — after it matches a real Tezos
  // address — ever reaches a URL.
  render(<TzktLink address="tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac" alias="javascript:alert(1)" />)
  const link = screen.getByRole('link', { name: 'javascript:alert(1)' })
  expect(link.getAttribute('href')).toBe('https://tzkt.io/tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac')
})

test('an address that is not one renders as plain text with no link', () => {
  render(<TzktLink address="javascript:alert(1)" alias="Trust me" />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Trust me')).toBeTruthy()
})

test('opens away from the page that is running an artwork', () => {
  render(<TzktLink address="tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac" alias="Brendon" />)
  const link = screen.getByRole('link', { name: /Brendon/ })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toContain('noopener')
})

test('accepts the address forms Tezos actually uses', () => {
  // Implicit accounts of all three curve prefixes, and originated contracts — the
  // 553 collaborations are KT1 addresses, so refusing those would be wrong.
  for (const ok of [
    'tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac',
    'tz2Fa9k7BxYnBQGV2ZqBQGYQnvyMR1YrRJhP',
    'tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9',
    'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
  ]) {
    expect(isTezosAddress(ok)).toBe(true)
  }
  for (const bad of [
    '',
    'tz1',
    'tz9givSC8YvFAc8tcKSL38JW5B54CpsfiVac',
    'tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVa',
    'tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVacX',
    'tz1givSC8YvFAc8tcKSL38JW5B54Cpsfi0Ac',
    'https://evil.example/tz1givSC8YvFAc8tcKSL38JW5B54CpsfiVac',
  ]) {
    expect(isTezosAddress(bad)).toBe(false)
  }
})

// --- the token itself --------------------------------------------------------

const CONTRACT = 'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi'

test('links a token to its own page on the explorer', () => {
  // Not the owner and not the artist — the piece: its on-chain metadata and every
  // transfer it has ever had, which is how it reached the owner shown above it.
  render(<TzktTokenLink contract={CONTRACT} tokenId="1592717" />)
  const link = screen.getByRole('link', { name: '#1592717' })
  expect(link.getAttribute('href')).toBe(`https://tzkt.io/${CONTRACT}/tokens/1592717`)
  expect(link.getAttribute('rel')).toContain('noopener')
})

test('a token id that is not a number gets no link', () => {
  // Same rule as an address: chain metadata is attacker-influenceable and this is
  // a page that also runs untrusted art, so nothing unvalidated reaches a URL.
  render(<TzktTokenLink contract={CONTRACT} tokenId="../../evil" />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('#../../evil')).toBeTruthy()
})

test('a contract that is not an address gets no link', () => {
  render(<TzktTokenLink contract="javascript:alert(1)" tokenId="9" />)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('#9')).toBeTruthy()
})

test('links the same token to the marketplace, which answers a different question', () => {
  // The explorer says what it is; objkt says what it sold for. Neither fetches
  // anything — a link is a link, and a dead marketplace costs a click, not a page.
  render(<ObjktLink contract={CONTRACT} tokenId="1592717" />)
  const link = screen.getByRole('link', { name: 'objkt' })
  expect(link.getAttribute('href')).toBe(`https://objkt.com/tokens/${CONTRACT}/1592717`)
  expect(link.getAttribute('rel')).toContain('noopener')
})

test('the market link is omitted entirely when it cannot be built', () => {
  // Unlike the token link, there is no useful text to fall back to: "objkt" as
  // plain words tells a reader nothing.
  const { container } = render(<ObjktLink contract="javascript:alert(1)" tokenId="9" />)
  expect(container.textContent).toBe('')
})

test('the separator appears only when there are two things to separate', () => {
  // A dangling bullet is what you get from writing `link · link` at the call site,
  // and the market link is absent on every contract that does not validate.
  const both = render(<TokenLinks contract={CONTRACT} tokenId="1592717" />)
  expect(both.container.textContent).toBe('#1592717 · objkt')
  cleanup()

  const one = render(<TokenLinks contract="KT1x" tokenId="1592717" />)
  expect(one.container.textContent).toBe('#1592717')
})
