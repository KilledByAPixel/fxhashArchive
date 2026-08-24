// src/gallery/controls.test.ts
import { test, expect } from 'vitest'
import { integrate, look, walkToward, keyFor, emptyKeys, anyMove, fromPose, toPose } from './controls'
import { WALK_SPEED, RUN_SPEED } from './constants'
import { COLLISION_RADIUS } from './collide'
import type { Wall } from './types'

const at = (x: number, z: number, yaw = 0) => ({ x, z, yaw, pitch: 0 })
const keys = (over: Partial<ReturnType<typeof emptyKeys>>) => ({ ...emptyKeys(), ...over })

test('forward at yaw 0 walks +z at WALK_SPEED; Shift runs', () => {
  expect(integrate(at(0, 0), keys({ forward: true }), 0.5, [])).toEqual(at(0, WALK_SPEED * 0.5))
  expect(integrate(at(0, 0), keys({ forward: true, run: true }), 0.5, [])).toEqual(at(0, RUN_SPEED * 0.5))
})

test('right at yaw 0 strafes -x, and a diagonal is not faster', () => {
  const r = integrate(at(0, 0), keys({ right: true }), 1, [])
  expect(r.x).toBeCloseTo(-WALK_SPEED, 9)
  const d = integrate(at(0, 0), keys({ forward: true, right: true }), 1, [])
  expect(Math.hypot(d.x, d.z)).toBeCloseTo(WALK_SPEED, 9)
})

test('yaw turns the walk; no keys is a no-op', () => {
  const s = integrate(at(0, 0, Math.PI / 2), keys({ forward: true }), 1, [])
  expect(s.x).toBeCloseTo(WALK_SPEED, 9)
  expect(s.z).toBeCloseTo(0, 9)
  expect(integrate(at(1, 2, 3), emptyKeys(), 1, [])).toEqual(at(1, 2, 3))
})

test('a wall ahead stops the walk at the collision radius', () => {
  // Frame-sized steps, as the engine takes them (dt is capped at 50 ms there): a
  // single one-second step would be 3 m and hop clean over a 0.3 m wall.
  const wall: Wall = { x1: -4, z1: 2, x2: 4, z2: 2, y0: 0, y1: 4 }
  let s = at(0, 1)
  for (let i = 0; i < 40; i++) s = integrate(s, keys({ forward: true }), 0.05, [wall])
  expect(s.z).toBeCloseTo(2 - COLLISION_RADIUS, 9)
})

test('look turns right for mouse-right and clamps pitch', () => {
  const s = look(at(0, 0), 100, 0)
  expect(s.yaw).toBeLessThan(0)
  expect(look(at(0, 0), 0, 100000).pitch).toBeCloseTo(-85 * Math.PI / 180, 9)
  expect(look(at(0, 0), 0, -100000).pitch).toBeCloseTo(85 * Math.PI / 180, 9)
})

test('walkToward arrives, and reports blocked as arrived', () => {
  let s = at(0, 0)
  let arrived = false
  for (let i = 0; i < 100 && !arrived; i++) ({ state: s, arrived } = walkToward(s, { x: 0, z: 5 }, 0.1, []))
  expect(arrived).toBe(true)
  expect(s.z).toBeCloseTo(5, 1)
  const wall: Wall = { x1: -4, z1: 2, x2: 4, z2: 2, y0: 0, y1: 4 }
  s = at(0, 1)
  arrived = false
  for (let i = 0; i < 100 && !arrived; i++) ({ state: s, arrived } = walkToward(s, { x: 0, z: 5 }, 0.1, [wall]))
  expect(arrived).toBe(true)
  expect(s.z).toBeLessThan(2)
})

test('key mapping and pose conversion', () => {
  expect(keyFor('KeyW')).toBe('forward')
  expect(keyFor('ArrowUp')).toBe('forward')
  expect(keyFor('KeyA')).toBe('left')
  expect(keyFor('ShiftLeft')).toBe('run')
  expect(keyFor('KeyQ')).toBeNull()
  expect(anyMove(keys({ run: true }))).toBe(false)
  expect(anyMove(keys({ back: true }))).toBe(true)
  expect(toPose(fromPose({ x: 1, z: 2, yaw: 3 }))).toEqual({ x: 1, z: 2, yaw: 3 })
})

test('Shift is four times the run speed the gallery shipped with', () => {
  expect(RUN_SPEED).toBe(20)
})

test('running into a wall on a hitchy frame still stops at the radius', () => {
  // At 20 m/s a 50 ms frame is a 1 m move — more than a wall is thick, and more
  // than the collision radius. Taken as one step the visitor lands on the far
  // side and the collider pushes them the wrong way; the integrator has to
  // sub-step so no single move can skip a wall.
  const wall: Wall = { x1: -4, z1: 2, x2: 4, z2: 2, y0: 0, y1: 4 }
  let s = at(0, 1)
  for (let i = 0; i < 10; i++) s = integrate(s, keys({ forward: true, run: true }), 0.05, [wall])
  expect(s.z).toBeCloseTo(2 - COLLISION_RADIUS, 9)
})
