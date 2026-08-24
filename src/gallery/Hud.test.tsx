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
  expect(screen.getByRole('link', { name: /fxhash viewer/ }).getAttribute('href')).toBe('/')
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
