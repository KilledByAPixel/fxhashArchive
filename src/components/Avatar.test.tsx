import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, afterEach } from 'vitest'
import Avatar from './Avatar'

afterEach(cleanup)

const artist = { id: 'tz1abc', name: 'Ada', avatarUri: 'ipfs://QmAvatar' }

test('prefers the copy stored here over the gateway', () => {
  // The whole point of storing them: an avatar lives only on IPFS, and fxhash's own
  // gateway was switched off on 2026-09-08. A stored copy is the difference between
  // an artist page with a face on it and one with a grey box, forever.
  render(<Avatar artist={{ ...artist, avatar: true }} className="avatar" />)
  const img = screen.getByRole('img')
  expect(img.getAttribute('src')).toBe('/data/avatars/tz1abc.webp')
  expect(img.getAttribute('src')).not.toContain('ipfs')
  expect(img.getAttribute('alt')).toBe('Ada')
})

test('falls back to the gateway for an artist whose avatar we do not hold', () => {
  render(<Avatar artist={artist} className="avatar" />)
  expect(screen.getByRole('img').getAttribute('src')).toContain('QmAvatar')
})

test('says so when there is no avatar at all, rather than showing a broken image', () => {
  // 438 of the listed artists never set one; a collaboration-only artist is built
  // from the collaboration record and has none either.
  render(<Avatar artist={{ id: 'tz1none', name: null, avatarUri: null }} className="avatar" />)
  expect(screen.queryByRole('img')).toBeNull()
  expect(screen.getByText(/no image recorded/i)).toBeTruthy()
})

test('names the artist by address when they never registered a name', () => {
  render(<Avatar artist={{ ...artist, name: null, avatar: true }} />)
  expect(screen.getByRole('img').getAttribute('alt')).toBe('tz1abc')
})
