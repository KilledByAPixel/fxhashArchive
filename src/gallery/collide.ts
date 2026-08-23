// The player is a circle on the floor plan; walls are the segments from
// gallery.json, drawn WALL_T thick. A few hundred segments is nothing to test
// every frame, so there is no spatial index — and no physics library for what is
// one nearest-point formula.

import type { Wall } from './types'
import { PLAYER_RADIUS, WALL_T } from './constants'

export interface Point { x: number; z: number }

/** The wall's half-thickness is part of the distance: the segment is its centre line. */
export const COLLISION_RADIUS = PLAYER_RADIUS + WALL_T / 2

/** Only a wall that reaches the floor blocks anyone; lintels over doors have y0 > 0. */
export const solidWalls = (walls: Wall[]) => walls.filter((w) => w.y0 === 0)

/** Move `p` out of `w` along the shortest way, or return it untouched. */
export function pushOut(p: Point, w: Wall, r: number): Point {
  const dx = w.x2 - w.x1
  const dz = w.z2 - w.z1
  const len2 = dx * dx + dz * dz
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - w.x1) * dx + (p.z - w.z1) * dz) / len2))
  const cx = w.x1 + t * dx
  const cz = w.z1 + t * dz
  const nx = p.x - cx
  const nz = p.z - cz
  const d = Math.hypot(nx, nz)
  if (d >= r) return p
  if (d === 0) {
    // Dead centre on the line: push perpendicular to it, arbitrarily to one side.
    const l = Math.hypot(dz, dx) || 1
    return { x: p.x - (dz / l) * r, z: p.z + (dx / l) * r }
  }
  const k = (r - d) / d
  return { x: p.x + nx * k, z: p.z + nz * k }
}

/** Two passes so a corner, where one push undoes another, settles. */
export function resolve(p: Point, walls: Wall[], r = COLLISION_RADIUS): Point {
  let q = p
  for (let pass = 0; pass < 2; pass++) for (const w of walls) q = pushOut(q, w, r)
  return q
}
