// The reflection in the floor, done the old way: render the room a second time
// from a camera mirrored through the floor plane, and lay it over the concrete,
// faintly.
//
// This replaced screen-space reflections, which could only ever reflect what was
// already on the screen — so a painting reflected until it left the top of the
// view and then tore away, worst at the edges. A mirrored re-render has nothing
// missing: it draws the same scene, walls and all, so what lands in the floor is
// what is actually standing in the room, out to the far end of the corridor.
//
// It costs a whole extra pass over the geometry each frame, which is why it is
// behind the same desktop-only switch SSR was, and why its target is small: a
// reflection in polished concrete is low-frequency, and softness helps it.

import {
  Color, Mesh, PlaneGeometry, ShaderMaterial, UniformsUtils,
} from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import type { Room } from './types'

/**
 * How far above the floor the mirror lies. Enough to be in front of it for the
 * depth test, far too little to read as a step.
 */
export const MIRROR_Y = 0.004

/** How much of the room comes back off the floor. Polished concrete, not a mirror. */
const OPACITY = 0.22
/** Reflection lost per metre of distance, so the far end of a corridor keeps its haze. */
const FADE = 0.035
/** The reflection is the room's own light, slightly cooled and dimmed by the floor. */
const TINT = 0xb9b4ad

/**
 * The rectangle every floor in the museum fits inside.
 *
 * Era markers are rooms of zero area — a point in the corridor to teleport to —
 * and would drag the bounds out to wherever the last one stands, so they are
 * left out. Every floor is at y = 0, which is what lets one plane serve the
 * whole building.
 */
export function floorBounds(rooms: Room[]): { x: number; z: number; w: number; d: number } {
  const solid = rooms.filter((r) => r.rect.w > 0 && r.rect.d > 0)
  if (!solid.length) return { x: 0, z: 0, w: 0, d: 0 }
  const x = Math.min(...solid.map((r) => r.rect.x))
  const z = Math.min(...solid.map((r) => r.rect.z))
  const x1 = Math.max(...solid.map((r) => r.rect.x + r.rect.w))
  const z1 = Math.max(...solid.map((r) => r.rect.z + r.rect.d))
  return { x, z, w: x1 - x, d: z1 - z }
}

/**
 * The shader: the stock Reflector's projective lookup, with an alpha so the
 * reflection can be faint and die away with distance.
 *
 * No tone mapping and no colour-space conversion here on purpose. Three skips
 * tone mapping whenever it renders into a render target, which is exactly what
 * the Reflector renders into and what the composer draws this into, so the
 * values stay linear and the composer's OutputPass maps them once at the end.
 * The stock shader converts, because it expects to be drawn straight to screen.
 */
const MirrorShader = {
  uniforms: {
    color: { value: new Color(TINT) },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    opacity: { value: OPACITY },
    fade: { value: FADE },
  },
  vertexShader: /* glsl */`
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying float vDepth;

    void main() {
      vUv = textureMatrix * vec4( position, 1.0 );
      vec4 mv = modelViewMatrix * vec4( position, 1.0 );
      vDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */`
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform float opacity;
    uniform float fade;
    varying vec4 vUv;
    varying float vDepth;

    void main() {
      // Behind the mirror's own plane the projection is meaningless; drop it.
      if ( vUv.w <= 0.0 ) discard;
      vec4 base = texture2DProj( tDiffuse, vUv );
      gl_FragColor = vec4( base.rgb * color, opacity * exp( - fade * vDepth ) );
    }`,
}

/** What makeFloorMirror hands back: a Reflector with our shader material. */
export interface FloorMirror extends Mesh {
  material: ShaderMaterial
  dispose(): void
}

/**
 * A mirror lying over the whole floor.
 *
 * One plane serves the building because every floor is at y = 0. It is sized to
 * the museum's bounds and laid down by rotating the *object*, not its geometry:
 * three's Reflector reads its plane from the object's own world rotation, taking
 * local +z as the normal, so a floor is a plane turned a quarter turn about x.
 *
 * `width` and `height` are the reflection's own resolution, not the plane's size.
 */
export function makeFloorMirror(rooms: Room[], width: number, height: number): FloorMirror {
  const b = floorBounds(rooms)
  const mirror = new Reflector(new PlaneGeometry(b.w, b.d), {
    textureWidth: Math.max(1, Math.floor(width)),
    textureHeight: Math.max(1, Math.floor(height)),
    color: TINT,
    clipBias: 0.003,   // keeps the floor itself out of its own reflection
    shader: { ...MirrorShader, uniforms: UniformsUtils.clone(MirrorShader.uniforms) },
  }) as unknown as FloorMirror
  mirror.name = 'mirror'
  mirror.rotation.x = -Math.PI / 2
  mirror.position.set(b.x + b.w / 2, MIRROR_Y, b.z + b.d / 2)
  mirror.material.transparent = true
  mirror.material.depthWrite = false   // it lies on the floor; the floor keeps the depth
  mirror.updateMatrixWorld()
  return mirror
}
