import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import IpfsImage from './IpfsImage'
import { GATEWAYS } from '../lib/ipfs'

afterEach(cleanup)

const img = () => screen.getByRole('img') as HTMLImageElement

test('walks down the gateway chain as loads fail', () => {
  render(<IpfsImage uri="ipfs://QmA" alt="A" />)
  expect(img().src).toBe(GATEWAYS[0] + 'QmA')
  fireEvent.error(img())
  expect(img().src).toBe(GATEWAYS[1] + 'QmA')
})

test('resets the failover state when the uri changes on a mounted component', () => {
  // React keeps this component mounted across a param-only navigation, so without a
  // reset project B inherits project A's failover position and skips a healthy gateway.
  const { rerender } = render(<IpfsImage uri="ipfs://QmA" alt="A" />)
  fireEvent.error(img())
  expect(img().src).toBe(GATEWAYS[1] + 'QmA')

  rerender(<IpfsImage uri="ipfs://QmB" alt="B" />)
  expect(img().src).toBe(GATEWAYS[0] + 'QmB')
})

test('a previous uri exhausting the chain does not blank out the next one', () => {
  const { rerender } = render(<IpfsImage uri="ipfs://QmA" alt="A" />)
  for (let i = 0; i < GATEWAYS.length; i++) fireEvent.error(img())
  expect(screen.queryByRole('img')).toBeNull() // placeholder, chain exhausted

  rerender(<IpfsImage uri="ipfs://QmB" alt="B" />)
  expect(img().src).toBe(GATEWAYS[0] + 'QmB')
})

test('renders the placeholder for a uri no gateway can serve', () => {
  render(<IpfsImage uri="javascript:alert(1)" alt="hostile" />)
  expect(screen.queryByRole('img')).toBeNull()
})
