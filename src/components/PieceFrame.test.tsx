import { render, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import PieceFrame, { liveArtifactSrc, liveWrapperSrc, archivedSrc, FRAME_ALLOW } from './PieceFrame'
import { GATEWAYS, ONCHFS_GATEWAY } from '../lib/ipfs'

const G = GATEWAYS[0]

// globals: false, so cleanup is registered here rather than arriving for free.
afterEach(cleanup)

// The three shapes actually present in the capture, with the share of all
// 1,802,387 seeded iterations each accounts for.

test('73.9% case: query with no slash before it — gateway would 301 and drop the seed', () => {
  expect(liveArtifactSrc('ipfs://QmAbC?fxhash=ooSeed', 'ooSeed')).toBe(`${G}QmAbC/?fxhash=ooSeed`)
})

test('13.4% case: no query at all — the seed has to come from the capture', () => {
  expect(liveArtifactSrc('ipfs://QmAbC', 'ooSeed')).toBe(`${G}QmAbC/?fxhash=ooSeed`)
})

test('12.7% case: already correct, so leave it exactly as it is', () => {
  expect(liveArtifactSrc('ipfs://QmAbC/?fxhash=ooSeed', 'ooSeed')).toBe(`${G}QmAbC/?fxhash=ooSeed`)
})

test('keeps the rest of the captured query rather than rebuilding it', () => {
  // fxiteration and fxminter are read by real generators; a rebuilt
  // `?fxhash=` alone would render a different piece than the one minted.
  const uri = 'ipfs://QmAbC?fxhash=ooSeed&fxiteration=42&fxminter=tz1abc'
  expect(liveArtifactSrc(uri, 'ooSeed')).toBe(`${G}QmAbC/?fxhash=ooSeed&fxiteration=42&fxminter=tz1abc`)
})

test('never adds a second fxhash when the capture already has one', () => {
  expect(liveArtifactSrc('ipfs://QmAbC/?fxhash=fromUri', 'fromIndexer')).toBe(
    `${G}QmAbC/?fxhash=fromUri`,
  )
})

test('fx(params) survive: the fragment stays last, behind the query', () => {
  // The minter's chosen parameters ride in the fragment for 11,818 iterations.
  // Appending the seed must not push them out or land in front of them.
  expect(liveArtifactSrc('ipfs://QmAbC#0xdeadbeef', 'ooSeed')).toBe(
    `${G}QmAbC/?fxhash=ooSeed#0xdeadbeef`,
  )
  expect(liveArtifactSrc('ipfs://QmAbC?fxhash=ooSeed#0xdeadbeef', 'ooSeed')).toBe(
    `${G}QmAbC/?fxhash=ooSeed#0xdeadbeef`,
  )
})

test('a URI naming a file is left unslashed — a slash there stops it resolving', () => {
  expect(liveArtifactSrc('ipfs://QmAbC/index.html?fxhash=ooSeed', 'ooSeed')).toBe(
    `${G}QmAbC/index.html?fxhash=ooSeed`,
  )
  expect(liveArtifactSrc('ipfs://QmAbC/sub/dir', 'ooSeed')).toBe(`${G}QmAbC/sub/dir/?fxhash=ooSeed`)
})

test('encodes the seed it appends', () => {
  expect(liveArtifactSrc('ipfs://QmAbC', 'oo Seed&x=1')).toBe(
    `${G}QmAbC/?fxhash=oo%20Seed%26x%3D1`,
  )
})

test('an unsigned mint has no seed, so the URL gets none invented for it', () => {
  expect(liveArtifactSrc('ipfs://QmAbC', null)).toBe(`${G}QmAbC/`)
})

test('onchfs artifacts go through the same repair', () => {
  expect(liveArtifactSrc('onchfs://abc123', 'ooSeed')).toBe(`${ONCHFS_GATEWAY}abc123/?fxhash=ooSeed`)
})

test('refuses a scheme ipfsToHttp will not resolve', () => {
  expect(liveArtifactSrc('javascript:alert(1)', 'ooSeed')).toBe(null)
  expect(liveArtifactSrc('', 'ooSeed')).toBe(null)
})

// --- the live wrapper -------------------------------------------------------

test('the wrapper keeps the seed in the query, which is why it is not srcdoc', () => {
  // A generator reads `?fxhash=` out of window.location.search. An srcdoc document
  // is at `about:srcdoc` and has no query at all, so the snippet reads null and the
  // piece crashes before drawing — the whole reason the wrapper is a real page.
  const src = liveWrapperSrc(`${G}QmAbC/?fxhash=ooSeed`)!
  const url = new URL(src, 'https://example.test/')
  expect(url.pathname.endsWith('live.html')).toBe(true)
  expect(url.searchParams.get('fxhash')).toBe('ooSeed')
  expect(url.searchParams.get('fxsrc')).toBe(`${G}QmAbC/`)
})

test('the whole captured query is passed through, with fxsrc appended last', () => {
  // Last, so `fxhash` stays the first parameter for anything parsing it loosely.
  const src = liveWrapperSrc(`${G}QmAbC/?fxhash=ooSeed&fxiteration=42&fxminter=tz1abc`)!
  expect(src).toContain('?fxhash=ooSeed&fxiteration=42&fxminter=tz1abc&fxsrc=')
  const url = new URL(src, 'https://example.test/')
  expect(url.searchParams.get('fxiteration')).toBe('42')
  expect(url.searchParams.get('fxminter')).toBe('tz1abc')
})

test('the fx(params) fragment survives, still last in the URL', () => {
  const src = liveWrapperSrc(`${G}QmAbC/?fxhash=ooSeed#0xdeadbeef`)!
  expect(src.endsWith('#0xdeadbeef')).toBe(true)
  expect(new URL(src, 'https://example.test/').searchParams.get('fxsrc')).toBe(`${G}QmAbC/`)
})

test('an artifact with no query still names itself in fxsrc', () => {
  const src = liveWrapperSrc(`${G}QmAbC/`)!
  expect(new URL(src, 'https://example.test/').searchParams.get('fxsrc')).toBe(`${G}QmAbC/`)
})

test('nothing to wrap stays nothing', () => {
  expect(liveWrapperSrc(null)).toBe(null)
})

// --- what a running piece is and is not allowed to do ------------------------

test('audio is delegated, and nothing that weakens the sandbox is', () => {
  // Permissions Policy is a separate system from sandboxing, and its default
  // allowlist for autoplay is `self` — an opaque-origin frame is not self, so
  // without this a music-driven piece is silent and, if its visuals follow the
  // transport, motionless.
  expect(FRAME_ALLOW).toContain('autoplay')
  // Sensors stay off: p5 asks for them at startup on every piece, they are a
  // fingerprinting surface, and nothing needs them to render.
  for (const denied of ['accelerometer', 'gyroscope', 'magnetometer', 'camera', 'microphone', 'geolocation']) {
    expect(FRAME_ALLOW).not.toContain(denied)
  }
})

test('the frame is sandboxed with scripts only, and never same-origin', () => {
  // The standing rule: all ~30 of this account's Pages sites share one origin, so
  // allow-same-origin would hand 420 unaudited programs the rest of them.
  const { container } = render(<PieceFrame src="/x.html" label="Piece #1" source="archived" />)
  const frame = container.querySelector('iframe')!
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
  expect(frame.getAttribute('allow')).toBe(FRAME_ALLOW)
})

test('archivedSrc prefers the captured query and can select the runner', () => {
  expect(archivedSrc(123, 'ooSeed')).toContain('data/generators/123/index.html?fxhash=ooSeed')
  expect(archivedSrc(123, 'ooSeed', '?fxhash=ooSeed&fxiteration=7')).toContain(
    'data/generators/123/index.html?fxhash=ooSeed&fxiteration=7',
  )
  expect(archivedSrc(123, 'ooSeed', null, true)).toContain(
    'data/generators/123/_run.html?fxhash=ooSeed',
  )
})
