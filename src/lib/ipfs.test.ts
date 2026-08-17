import { test, expect } from 'vitest'
import { ipfsToHttp, GATEWAYS } from './ipfs'

test('converts ipfs:// to first gateway by default', () => {
  expect(ipfsToHttp('ipfs://QmAbC')).toBe('https://ipfs.io/ipfs/QmAbC')
})

test('preserves path and query string (artifactUri case)', () => {
  expect(ipfsToHttp('ipfs://QmAbC/?fxhash=oo123&fxparams=0xff')).toBe(
    'https://ipfs.io/ipfs/QmAbC/?fxhash=oo123&fxparams=0xff',
  )
})

test('selects gateway by index, clamping to last', () => {
  expect(ipfsToHttp('ipfs://QmAbC', 1)).toBe('https://dweb.link/ipfs/QmAbC')
  expect(ipfsToHttp('ipfs://QmAbC', 99)).toBe(GATEWAYS[GATEWAYS.length - 1] + 'QmAbC')
})

test('passes through non-ipfs URIs and handles null', () => {
  expect(ipfsToHttp('https://example.com/x.png')).toBe('https://example.com/x.png')
  expect(ipfsToHttp(null)).toBeNull()
  expect(ipfsToHttp(undefined)).toBeNull()
})
