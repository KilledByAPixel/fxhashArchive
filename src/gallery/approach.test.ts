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
  x: -3.98, z: 20, yaw: Math.PI / 2, tile: 0, w: PAINTING, h: PAINTING,
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

test('a wide painting stands further back so its width fits, and its rect is wide', () => {
  const wide: Painting = { ...painting, w: PAINTING, h: PAINTING / 2 }
  const width = 1600, height = 900
  const camera = new PerspectiveCamera(FOV, width / height, 0.1, 200)
  // In landscape the height fits easily; the width is the constraint only in portrait.
  applyPose(camera, viewingPose(wide, FOV, width / height))
  const r = projectedRect(camera, wide, width, height)
  expect(r.width / r.height).toBeCloseTo(2, 1)
  expect(r.width).toBeCloseTo(FILL * width, 0)            // 2:1 is wider than 16:9, so the width is what fits
  // Portrait screen: the width is what has to fit.
  const tallScreen = new PerspectiveCamera(FOV, 0.5, 0.1, 200)
  applyPose(tallScreen, viewingPose(wide, FOV, 0.5))
  const r2 = projectedRect(tallScreen, wide, 450, 900)
  expect(r2.width).toBeCloseTo(FILL * 450, 0)
})

// Frank, round ten: zoomed in on a work, the running piece sat over the painting
// "almost perfectly — but there is like a thin row of pixels on the bottom where
// i can see the original in the background". The projected rect is exact, and
// exact is the problem: its edges land on fractions of a pixel, the browser lays
// the overlay out on whole ones, and whatever it drops shows the quad underneath.
import { coverRect } from './approach'

test('coverRect covers a fractional rect completely: whole pixels, and never short', () => {
  const r = coverRect({ left: 100.6, top: 50.2, width: 600.7, height: 400.9 })
  expect(Number.isInteger(r.left)).toBe(true)
  expect(Number.isInteger(r.top)).toBe(true)
  expect(Number.isInteger(r.width)).toBe(true)
  expect(Number.isInteger(r.height)).toBe(true)
  // every edge is outside the rect it has to hide
  expect(r.left).toBeLessThanOrEqual(100.6)
  expect(r.top).toBeLessThanOrEqual(50.2)
  expect(r.left + r.width).toBeGreaterThanOrEqual(100.6 + 600.7)
  expect(r.top + r.height).toBeGreaterThanOrEqual(50.2 + 400.9)
})

test('coverRect overhangs by a pixel even when the rect is already whole', () => {
  // A whole CSS pixel is still a fraction of a device pixel at 1.5x, so landing
  // exactly on the edge is not enough to cover it.
  const r = coverRect({ left: 100, top: 50, width: 600, height: 400 })
  expect(r.left).toBeLessThan(100)
  expect(r.top).toBeLessThan(50)
  expect(r.left + r.width).toBeGreaterThan(700)
  expect(r.top + r.height).toBeGreaterThan(450)
  // but only just: the overhang lands on the mat, not over the picture
  expect(100 - r.left).toBeLessThanOrEqual(2)
  expect(r.left + r.width - 700).toBeLessThanOrEqual(2)
})
