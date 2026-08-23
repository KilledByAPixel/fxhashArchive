// Standing in front of a painting, and where it lands on the screen.
//
// When the camera is on a painting's normal, level, looking straight at it, the
// painting is a rectangle parallel to the image plane — so its projection is an
// axis-aligned rectangle in CSS pixels, and a plain DOM element can be laid over
// it exactly. That is what lets the sandboxed piece run "on the wall" with no
// CSS3D compositing: the camera is steered to the one pose where a 2-D overlay is
// correct, and the overlay is PieceFrame, unchanged.

import { PerspectiveCamera, Vector3 } from 'three'
import type { Painting, Pose } from './types'
import { PAINTING, EYE_Y, FILL } from './constants'

export interface ScreenRect { left: number; top: number; width: number; height: number }

/**
 * How far back to stand so the painting fills `fill` of the viewport's shorter
 * side. The fov is vertical; in portrait the width is the tighter constraint, and
 * the horizontal half-angle's tangent is the vertical one times the aspect.
 */
export function viewingDistance(fovDeg: number, aspect: number, fill = FILL): number {
  const halfTan = Math.tan((fovDeg * Math.PI) / 360)
  return PAINTING / (2 * fill * halfTan * Math.min(1, aspect))
}

/** On the painting's normal at the viewing distance, facing it. */
export function viewingPose(p: Painting, fovDeg: number, aspect: number): Pose {
  const d = viewingDistance(fovDeg, aspect)
  return { x: p.x + Math.sin(p.yaw) * d, z: p.z + Math.cos(p.yaw) * d, yaw: p.yaw + Math.PI }
}

/** A comfortable distance back — where a `?project=` link puts you. */
export function standingPose(p: Painting, distance = 3): Pose {
  return { x: p.x + Math.sin(p.yaw) * distance, z: p.z + Math.cos(p.yaw) * distance, yaw: p.yaw + Math.PI }
}

/**
 * Put the camera at a pose. The convention for the whole gallery: a pose faces
 * (sin yaw, 0, cos yaw); a three.js camera faces (-sin r, 0, -cos r) for
 * rotation.y = r; so r = yaw + π. Yaw then pitch, so looking up never rolls.
 */
export function applyPose(camera: PerspectiveCamera, pose: Pose, pitch = 0): void {
  camera.position.set(pose.x, EYE_Y, pose.z)
  camera.rotation.set(pitch, pose.yaw + Math.PI, 0, 'YXZ')
  camera.updateMatrixWorld()
}

/** The painting's right-hand direction as a visitor facing it sees it. */
export const paintingRight = (p: Painting) => new Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw))

/**
 * The bounding box of the painting's four corners on screen, in CSS pixels.
 * Exact at the viewing pose; merely a bounding box anywhere else.
 */
export function projectedRect(camera: PerspectiveCamera, p: Painting, width: number, height: number): ScreenRect {
  const right = paintingRight(p)
  const half = PAINTING / 2
  const xs: number[] = []
  const ys: number[] = []
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const v = new Vector3(p.x, EYE_Y + sy * half, p.z).addScaledVector(right, sx * half).project(camera)
    xs.push(((v.x + 1) / 2) * width)
    ys.push(((1 - v.y) / 2) * height)
  }
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/** From a to b the short way round. */
export function lerpAngle(a: number, b: number, t: number): number {
  const twoPi = 2 * Math.PI
  const d = ((((b - a + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI
  return a + d * t
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, yaw: lerpAngle(a.yaw, b.yaw, t) }
}
