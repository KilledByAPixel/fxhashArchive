import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Hud from './Hud'
import type { Room } from './types'

afterEach(cleanup)

const room = (id: string, kind: Room['kind'], title: string): Room =>
  ({ id, kind, title, rect: { x: 0, z: 0, w: 8, d: 8 }, entry: { x: 0, z: 1, yaw: 0 } })
const rooms = [
  room('lobby', 'lobby', 'fxhash'),
  room('leg-a', 'hall', '2021 → 2022'),          // a corridor leg: walked, not listed
  room('2021', 'era', '2021 · Nov–Dec'),
  room('tz1z', 'solo', 'Zed'),
  room('2022-q1', 'era', '2022 · Jan–Mar'),
  room('tz1a', 'solo', 'Ada'),
]

const renderHud = (over: Partial<Parameters<typeof Hud>[0]> = {}) => {
  const onTeleport = vi.fn()
  render(
    <MemoryRouter>
      <Hud rooms={rooms} caption={null} locked={false} mode="walk" touch={false} onTeleport={onTeleport} {...over} />
    </MemoryRouter>,
  )
  return onTeleport
}

test('the rooms menu lists eras in spine order, then artists alphabetically, and teleports', () => {
  const onTeleport = renderHud()
  fireEvent.click(screen.getByRole('button', { name: 'Rooms' }))
  const names = screen.getAllByRole('button').map((b) => b.textContent).filter((t) => t !== 'Rooms')
  expect(names).toEqual(['2021 · Nov–Dec', '2022 · Jan–Mar', 'Ada', 'Zed'])
  fireEvent.click(screen.getByRole('button', { name: 'Ada' }))
  expect(onTeleport).toHaveBeenCalledWith(rooms[5])
  expect(screen.queryByRole('button', { name: 'Ada' })).toBeNull()   // menu closed
})

test('shows where you are and what the crosshair is on', () => {
  renderHud({ roomTitle: 'Zed', caption: 'Thing — Zed, 2022', locked: true })
  expect(screen.getByText('Zed')).toBeTruthy()
  expect(screen.getByText('Thing — Zed, 2022')).toBeTruthy()
  // The room you are standing in has the top-left corner to itself. There was a
  // "← fxhash archive" link there, taking the eye first and saying the same thing
  // on every screen of a walk; on a phone it crowded the room name out entirely.
  expect(screen.queryByRole('link', { name: /fxhash archive/ })).toBeNull()
})

test('the opening hint is in the reader\'s own controls, and none at all while viewing', () => {
  renderHud()
  expect(screen.getByText(/click to look around/i)).toBeTruthy()
  expect(screen.getByText(/WASD to walk/i)).toBeTruthy()
  cleanup()
  renderHud({ touch: true })
  expect(screen.queryByText(/click to look around/i)).toBeNull()   // no pointer to lock
  expect(screen.getByText(/drag to look/i)).toBeTruthy()
  expect(screen.queryByText(/WASD/i)).toBeNull()
  cleanup()
  renderHud({ mode: 'view' })
  expect(screen.queryByText(/look around/i)).toBeNull()
})

test('the opening hint goes on the first tap, because touch never locks the pointer', () => {
  // This is the bug it is guarding: the hint hid itself on `locked`, a touch
  // screen never locks the pointer, and so the one hint written for touch
  // readers sat over the art for the whole visit with no way to dismiss it.
  renderHud({ touch: true })
  expect(screen.getByText(/drag to look/i)).toBeTruthy()
  fireEvent.pointerDown(window)
  expect(screen.queryByText(/drag to look/i)).toBeNull()
  // And it stays gone — it is an opening hint, not a thing that comes back.
  fireEvent.pointerDown(window)
  expect(screen.queryByText(/drag to look/i)).toBeNull()
})

test('on a mouse the hint goes when the pointer locks, and a stray tap does not count', () => {
  const hud = (locked: boolean) => (
    <MemoryRouter>
      <Hud rooms={rooms} caption={null} locked={locked} mode="walk" touch={false} onTeleport={vi.fn()} />
    </MemoryRouter>
  )
  const { rerender } = render(hud(false))
  expect(screen.getByText(/WASD to walk/i)).toBeTruthy()
  // A mouse reader has a pointer to lock, so that — not any old pointerdown —
  // is what says they have started. A click that fails to lock leaves the hint.
  fireEvent.pointerDown(window)
  expect(screen.getByText(/WASD to walk/i)).toBeTruthy()
  rerender(hud(true))
  expect(screen.queryByText(/WASD to walk/i)).toBeNull()
  rerender(hud(false))
  expect(screen.queryByText(/WASD to walk/i)).toBeNull()   // stays gone once unlocked again
})

// Frank, round thirteen: Rooms sat alone in the corner. Beside it now is About —
// the same words the lobby wall carries, so someone who walked straight past the
// wall text can still find out what this is, and a way to the source.
import { REPO_URL } from '../lib/links'
import type { AboutPanel } from './types'

const about: AboutPanel[] = [
  { heading: 'About this gallery', lines: ['The 420 fxhash projects whose code this archive holds,', 'hung in the order they were made, 2021 to 2024.'] },
  { heading: 'How to walk it', lines: ['W A S D to walk, the mouse to look, hold Shift to run.'] },
]

test('About sits beside Rooms, says what the place is, and points at the source', () => {
  renderHud({ about })
  expect(screen.queryByRole('heading', { name: 'About this gallery' })).toBeNull()   // shut to begin with
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.getByRole('heading', { name: 'About this gallery' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'How to walk it' })).toBeTruthy()
  // the wall's lines, run together as the prose they already are
  expect(screen.getByText(/hung in the order they were made/)).toBeTruthy()
  expect(screen.getByRole('link', { name: /source/i }).getAttribute('href')).toBe(REPO_URL)
})

test('About holds the way out, now that the corner does not', () => {
  // Taking the back link out of the top bar left the browser's own back as the only
  // exit — which someone who opened a shared /#/gallery link has no history for.
  // It lives in About instead: reachable, and out of sight while walking.
  renderHud({ about })
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  const out = screen.getByRole('link', { name: /rest of the archive/i })
  expect(out.getAttribute('href')).toBe('/')
  // In place, not a new tab: leaving the gallery is the one link that means to.
  expect(out.getAttribute('target')).toBeNull()
})

test('one panel at a time: they share a corner, so opening either shuts the other', () => {
  renderHud({ about })
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  fireEvent.click(screen.getByRole('button', { name: 'Rooms' }))
  expect(screen.queryByRole('heading', { name: 'About this gallery' })).toBeNull()
  expect(screen.getByRole('heading', { name: 'Eras' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.queryByRole('heading', { name: 'Eras' })).toBeNull()
})

test('no About text, no About button — the gallery still opens on old data', () => {
  renderHud()
  expect(screen.queryByRole('button', { name: 'About' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Rooms' })).toBeTruthy()
})

// Frank: with a panel open, clicking back into the room takes the mouse pointer
// away — and with it any way to close the panel you just opened. So the room
// takes it back: whichever panel is open shuts the moment the pointer locks.
test('clicking back into the room shuts whichever panel is open', () => {
  const hud = (locked: boolean) => (
    <MemoryRouter>
      <Hud rooms={rooms} about={about} caption={null} locked={locked} mode="walk" touch={false} onTeleport={vi.fn()} />
    </MemoryRouter>
  )
  const { rerender } = render(hud(false))
  fireEvent.click(screen.getByRole('button', { name: 'Rooms' }))
  expect(screen.getByRole('heading', { name: 'Eras' })).toBeTruthy()
  rerender(hud(true))
  expect(screen.queryByRole('heading', { name: 'Eras' })).toBeNull()

  rerender(hud(false))
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.getByRole('heading', { name: 'About this gallery' })).toBeTruthy()
  rerender(hud(true))
  expect(screen.queryByRole('heading', { name: 'About this gallery' })).toBeNull()
})

test('the About panel\'s way to the source opens a new tab too', () => {
  renderHud({ about })
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  const link = screen.getByRole('link', { name: /source/i })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toContain('noopener')
})

// Frank, on a phone: the About panel was telling a touch screen to press W and
// hit Escape. The wall in the lobby still says that, because that is what is
// painted on it — but the reader holding the phone gets the other wording.
const aboutBoth: AboutPanel[] = [
  { heading: 'About this gallery', lines: ['The 420 fxhash projects whose code this archive holds,'] },
  {
    heading: 'How to walk it',
    lines: ['W A S D to walk, the mouse to look, hold Shift to run.'],
    touch: ['Drag to look, tap the floor to walk there.'],
  },
]

test('About names the controls the reader actually has', () => {
  renderHud({ about: aboutBoth })
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.getByText(/W A S D to walk/)).toBeTruthy()
  expect(screen.queryByText(/Drag to look/)).toBeNull()
  cleanup()

  renderHud({ about: aboutBoth, touch: true })
  // Reaching the About button at all means having tapped, which is what puts the
  // opening hint away — otherwise its wording and the panel's both answer to
  // /Drag to look/. fireEvent.click does not raise pointerdown, so say it here.
  fireEvent.pointerDown(window)
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.getByText(/Drag to look/)).toBeTruthy()
  expect(screen.queryByText(/W A S D/)).toBeNull()
  // Only the controls differ: everything else reads the same either way.
  expect(screen.getByText(/420 fxhash projects/)).toBeTruthy()
})

test('a panel with no touch wording reads the same on a phone as on a wall', () => {
  // Old gallery.json has no `touch` on anything, and must not come out blank.
  renderHud({ about, touch: true })
  fireEvent.click(screen.getByRole('button', { name: 'About' }))
  expect(screen.getByText(/W A S D to walk/)).toBeTruthy()
})
