import { test, expect } from 'vitest'
import { Mesh, PlaneGeometry } from 'three'
import { floorBounds, makeFloorMirror, MIRROR_Y } from './mirror'
import type { Room } from './types'

const room = (id: string, x: number, z: number, w: number, d: number): Room =>
  ({ id, kind: 'hall', title: id, rect: { x, z, w, d }, entry: { x, z, yaw: 0 } })

// Frank, round nine: screen-space reflections tore at the edges of the screen —
// they can only reflect what is already on it. A mirror renders the room a second
// time from under the floor, so nothing is missing, and it is faint.

test('floorBounds covers every room that has a floor, and ignores the zero-area era markers', () => {
  const rooms = [
    room('a', -4, 0, 8, 40),
    room('b', 10, -6, 6, 6),
    { ...room('era', 100, 100, 0, 0), kind: 'era' as const },   // a marker is a point in the corridor
  ]
  expect(floorBounds(rooms)).toEqual({ x: -4, z: -6, w: 20, d: 46 })
  expect(floorBounds([])).toEqual({ x: 0, z: 0, w: 0, d: 0 })
})

test('the mirror lies flat over the whole floor, face up, a hair above it', () => {
  const rooms = [room('a', -4, 0, 8, 40), room('b', 10, -6, 6, 6)]
  const mirror = makeFloorMirror(rooms, 512, 256)
  const b = floorBounds(rooms)
  // centred on the bounds, and level with them
  expect(mirror.position.x).toBeCloseTo(b.x + b.w / 2, 6)
  expect(mirror.position.z).toBeCloseTo(b.z + b.d / 2, 6)
  expect(mirror.position.y).toBeCloseTo(MIRROR_Y, 6)
  expect(MIRROR_Y).toBeGreaterThan(0)          // above the floor, or it reflects nothing
  expect(MIRROR_Y).toBeLessThan(0.01)          // but not a step you can see
  // laid down: three's Reflector takes its plane from the object's own rotation,
  // whose local +z must come out as world +y for a floor
  expect(mirror.rotation.x).toBeCloseTo(-Math.PI / 2, 6)
  const up = new Mesh().up.clone().set(0, 0, 1).applyEuler(mirror.rotation)
  expect(up.y).toBeCloseTo(1, 6)
  const geometry = mirror.geometry as PlaneGeometry
  expect(geometry.parameters.width).toBeCloseTo(b.w, 6)
  expect(geometry.parameters.height).toBeCloseTo(b.d, 6)
  mirror.dispose()
})

test('the mirror is a faint overlay: it never writes depth, and it is not tone mapped twice', () => {
  const mirror = makeFloorMirror([room('a', -4, 0, 8, 40)], 512, 256)
  const m = mirror.material
  expect(m.transparent).toBe(true)
  expect(m.depthWrite).toBe(false)             // it lies on the floor; the floor keeps the depth
  expect(m.uniforms.opacity.value).toBeGreaterThan(0)
  expect(m.uniforms.opacity.value).toBeLessThan(0.5)   // a sheen on concrete, not a mirror
  expect(m.uniforms.fade.value).toBeGreaterThan(0)     // and it dies away with distance
  // The reflection is sampled from a render target, where three has already
  // skipped tone mapping; the composer's OutputPass does it once at the end.
  expect(m.fragmentShader).not.toContain('tonemapping_fragment')
  expect(m.fragmentShader).not.toContain('colorspace_fragment')
  expect(m.fragmentShader).toContain('texture2DProj')
  mirror.dispose()
})
