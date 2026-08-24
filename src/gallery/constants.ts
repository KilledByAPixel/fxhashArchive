// The few numbers the client needs from the build's geometry (mirrors
// scripts/gallery-lib.mjs), plus the ones that are the client's own.

export const PAINTING = 1.2
export const EYE_Y = 1.6
export const WALL_T = 0.3
export const WALL_H = 4

export const FOV = 70
export const WALK_SPEED = 3
/**
 * Shift. The halls are up to 105 m long, and 5 m/s — the first value — made
 * crossing one a chore; Frank asked for four times that. Fast enough that a
 * single frame can move further than a wall is thick, which is why `integrate`
 * sub-steps: see SUB_STEP in controls.ts.
 */
export const RUN_SPEED = 20
export const PLAYER_RADIUS = 0.4
/** At the viewing pose the painting fills this much of the viewport's shorter side. */
export const FILL = 0.75
export const GLIDE_MS = 600
/** Farthest a painting can be and still get a crosshair caption, metres. */
export const CAPTION_RANGE = 6
