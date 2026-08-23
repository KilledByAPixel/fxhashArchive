import { test, expect } from 'vitest'
import { pushOut, resolve, solidWalls, COLLISION_RADIUS } from './collide'
import type { Wall } from './types'

const wall = (x1: number, z1: number, x2: number, z2: number, y0 = 0): Wall => ({ x1, z1, x2, z2, y0, y1: 4 })
const alongX = wall(0, 0, 10, 0)   // a wall on z = 0 from x 0..10
const alongZ = wall(0, 0, 0, 10)   // a wall on x = 0 from z 0..10

test('a point clear of the wall is untouched', () => {
  expect(pushOut({ x: 5, z: 2 }, alongX, COLLISION_RADIUS)).toEqual({ x: 5, z: 2 })
})

test('walking into a wall slides along it', () => {
  const p = pushOut({ x: 5, z: 0.3 }, alongX, COLLISION_RADIUS)
  expect(p.x).toBe(5)
  expect(p.z).toBeCloseTo(COLLISION_RADIUS, 9)
})

test('the push is to the side the player is on', () => {
  const p = pushOut({ x: 5, z: -0.3 }, alongX, COLLISION_RADIUS)
  expect(p.z).toBeCloseTo(-COLLISION_RADIUS, 9)
})

test('the wall does not extend past its ends', () => {
  expect(pushOut({ x: 11, z: 0.3 }, alongX, COLLISION_RADIUS)).toEqual({ x: 11, z: 0.3 })
})

test('a corner resolves against both walls', () => {
  const p = resolve({ x: 0.3, z: 0.3 }, [alongX, alongZ])
  expect(p.x).toBeCloseTo(COLLISION_RADIUS, 6)
  expect(p.z).toBeCloseTo(COLLISION_RADIUS, 6)
})

test('lintels over doors are not walls', () => {
  expect(solidWalls([alongX, wall(0, 5, 2, 5, 3)])).toEqual([alongX])
})
