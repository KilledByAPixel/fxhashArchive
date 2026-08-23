import { test, expect } from 'vitest'
import { PerspectiveCamera } from 'three'
import {
  viewingDistance, viewingPose, standingPose, applyPose, projectedRect, easeInOut, lerpAngle, lerpPose,
} from './approach'
import { FOV, FILL, PAINTING } from './constants'
import type { Painting } from './types'

// On the west wall of a hall, facing +x.
const painting: Painting = {
  project: 1, slug: 'p', name: 'P', artist: 'A', year: 2022, room: '2022-q1',
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 0,
}

test('landscape: the painting fills FILL of the height', () => {
  const d = viewingDistance(FOV, 16 / 9)
  expect(d).toBeCloseTo(PAINTING / (2 * FILL * Math.tan((FOV * Math.PI) / 360)), 9)
  expect(d).toBeCloseTo(1.1425, 3)
})

test('portrait: the painting fills FILL of the width, so the camera stands further back', () => {
  expect(viewingDistance(FOV, 0.5)).toBeCloseTo(viewingDistance(FOV, 16 / 9) / 0.5, 9)
})

test('the viewing pose is on the normal, facing back at the painting', () => {
  const pose = viewingPose(painting, FOV, 16 / 9)
  expect(pose.x).toBeCloseTo(-3.98 + viewingDistance(FOV, 16 / 9), 9)
  expect(pose.z).toBeCloseTo(20, 9)
  expect(pose.yaw).toBeCloseTo(painting.yaw + Math.PI, 9)
  expect(standingPose(painting)).toEqual({ x: -3.98 + 3, z: 20, yaw: painting.yaw + Math.PI })
})

test('at the viewing pose the painting projects to a centred square of FILL × the short side', () => {
  const width = 1600, height = 900
  const camera = new PerspectiveCamera(FOV, width / height, 0.1, 200)
  applyPose(camera, viewingPose(painting, FOV, width / height))
  const r = projectedRect(camera, painting, width, height)
  expect(r.height).toBeCloseTo(FILL * height, 0)
  expect(r.width).toBeCloseTo(r.height, 0)
  expect(r.left + r.width / 2).toBeCloseTo(width / 2, 0)
  expect(r.top + r.height / 2).toBeCloseTo(height / 2, 0)
})

test('easing and angle interpolation', () => {
  expect(easeInOut(0)).toBe(0)
  expect(easeInOut(1)).toBe(1)
  expect(easeInOut(0.5)).toBeCloseTo(0.5, 9)
  // Shortest way round: from just above 0 to just below 2π goes through 0, not π.
  expect(Math.sin(lerpAngle(0.1, 2 * Math.PI - 0.1, 0.5))).toBeCloseTo(0, 9)
  expect(lerpPose({ x: 0, z: 0, yaw: 0 }, { x: 2, z: 4, yaw: 1 }, 0.5)).toEqual({ x: 1, z: 2, yaw: 0.5 })
})
