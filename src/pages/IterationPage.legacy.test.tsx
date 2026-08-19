import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import IterationPage from './IterationPage'
import * as tzkt from '../lib/tzkt'
import { GENTK_CONTRACTS } from '../lib/tzkt'
import type { Iteration } from '../lib/tzkt'
// Asserted against the configured primary rather than a literal host: which gateway
// is usable changes (ipfs.io now serves a Cloudflare challenge), the contract does not.
import { GATEWAYS } from '../lib/ipfs'

const V1 = GENTK_CONTRACTS[0]
/** The middle gentk contract: v2-style pieces, seeded from `?fxhash=` in the URL. */
const MIDDLE = GENTK_CONTRACTS[1]
const V2 = GENTK_CONTRACTS[2]

/**
 * What the page actually loads for these fixtures.
 *
 * `ipfs://QmGen` is the broken shape 13.4% of real artifact URIs have — bare CID,
 * no trailing slash and no seed — so the page repairs it before fetching. The
 * slash matters here beyond seeding: without it the gateway 301s to the directory,
 * and the <base href> computed from the pre-redirect URL points a v1 piece's
 * relative script tags at the parent. See liveArtifactSrc.
 */
const LIVE = `${GATEWAYS[0]}QmGen/?fxhash=oo9`

/** Enough of a real v1 artifact to be recognised by needsLegacyPatch. */
const V1_HTML = `<!DOCTYPE html><html><head><script id="fxhash-snippet">
let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
var fxhash = 'oo9'
let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
</script><script src="./sketch.js"></script></head><body></body></html>`

const base = (contract: string): Iteration => ({
  contract, tokenId: '9', name: 'Piece #9', iterationHash: 'oo9',
  artifactUri: 'ipfs://QmGen', displayUri: 'ipfs://QmDisp', thumbnailUri: null,
  attributes: [], minter: 'Minter',
})

const mockFetchText = (body: string, ok = true) =>
  vi.fn(() => Promise.resolve({ ok, text: () => Promise.resolve(body) } as Response))

beforeEach(() => {
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(base(V1))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

const renderPage = (contract: string) =>
  render(
    <MemoryRouter initialEntries={[`/gentk/${contract}/9`]}>
      <Routes><Route path="/gentk/:contract/:tokenId" element={<IterationPage />} /></Routes>
    </MemoryRouter>,
  )

const runLive = async () =>
  fireEvent.click(await screen.findByRole('button', { name: /run artwork/i }))

test('a v1 iteration fetches the artifact and renders it via srcdoc with the patch ahead of the snippet', async () => {
  const fetchMock = mockFetchText(V1_HTML)
  vi.stubGlobal('fetch', fetchMock)

  renderPage(V1)
  await runLive()

  const frame = await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f?.getAttribute('srcdoc')) throw new Error('no srcdoc iframe yet')
    return f
  })

  expect(fetchMock).toHaveBeenCalledWith(LIVE)

  const doc = frame.getAttribute('srcdoc')!
  expect(doc).toContain('fxhash-legacy-patch')
  expect(doc).toContain(`<base href="${GATEWAYS[0]}QmGen/">`)
  expect(doc.indexOf('fxhash-legacy-patch')).toBeLessThan(doc.indexOf('Math.pow(alphabet.length'))

  // The sandbox must stay exactly as strict as it was: opaque origin, scripts only.
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
  expect(frame.getAttribute('src')).toBeNull()
})

test('a v2 iteration never fetches and keeps using src — srcdoc would strip its seed', async () => {
  const fetchMock = mockFetchText(V1_HTML)
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({
    ...base(V2), artifactUri: 'ipfs://QmGen/?fxhash=oo9',
  })

  renderPage(V2)
  await runLive()

  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('src')).toBe(`${GATEWAYS[0]}QmGen/?fxhash=oo9`)
  expect(frame.getAttribute('srcdoc')).toBeNull()
  expect(fetchMock).not.toHaveBeenCalled()
})

test('a middle-contract iteration keeps using src — its seed lives in the URL', async () => {
  // The middle gentk contract is v2-style: its artifactUri carries `?fxhash=`, which
  // a srcdoc document has no URL to read, so patching it would render random art.
  const fetchMock = mockFetchText(V1_HTML)
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue({
    ...base(MIDDLE), artifactUri: 'ipfs://QmGen/?fxhash=oo9',
  })

  renderPage(MIDDLE)
  await runLive()

  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('src')).toBe(`${GATEWAYS[0]}QmGen/?fxhash=oo9`)
  expect(frame.getAttribute('srcdoc')).toBeNull()
  expect(fetchMock).not.toHaveBeenCalled()
})

test('the legacy patch is gated on the v1 contract address itself, not a list position', async () => {
  // Nothing but that one address may take the srcdoc path — reordering or extending
  // GENTK_CONTRACTS must not silently start (or stop) patching a contract.
  const fetchMock = mockFetchText(V1_HTML)
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(base('KT1SomeOtherContract'))

  renderPage('KT1SomeOtherContract')
  await runLive()

  expect(document.querySelector('iframe')!.getAttribute('src')).toBe(LIVE)
  expect(document.querySelector('iframe')!.getAttribute('srcdoc')).toBeNull()
  expect(fetchMock).not.toHaveBeenCalled()
  expect(V1).toBe('KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE')
})

test('a rejected artifact fetch falls back to the direct src rather than showing nothing', async () => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network down'))))

  renderPage(V1)
  await runLive()

  const frame = await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f?.getAttribute('src')) throw new Error('no direct iframe yet')
    return f
  })
  expect(frame.getAttribute('src')).toBe(LIVE)
  expect(frame.getAttribute('srcdoc')).toBeNull()
})

test('a non-OK artifact response falls back to the direct src', async () => {
  vi.stubGlobal('fetch', mockFetchText('nope', false))

  renderPage(V1)
  await runLive()

  const frame = await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f?.getAttribute('src')) throw new Error('no direct iframe yet')
    return f
  })
  expect(frame.getAttribute('src')).toBe(LIVE)
})

test('HTML that does not need patching is served directly, not through srcdoc', async () => {
  vi.stubGlobal('fetch', mockFetchText('<html><head></head><body>self-contained v2-era piece</body></html>'))

  renderPage(V1)
  await runLive()

  const frame = await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f?.getAttribute('src')) throw new Error('no direct iframe yet')
    return f
  })
  expect(frame.getAttribute('src')).toBe(LIVE)
})

test('HTML with the snippet but no <head> falls back to the direct src', async () => {
  vi.stubGlobal('fetch', mockFetchText(
    `<html><body><script>var fxhash = 'oo9'; b58dec = (s) => Math.pow(alphabet.length, 2)</script></body></html>`,
  ))

  renderPage(V1)
  await runLive()

  const frame = await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f?.getAttribute('src')) throw new Error('no direct iframe yet')
    return f
  })
  expect(frame.getAttribute('src')).toBe(LIVE)
})

test('shows a loading state while the artifact is being fetched', async () => {
  let release!: (v: unknown) => void
  vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => { release = resolve })))

  renderPage(V1)
  await runLive()

  expect(screen.getByText(/preparing/i)).toBeTruthy()
  expect(document.querySelector('iframe')).toBeNull()

  release({ ok: true, text: () => Promise.resolve(V1_HTML) })
  await waitFor(() => {
    if (!document.querySelector('iframe')) throw new Error('not rendered yet')
  })
})

test('offers a "load original" escape hatch that re-renders with the plain direct src', async () => {
  vi.stubGlobal('fetch', mockFetchText(V1_HTML))

  renderPage(V1)
  await runLive()

  const original = await screen.findByRole('button', { name: /load original/i })
  expect(document.querySelector('iframe')!.getAttribute('srcdoc')).toBeTruthy()

  fireEvent.click(original)

  const frame = document.querySelector('iframe')!
  expect(frame.getAttribute('src')).toBe(LIVE)
  expect(frame.getAttribute('srcdoc')).toBeNull()
  // The escape hatch is one-way for this view; it must not bounce back to patched.
  expect(screen.queryByRole('button', { name: /load original/i })).toBeNull()
})

test('the "load original" control only exists while the patched version is showing', async () => {
  vi.stubGlobal('fetch', mockFetchText(V1_HTML))
  vi.spyOn(tzkt, 'fetchIteration').mockResolvedValue(base(V2))

  renderPage(V2)
  await runLive()

  expect(screen.queryByRole('button', { name: /load original/i })).toBeNull()
})

test('toggling back to the image and re-running live still works for a patched piece', async () => {
  vi.stubGlobal('fetch', mockFetchText(V1_HTML))

  renderPage(V1)
  await runLive()
  await waitFor(() => {
    if (!document.querySelector('iframe')?.getAttribute('srcdoc')) throw new Error('not patched yet')
  })

  fireEvent.click(screen.getByRole('button', { name: /show image/i }))
  expect(document.querySelector('iframe')).toBeNull()

  await runLive()
  await waitFor(() => {
    if (!document.querySelector('iframe')?.getAttribute('srcdoc')) throw new Error('not patched again')
  })
})
