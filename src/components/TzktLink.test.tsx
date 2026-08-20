import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import TzktLink, { isTezosAddress } from './TzktLink'

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
