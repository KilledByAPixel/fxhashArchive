// The building as three.js objects. Lit like a gallery, unlit where the art is:
// the walls take light so the rooms read as rooms, the paintings do not, so a
// piece on the wall is the same pixels the artist's program produced.
//
// The first build had #2a2a2a walls under a near-black ground light — "dark
// neutral, so the pictures are the light" taken literally — and a vertical wall
// got about six percent of the light, which every monitor shows as black; a
// second pass at #7a746c still read as a dim corridor. So: gallery white. Walls
// off-white, a light concrete floor, a flat white ceiling, a white sky with a
// mid-grey ground so undersides are not dark, a warm key down the spine and a
// cool fill from the other side, and a pool of warm lamplight on the wall
// behind every painting. The pictures are still the brightest thing in the room.

import {
  AdditiveBlending, Color, DirectionalLight, FogExp2, HemisphereLight, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, Scene, Texture,
} from 'three'
import type { Gallery, Painting, Room } from './types'
import {
  atlasFile, buildCeilingGeometry, buildFloorGeometry, buildFrameGeometry, buildLightStripGeometry,
  buildPaintingGeometry, buildPoolGeometry, buildSignGeometry, buildWallGeometry,
  type Rgb, type SolidFaceColor, type TileUv,
} from './geometry'
import { WALL_T } from './constants'
import { makePoolTexture, POOL_COLOR, POOL_OPACITY } from './pools'
import { linear, washed } from './palette'
import { buildSculptureGeometry, plinths } from './sculpture'

export interface BuiltScene {
  scene: Scene
  /** The one merged walls mesh, so picking can be blocked by it — see engine.ts paintingAt. */
  wallsMesh: Mesh
  /** The one signs mesh, so a pass that must not see it can take it out — see hidden(). Null without labels. */
  signsMesh: Mesh | null
  paintingMeshes: Mesh[]
  /** paintingIndex[f][floor(faceIndex / 2)] is the painting behind a hit on paintingMeshes[f]. */
  paintingIndex: Painting[][]
  dispose(): void
}

/** Also the fog colour: a haze the far end of a corridor softens into, not a dark it vanishes into. */
export const BACKGROUND = 0x5c5a57

/** Gallery white. Exported because the signs' text has to be readable against it — see labels.ts. */
export const WALL = 0xe8e6e1

/**
 * The floor. This is the knob for how dark the ground is.
 *
 * Matte, not polished, and that is a change of mind: the floor used to be
 * roughness 0.35 so it could fake a reflection out of the environment map. Now
 * that a real mirror lies on it (mirror.ts), that fake was worse than useless —
 * RoomEnvironment is a generic studio box with bright panels in it, and a
 * glossy floor turned those into a hard specular glare sitting in the middle of
 * the room with nothing above it to explain the light. The shine belongs to the
 * mirror, which reflects what is actually standing there; the surface under it
 * is plain dark concrete.
 *
 * It went darker still — 0x5f5b56 to 0x2a2724 — and that is not a free number.
 * The mirror is a fixed-opacity overlay, so halving what lies under it doubles
 * the reflection's share of what you see: at 0.22 this floor would have become
 * polished black glass with the paintings swimming in it. OPACITY in mirror.ts
 * came down to match, and the two have to move together.
 */
export const FLOOR = 0x2a2724
const FLOOR_ROUGHNESS = 0.8

/**
 * How much colour a room takes from the art hung in it, as an HSV saturation at
 * full strength — the room's own `tint.strength` scales it down from there.
 *
 * This is the knob. Set both to 0 and every wall in the building is flat WALL
 * again, exactly as it was before any of this existed.
 *
 * The hue itself is decided in the build (scripts/gallery-tint.mjs) because only
 * the build has the thumbnails; how hard it is pushed is decided here, because
 * this is the file you can edit and see the result in the same second.
 */
export const TINT_SOLO = 0.10
/**
 * The corridor's share, held right back. A hall is a whole era's worth of
 * unrelated artists averaged together, so its hue means much less than a single
 * artist's does — and a corridor you walk the length of is the wrong place to
 * notice paint. It should read as "this stretch is warmer than that one", never
 * as a colour.
 */
export const TINT_HALL = 0.035

/**
 * How far past a wall face to look when asking which room that face is in. Has
 * to clear the wall's own half-thickness; beyond that, smaller is safer, since a
 * long probe from a corner can reach into a room the face does not belong to.
 */
const PROBE = WALL_T / 2 + 0.1

/**
 * What colour to paint each face of each wall.
 *
 * A face is assigned to a room by standing just off it and asking which room's
 * floor that point is over — which is what makes a wall between an artist's room
 * and the corridor come out tinted on the room side and white on the corridor
 * side, with no bookkeeping: those are two different faces of the same box.
 *
 * Every face gets an explicit colour, untinted ones included, so the material's
 * own colour is white and the walls are entirely described by the attribute.
 * That is a little more memory than tinting by multiplier, and much easier to
 * reason about — a wall's colour is the number in the buffer.
 */
export function wallPaint(rooms: Room[]): SolidFaceColor {
  // Era markers are rooms of zero area — a point in the corridor to teleport to —
  // and can contain nothing, so they are not candidates.
  const solid = rooms.filter((r) => r.rect.w > 0 && r.rect.d > 0)
  const base = linear(WALL)
  const cache = new Map<string, Rgb>()
  const paintOf = (room: Room): Rgb => {
    const hit = cache.get(room.id)
    if (hit) return hit
    // A hall is a whole era of unrelated artists averaged together, so it gets a
    // fraction of what one artist's room does.
    const rgb = washed(WALL, room.tint, room.kind === 'hall' ? TINT_HALL : TINT_SOLO)
    cache.set(room.id, rgb)
    return rgb
  }
  return (centre, normal) => {
    // A face pointing straight up or down cannot be probed sideways into a room.
    // Those are wall tops (hidden by the ceiling) and door-reveal undersides, and
    // plain white is right for both.
    if (normal[1] !== 0) return base
    const px = centre[0] + normal[0] * PROBE
    const pz = centre[2] + normal[2] * PROBE
    const room = solid.find((r) =>
      px >= r.rect.x && px <= r.rect.x + r.rect.w && pz >= r.rect.z && pz <= r.rect.z + r.rect.d)
    return room?.tint ? paintOf(room) : base
  }
}

export function buildScene(
  gallery: Gallery,
  atlasTextures: (Texture | null)[],
  labels: { texture: Texture; uvs: TileUv[] } | null,
): BuiltScene {
  const scene = new Scene()
  scene.background = new Color(BACKGROUND)
  // Exponential fog in the background colour: the long halls fade rather than end.
  scene.fog = new FogExp2(BACKGROUND, 0.012)

  const meshes: Mesh[] = []
  const add = (name: string, mesh: Mesh) => {
    mesh.name = name
    scene.add(mesh)
    meshes.push(mesh)
    return mesh
  }

  // Physically based where light matters: matte plaster walls, and a floor with
  // just enough polish to carry the room's reflection from the environment map
  // the engine installs (and true reflections when the visitor turns them on).
  // White material, colour in the attribute: see wallPaint. Every face carries an
  // explicit colour, so `color` here must be white or it would multiply them all.
  const wallsMesh = add('walls', new Mesh(
    buildWallGeometry(gallery.walls, wallPaint(gallery.rooms)),
    new MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0, vertexColors: true }),
  ))
  add('floors', new Mesh(buildFloorGeometry(gallery.rooms), new MeshStandardMaterial({ color: FLOOR, roughness: FLOOR_ROUGHNESS, metalness: 0 })))
  // The lamps: white strips along every ceiling, unlit because they are the light.
  add('lights', new Mesh(buildLightStripGeometry(gallery.rooms), new MeshBasicMaterial({ color: 0xffffff, toneMapped: false })))
  // Unlit on purpose: a face that points down gets nothing from lights placed
  // above it, so no amount of lighting makes a Lambert ceiling bright. A flat
  // white is what a gallery ceiling looks like anyway.
  add('ceilings', new Mesh(buildCeilingGeometry(gallery.rooms), new MeshBasicMaterial({ color: 0xd9d9d9 })))

  // Lamplight on the wall behind each painting, drawn before the frames and
  // paintings so it sits under them. Additive, so it brightens the wall it lands
  // on rather than painting over it; no fog, or distant pools would tint.
  const poolTexture = makePoolTexture()
  add('pools', new Mesh(
    buildPoolGeometry(gallery.paintings),
    new MeshBasicMaterial({
      map: poolTexture, color: POOL_COLOR, opacity: POOL_OPACITY,
      transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false, fog: false,
    }),
  ))

  add('frames', new Mesh(buildFrameGeometry(gallery.paintings), new MeshBasicMaterial({ color: 0x0b0b0b })))

  // Plinths and the sculpture on them, for the one room with floor to spare. One
  // mesh, one material: stone and plaster tell themselves apart by vertex colour,
  // the same way the walls carry their paint. Empty in every other building, in
  // which case the geometry has no vertices and costs nothing.
  const standing = plinths(gallery)
  if (standing.length) {
    add('sculpture', new Mesh(
      buildSculptureGeometry(standing),
      new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, metalness: 0, vertexColors: true }),
    ))
  }

  const paintingMeshes: Mesh[] = []
  const paintingIndex: Painting[][] = []
  gallery.atlas.files.forEach((_, f) => {
    const texture = atlasTextures[f] ?? null
    // Unlit, and kept out of tone mapping: the atlas pixels go to the screen as they are.
    const material = texture
      ? new MeshBasicMaterial({ map: texture, toneMapped: false })
      : new MeshBasicMaterial({ color: 0x222222 })
    const mesh = add(`paintings-${f}`, new Mesh(buildPaintingGeometry(gallery.paintings, gallery.atlas, f), material))
    paintingMeshes.push(mesh)
    paintingIndex.push(gallery.paintings.filter((p) => atlasFile(p.tile, gallery.atlas) === f))
  })

  // Ink on the plaster: unlit, out of tone mapping, and casting nothing. It lies
  // 5 mm off the wall (SIGN_OFFSET) so polygon offset is belt to that braces —
  // the quad must win the depth test the length of a corridor away.
  let signsMesh: Mesh | null = null
  if (labels) {
    signsMesh = add('signs', new Mesh(
      buildSignGeometry(gallery.signs, labels.uvs),
      new MeshBasicMaterial({
        map: labels.texture, transparent: true, depthWrite: false, toneMapped: false,
        polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
      }),
    ))
    signsMesh.castShadow = false
  }

  // A white sky over a mid-grey ground, so nothing that faces sideways or down
  // goes dark; a warm key from above and ahead, down the spine; a cool fill from
  // behind and to the side so the shadowed faces of walls and door reveals are
  // not flat. Kept modest: off-white walls under strong lights clip to pure
  // white and the room loses its edges. Directional lights aim at the origin,
  // so only their direction matters.
  // The ground half of this is a stand-in for light bouncing off the floor, so it
  // has to follow the floor. It was 0x9a9a9a against light concrete; against the
  // dark stone FLOOR is now, that much bounce is light arriving from nowhere.
  const hemi = new HemisphereLight(0xffffff, 0x6b6660, 1.0)
  // Only the direction of these two matters — a directional light has no place,
  // and this one points steeply down, the way light comes off a ceiling.
  //
  // Nothing in here casts a shadow. A directional light is a sun, and a sun
  // shines through a roof: this one threw long angled shadows across a closed
  // building, which was the one thing that gave the room away. What grounds an
  // object now is the ambient occlusion, which measures the room as it is
  // built — and the lamp pools on the wall behind each painting.
  const key = new DirectionalLight(0xfff1dc, 0.6)
  key.position.set(2, 8, -3)
  const fill = new DirectionalLight(0xcfe0ff, 0.3)
  fill.position.set(-3, 6, 4)
  scene.add(hemi, key, key.target, fill)

  return {
    scene,
    wallsMesh,
    signsMesh,
    paintingMeshes,
    paintingIndex,
    dispose() {
      for (const m of meshes) {
        m.geometry.dispose()
        ;(m.material as MeshBasicMaterial).dispose()   // atlas and label textures are the loader's to dispose
      }
      poolTexture.dispose()   // ours: made here, disposed here
      key.shadow.dispose()
      scene.clear()
    },
  }
}

/**
 * Run `pass` with `object` hidden, then put it back exactly as it was — even if
 * the pass throws, which would otherwise leave it invisible for the rest of the
 * session. This is how the signs are kept out of the ambient occlusion: they are
 * ink on a wall, and a pass that measures how surfaces shade each other has no
 * business seeing them.
 */
export function hidden<T>(object: Object3D | null, pass: () => T): T {
  if (!object) return pass()
  const was = object.visible
  object.visible = false
  try {
    return pass()
  } finally {
    object.visible = was
  }
}
