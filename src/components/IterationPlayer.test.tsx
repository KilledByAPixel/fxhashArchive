import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import IterationPlayer from './IterationPlayer'
import * as data from '../lib/data'
import { GATEWAYS } from '../lib/ipfs'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const ids = ['FX0-100', 'FX0-101']

const player = (props: Partial<Parameters<typeof IterationPlayer>[0]> = {}) => (
  <IterationPlayer projectId={42} projectName="Tok" iterationIds={ids} archived {...props} />
)

const local = (over: Partial<data.LocalIteration> = {}): data.LocalIteration => ({
  seed: 'ooSEED',
  query: null,
  artifact: 'ipfs://QmLive/?fxhash=ooSEED',
  ...over,
})

test('runs the local generator with the local seed, touching no network service', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local())
  render(player())

  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  // The whole point: a path inside this repo, not an ipfs:// gateway or TzKT.
  expect(frame.getAttribute('src')).toContain('data/generators/42/index.html?fxhash=ooSEED')
  expect(frame.getAttribute('src')).not.toContain('ipfs')
  expect(seed).toHaveBeenCalledWith(42, 100)
})

test('keeps the sandbox that stops third-party art code reading this origin', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local())
  render(player())
  const frame = await screen.findByTitle(/archived copy/i)
  // Scripts yes, same-origin never: an archived generator is served from our own
  // origin, so allow-same-origin would hand it this site's storage.
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
})

test('names each piece as fxhash did, from position alone, with no indexer', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local())
  render(player())
  // "<project> #<n>" is the name TzKT would return; offline it is derived from the
  // iteration's place in the mint-ordered id list, which is the same number.
  expect(await screen.findByTitle(/^Tok #1 /)).toBeTruthy()
  expect(screen.getByText(/of 2/)).toBeTruthy()
})

test('stepping to the next iteration loads that iteration own seed', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration')
    .mockResolvedValueOnce(local({ seed: 'ooFIRST' }))
    .mockResolvedValueOnce(local({ seed: 'ooSECOND' }))
  render(player())
  await screen.findByTitle(/archived copy/i)

  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  const frame = (await screen.findByTitle(/^Tok #2 /)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('fxhash=ooSECOND')
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('previous steps backwards, wrapping from the first iteration to the last', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local())
  render(player())
  await screen.findByTitle(/archived copy/i)
  expect(seed).toHaveBeenLastCalledWith(42, 100)

  // Stepping back from the first piece has to land somewhere; the edition wraps
  // rather than dead-ending on a disabled control.
  fireEvent.click(screen.getByRole('button', { name: /previous/i }))
  expect(await screen.findByTitle(/^Tok #2 /)).toBeTruthy()
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('says an unsigned mint has no seed rather than rendering random art', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local({ seed: null, artifact: null }))
  render(player())
  expect(await screen.findByText(/never signed by fxhash/i)).toBeTruthy()
  // Running the generator with no seed would draw *a* piece, not *the* piece.
  expect(document.querySelector('iframe')).toBeNull()
})

test('an unsigned iteration keeps the stage, so nothing shifts under the pointer', async () => {
  vi.spyOn(data, 'loadProjectIteration')
    .mockResolvedValueOnce(local({ seed: 'ooFIRST' }))
    .mockResolvedValueOnce(local({ seed: null, artifact: null }))
  const { container } = render(player())
  await screen.findByTitle(/archived copy/i)
  const stage = container.querySelector('.archived-stage')
  expect(stage?.querySelector('iframe')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  await screen.findByText(/never signed by fxhash/i)

  // jsdom cannot measure a box, so assert the thing that made the box collapse:
  // the message has to live *inside* the stage, not in place of it. Stepping
  // through an edition hits unsigned mints, and hoisting the message out of the
  // stage is what yanked the button out from under the click.
  expect(container.querySelector('.archived-stage')).toBe(stage)
  expect(stage?.textContent).toMatch(/never signed/i)
  expect(stage?.querySelector('iframe')).toBeNull()
  expect(screen.getByRole('button', { name: /next/i })).toBeTruthy()
})

test('renders nothing when the project has no minted iterations', () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local())
  const { container } = render(player({ iterationIds: [] }))
  expect(container.firstChild).toBeNull()
})

test('an fx(params) piece is driven by the exact query fxhash used, fragment included', async () => {
  // The params the minter chose ride in the URL fragment of the captured artifact
  // URI, and exist nowhere else. Rebuilding the URL from the seed alone would run
  // the artist's defaults instead: right generator, right seed, wrong artwork.
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(
    local({ query: '?fxhash=ooSEED&fxiteration=1&fxminter=tz1abc&fxchain=TEZOS#0x4031000000000000' }),
  )
  render(player())

  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  const src = frame.getAttribute('src') ?? ''
  expect(src).toContain('#0x4031000000000000')
  expect(src).toContain('fxiteration=1')
  expect(src).toContain('fxminter=tz1abc')
})

// --- projects whose code is not archived here --------------------------------
// The ids, the seeds and each piece's artifact address are all local, so an
// unarchived edition can still be stepped through — it just streams from a gateway.

test('an unarchived project still plays and steps, streamed from IPFS', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration')
    .mockResolvedValueOnce(local({ seed: 'ooFIRST', artifact: 'ipfs://QmA/?fxhash=ooFIRST' }))
    .mockResolvedValueOnce(local({ seed: 'ooSECOND', artifact: 'ipfs://QmB/?fxhash=ooSECOND' }))
  render(player({ archived: false }))

  const frame = (await screen.findByTitle(/streamed from IPFS/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toBe(`${GATEWAYS[0]}QmA/?fxhash=ooFIRST`)
  // Hiding these controls for unarchived projects made a fact about our storage
  // look like a missing feature.
  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  const next = (await screen.findByTitle(/^Tok #2 /)) as HTMLIFrameElement
  expect(next.getAttribute('src')).toBe(`${GATEWAYS[0]}QmB/?fxhash=ooSECOND`)
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('an archived project never falls back to the gateway', async () => {
  // Both sources exist here. The archived copy is the same artwork with no gateway
  // in the way, so it must win — otherwise the preservation work buys nothing at
  // exactly the moment IPFS is the thing that has gone wrong.
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local({ artifact: 'ipfs://QmA/' }))
  render(player({ archived: true }))
  const frame = (await screen.findByTitle(/archived copy/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('data/generators/42/')
  expect(screen.queryByTitle(/streamed from IPFS/i)).toBeNull()
})

test('an unarchived piece with no artifact address says so instead of rendering blank', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue(local({ artifact: null }))
  render(player({ archived: false }))
  expect(await screen.findByText(/no artifact address was recorded/i)).toBeTruthy()
  // Distinct from the unsigned case: this piece has a seed, we just cannot reach it.
  expect(screen.queryByText(/never signed/i)).toBeNull()
})
