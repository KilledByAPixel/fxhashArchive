import { test, expect } from 'vitest'
import { ipfsToHttp, GATEWAYS, ONCHFS_GATEWAY } from './ipfs'

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

test('resolves onchfs:// via the onchfs gateway, preserving trailing path', () => {
  const hash = '333885cffaa5cdf714c0e40fceb3eeb741fc72f21e19e17cc343afa607e1d29a'
  expect(ipfsToHttp(`onchfs://${hash}`)).toBe(`${ONCHFS_GATEWAY}${hash}`)
  expect(ipfsToHttp(`onchfs://${hash}/index.html?fxhash=oo123`)).toBe(
    `${ONCHFS_GATEWAY}${hash}/index.html?fxhash=oo123`,
  )
})

test('onchfs:// returns null once the single known gateway is exhausted', () => {
  const hash = '1b38905f9bd468811905023d5216c2e2274203bd45e9902bbdbbfd71b8d2f9ed'
  expect(ipfsToHttp(`onchfs://${hash}`, 1)).toBeNull()
  expect(ipfsToHttp(`onchfs://${hash}`, 2)).toBeNull()
})

test('blocks javascript: URIs', () => {
  expect(ipfsToHttp('javascript:alert(1)')).toBeNull()
})

test('blocks data: URIs', () => {
  expect(ipfsToHttp('data:text/html,<script>alert(1)</script>')).toBeNull()
})

test('still passes through plain https:// URIs unchanged', () => {
  expect(ipfsToHttp('https://example.com/x.png')).toBe('https://example.com/x.png')
})

test('blocks unrecognised schemes', () => {
  expect(ipfsToHttp('ftp://example.com/x.png')).toBeNull()
})
