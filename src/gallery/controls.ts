// src/gallery/controls.ts
// How input becomes movement, with no DOM in it: the engine feeds key state and
// mouse deltas in, a new player state comes out. A pose faces (sin yaw, 0, cos yaw);
// its right-hand side is (-cos yaw, 0, sin yaw).

import type { Pose, Wall } from './types'
import { WALK_SPEED, RUN_SPEED } from './constants'
import { resolve, type Obstacle, type Point } from './collide'

export interface PlayerState { x: number; z: number; yaw: number; pitch: number }
export interface Keys { forward: boolean; back: boolean; left: boolean; right: boolean; run: boolean }

export const emptyKeys = (): Keys => ({ forward: false, back: false, left: false, right: false, run: false })
export const anyMove = (k: Keys) => k.forward || k.back || k.left || k.right

const KEY_MAP: Record<string, keyof Keys> = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  ShiftLeft: 'run', ShiftRight: 'run',
}
export const keyFor = (code: string): keyof Keys | null => KEY_MAP[code] ?? null

export const fromPose = (p: Pose): PlayerState => ({ x: p.x, z: p.z, yaw: p.yaw, pitch: 0 })
export const toPose = (s: PlayerState): Pose => ({ x: s.x, z: s.z, yaw: s.yaw })

const PITCH_LIMIT = (85 * Math.PI) / 180

/**
 * The most a single move may cover. The collider only knows where you are, not
 * where you were, so a move longer than a wall is thick plus the collision
 * radius can land on the far side and be pushed the wrong way — at RUN_SPEED a
 * 50 ms frame is a metre. Anything longer than this is taken in pieces.
 */
export const SUB_STEP = 0.25

/** One frame of walking. Diagonals are normalised so nobody is faster sideways-and-forward. */
export function integrate(s: PlayerState, keys: Keys, dt: number, walls: Wall[], obstacles: Obstacle[] = []): PlayerState {
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw)
  const rx = -Math.cos(s.yaw), rz = Math.sin(s.yaw)
  let dx = 0, dz = 0
  if (keys.forward) { dx += fx; dz += fz }
  if (keys.back) { dx -= fx; dz -= fz }
  if (keys.right) { dx += rx; dz += rz }
  if (keys.left) { dx -= rx; dz -= rz }
  const len = Math.hypot(dx, dz)
  if (len === 0) return s
  const total = (keys.run ? RUN_SPEED : WALK_SPEED) * dt
  const pieces = Math.max(1, Math.ceil(total / SUB_STEP))
  const step = total / pieces
  let p: Point = { x: s.x, z: s.z }
  for (let i = 0; i < pieces; i++) {
    p = resolve({ x: p.x + (dx / len) * step, z: p.z + (dz / len) * step }, walls, undefined, obstacles)
  }
  return { ...s, x: p.x, z: p.z }
}

/** Mouse-right turns right (yaw decreases — see the convention above); pitch clamps short of straight up. */
export function look(s: PlayerState, dx: number, dy: number, sensitivity = 0.002): PlayerState {
  return {
    ...s,
    yaw: s.yaw - dx * sensitivity,
    pitch: Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, s.pitch - dy * sensitivity)),
  }
}

/**
 * Tap-to-walk: straight at the target at walking speed. "Arrived" also covers
 * "blocked" — a wall absorbed most of the step — so a tap through a wall does not
 * leave the visitor grinding against it forever.
 */
export function walkToward(s: PlayerState, target: Point, dt: number, walls: Wall[], obstacles: Obstacle[] = []): { state: PlayerState; arrived: boolean } {
  const dx = target.x - s.x, dz = target.z - s.z
  const dist = Math.hypot(dx, dz)
  const step = Math.min(dist, WALK_SPEED * dt)
  if (dist < 0.1) return { state: s, arrived: true }
  const p = resolve({ x: s.x + (dx / dist) * step, z: s.z + (dz / dist) * step }, walls, undefined, obstacles)
  const moved = Math.hypot(p.x - s.x, p.z - s.z)
  return { state: { ...s, x: p.x, z: p.z }, arrived: moved < step * 0.1 || dist - step < 0.1 }
}
