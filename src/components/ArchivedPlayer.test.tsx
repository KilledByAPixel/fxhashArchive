import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import ArchivedPlayer from './ArchivedPlayer'
import * as data from '../lib/data'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const ids = ['FX0-100', 'FX0-101']

const player = (props: Partial<Parameters<typeof ArchivedPlayer>[0]> = {}) => (
  <ArchivedPlayer projectId={42} projectName="Tok" iterationIds={ids} {...props} />
)

test('runs the local generator with the local seed, touching no network service', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooSEED', query: null })
  render(player())

  const frame = (await screen.findByTitle(/archived generator/i)) as HTMLIFrameElement
  // The whole point: a path inside this repo, not an ipfs:// gateway or TzKT.
  expect(frame.getAttribute('src')).toContain('data/generators/42/index.html?fxhash=ooSEED')
  expect(frame.getAttribute('src')).not.toContain('ipfs')
  expect(seed).toHaveBeenCalledWith(42, 100)
})

test('keeps the sandbox that stops archived third-party code reading this origin', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooSEED', query: null })
  render(player())
  const frame = await screen.findByTitle(/archived generator/i)
  // Scripts yes, same-origin never: the generator is served from our own origin
  // here, so allow-same-origin would hand it this site's storage.
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
})

test('names each piece as fxhash did, from position alone, with no indexer', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooSEED', query: null })
  render(player())
  // "<project> #<n>" is the name TzKT would return; offline it is derived from the
  // iteration's place in the mint-ordered id list, which is the same number.
  expect(await screen.findByTitle(/archived generator for Tok #1/i)).toBeTruthy()
  expect(screen.getByText(/of 2/)).toBeTruthy()
})

test('stepping to the next iteration loads that iteration own seed', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration')
    .mockResolvedValueOnce({ seed: 'ooFIRST', query: null })
    .mockResolvedValueOnce({ seed: 'ooSECOND', query: null })
  render(player())
  await screen.findByTitle(/archived generator/i)

  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  const frame = (await screen.findByTitle(/Tok #2/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('fxhash=ooSECOND')
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('previous steps backwards, wrapping from the first iteration to the last', async () => {
  const seed = vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooSEED', query: null })
  render(player())
  await screen.findByTitle(/archived generator/i)
  expect(seed).toHaveBeenLastCalledWith(42, 100)

  // Stepping back from the first piece has to land somewhere; the edition wraps
  // rather than dead-ending on a disabled control.
  fireEvent.click(screen.getByRole('button', { name: /previous/i }))
  expect(await screen.findByTitle(/Tok #2/i)).toBeTruthy()
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('says an unsigned mint has no seed rather than rendering random art', async () => {
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: null, query: null })
  render(player())
  expect(await screen.findByText(/never signed by fxhash/i)).toBeTruthy()
  // Running the generator with no seed would draw *a* piece, not *the* piece.
  expect(screen.queryByTitle(/archived generator/i)).toBeNull()
})

test('an unsigned iteration keeps the stage, so nothing shifts under the pointer', async () => {
  vi.spyOn(data, 'loadProjectIteration')
    .mockResolvedValueOnce({ seed: 'ooFIRST', query: null })
    .mockResolvedValueOnce({ seed: null, query: null })
  const { container } = render(player())
  await screen.findByTitle(/archived generator/i)
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
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({ seed: 'ooSEED', query: null })
  const { container } = render(player({ iterationIds: [] }))
  expect(container.firstChild).toBeNull()
})

test('an fx(params) piece is driven by the exact query fxhash used, fragment included', async () => {
  // The params the minter chose ride in the URL fragment of the captured artifact
  // URI, and exist nowhere else. Rebuilding the URL from the seed alone would run
  // the artist's defaults instead: right generator, right seed, wrong artwork.
  vi.spyOn(data, 'loadProjectIteration').mockResolvedValue({
    seed: 'ooSEED',
    query: '?fxhash=ooSEED&fxiteration=1&fxminter=tz1abc&fxchain=TEZOS#0x4031000000000000',
  })
  render(player())

  const frame = (await screen.findByTitle(/archived generator/i)) as HTMLIFrameElement
  const src = frame.getAttribute('src') ?? ''
  expect(src).toContain('#0x4031000000000000')
  expect(src).toContain('fxiteration=1')
  expect(src).toContain('fxminter=tz1abc')
})
