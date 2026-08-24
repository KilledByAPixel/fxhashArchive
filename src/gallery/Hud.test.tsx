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
  expect(screen.getByRole('link', { name: /fxhash archive/ }).getAttribute('href')).toBe('/')
})

test('hints match the input: click to lock on a mouse, drag and tap on touch, nothing while viewing', () => {
  renderHud()
  expect(screen.getByText(/click to look around/i)).toBeTruthy()
  cleanup()
  renderHud({ touch: true })
  expect(screen.queryByText(/click to look around/i)).toBeNull()
  expect(screen.getByText(/drag to look/i)).toBeTruthy()
  cleanup()
  renderHud({ mode: 'view' })
  expect(screen.queryByText(/look around/i)).toBeNull()
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
