import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import ArchivedPlayer from './ArchivedPlayer'
import * as data from '../lib/data'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const ids = ['FX0-100', 'FX0-101']

test('runs the local generator with the local seed, touching no network service', async () => {
  const seed = vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooSEED')
  render(<ArchivedPlayer projectId={42} iterationIds={ids} />)

  const frame = (await screen.findByTitle(/archived generator/i)) as HTMLIFrameElement
  // The whole point: a path inside this repo, not an ipfs:// gateway or TzKT.
  expect(frame.getAttribute('src')).toContain('data/generators/42/index.html?fxhash=ooSEED')
  expect(frame.getAttribute('src')).not.toContain('ipfs')
  expect(seed).toHaveBeenCalledWith(42, 100)
})

test('keeps the sandbox that stops archived third-party code reading this origin', async () => {
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooSEED')
  render(<ArchivedPlayer projectId={42} iterationIds={ids} />)
  const frame = await screen.findByTitle(/archived generator/i)
  // Scripts yes, same-origin never: the generator is served from our own origin
  // here, so allow-same-origin would hand it this site's storage.
  expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
})

test('stepping to the next iteration loads that iteration own seed', async () => {
  const seed = vi.spyOn(data, 'loadProjectSeed')
    .mockResolvedValueOnce('ooFIRST')
    .mockResolvedValueOnce('ooSECOND')
  render(<ArchivedPlayer projectId={42} iterationIds={ids} />)
  await screen.findByTitle(/archived generator/i)

  fireEvent.click(screen.getByRole('button', { name: /next iteration/i }))
  const frame = (await screen.findByTitle(/iteration FX0-101/i)) as HTMLIFrameElement
  expect(frame.getAttribute('src')).toContain('fxhash=ooSECOND')
  expect(seed).toHaveBeenLastCalledWith(42, 101)
})

test('says an unsigned mint has no seed rather than rendering random art', async () => {
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue(null)
  render(<ArchivedPlayer projectId={42} iterationIds={ids} />)
  expect(await screen.findByText(/never signed by fxhash/i)).toBeTruthy()
  // Running the generator with no seed would draw *a* piece, not *the* piece.
  expect(screen.queryByTitle(/archived generator/i)).toBeNull()
})

test('renders nothing when the project has no minted iterations', () => {
  vi.spyOn(data, 'loadProjectSeed').mockResolvedValue('ooSEED')
  const { container } = render(<ArchivedPlayer projectId={42} iterationIds={[]} />)
  expect(container.firstChild).toBeNull()
})
