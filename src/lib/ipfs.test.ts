import { test, expect } from 'vitest'
import { ipfsToHttp, GATEWAYS, ONCHFS_GATEWAY } from './ipfs'

test('converts ipfs:// to first gateway by default', () => {
  expect(ipfsToHttp('ipfs://QmAbC')).toBe(GATEWAYS[0] + 'QmAbC')
})

test('preserves path and query string (artifactUri case)', () => {
  expect(ipfsToHttp('ipfs://QmAbC/?fxhash=oo123&fxparams=0xff')).toBe(
    GATEWAYS[0] + 'QmAbC/?fxhash=oo123&fxparams=0xff',
  )
})

test('selects gateway by index, clamping to last', () => {
  expect(ipfsToHttp('ipfs://QmAbC', 1)).toBe(GATEWAYS[1] + 'QmAbC')
  expect(ipfsToHttp('ipfs://QmAbC', 99)).toBe(GATEWAYS[GATEWAYS.length - 1] + 'QmAbC')
})

test('every gateway is a distinct host, so failover actually goes somewhere else', () => {
  // A chain whose entries share a host is one gateway wearing three hats: the
  // retries look like resilience and buy nothing. (Whether the hosts share an
  // *operator* only a live probe can tell — see scripts/check-gateways.mjs.)
  const hosts = GATEWAYS.map((g) => new URL(g).host)
  expect(new Set(hosts).size).toBe(GATEWAYS.length)
  expect(GATEWAYS.every((g) => g.startsWith('https://') && g.endsWith('/'))).toBe(true)
})

test('no gateway that is known to refuse being framed', () => {
  // These three answer Node with 200 and a browser with a Cloudflare challenge
  // carrying X-Frame-Options: SAMEORIGIN, so a live artwork iframe shows "refused
  // to connect". They passed every offline test right up until the site broke.
  const CHALLENGED = ['ipfs.io', 'dweb.link', 'gateway.pinata.cloud', 'nftstorage.link', 'w3s.link']
  for (const g of GATEWAYS) expect(CHALLENGED).not.toContain(new URL(g).host)
})

test('handles null and undefined', () => {
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

test('rejects absolute http(s) URLs — they are pure attack surface here', () => {
  // No real fxhash record uses them: across all 27,430 snapshot projects the image
  // and code URIs are 100% ipfs:// (or onchfs://), and a 200-row live TzKT sample of
  // artifactUri is the same. Since this value becomes an <iframe src>, an attacker-
  // supplied http(s) URL would be the only thing this branch ever served.
  expect(ipfsToHttp('https://example.com/x.png')).toBeNull()
  expect(ipfsToHttp('http://example.com/evil.html')).toBeNull()
  expect(ipfsToHttp('https://evil.example/drainer#ipfs://QmAbC')).toBeNull()
})

test('blocks unrecognised schemes', () => {
  expect(ipfsToHttp('ftp://example.com/x.png')).toBeNull()
})
