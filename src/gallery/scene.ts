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
  MeshStandardMaterial, Scene, Texture,
} from 'three'
import type { Gallery, Painting } from './types'
import {
  atlasFile, buildCeilingGeometry, buildFloorGeometry, buildFrameGeometry, buildLightStripGeometry,
  buildPaintingGeometry, buildPoolGeometry, buildSignGeometry, buildWallGeometry, type TileUv,
} from './geometry'
import { makePoolTexture, POOL_COLOR, POOL_OPACITY } from './pools'

export interface BuiltScene {
  scene: Scene
  /** The one merged walls mesh, so picking can be blocked by it — see engine.ts paintingAt. */
  wallsMesh: Mesh
  /** The one merged floor mesh: the surface screen-space reflections are drawn on. */
  floorsMesh: Mesh
  paintingMeshes: Mesh[]
  /** paintingIndex[f][floor(faceIndex / 2)] is the painting behind a hit on paintingMeshes[f]. */
  paintingIndex: Painting[][]
  /** The shadow-casting key light. The engine walks it along with the visitor so its shadow map stays sharp. */
  keyLight: DirectionalLight
  dispose(): void
}

/** Also the fog colour: a haze the far end of a corridor softens into, not a dark it vanishes into. */
export const BACKGROUND = 0x5c5a57

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
  const wallsMesh = add('walls', new Mesh(buildWallGeometry(gallery.walls), new MeshStandardMaterial({ color: 0xe8e6e1, roughness: 0.95, metalness: 0 })))
  wallsMesh.castShadow = true
  wallsMesh.receiveShadow = true
  const floors = add('floors', new Mesh(buildFloorGeometry(gallery.rooms), new MeshStandardMaterial({ color: 0x8f8880, roughness: 0.35, metalness: 0 })))
  floors.receiveShadow = true
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

  const frames = add('frames', new Mesh(buildFrameGeometry(gallery.paintings), new MeshBasicMaterial({ color: 0x0b0b0b })))
  frames.castShadow = true

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

  if (labels) {
    add('signs', new Mesh(
      buildSignGeometry(gallery.signs, labels.uvs),
      new MeshBasicMaterial({ map: labels.texture, transparent: true, depthWrite: false, toneMapped: false }),
    ))
  }

  // A white sky over a mid-grey ground, so nothing that faces sideways or down
  // goes dark; a warm key from above and ahead, down the spine; a cool fill from
  // behind and to the side so the shadowed faces of walls and door reveals are
  // not flat. Kept modest: off-white walls under strong lights clip to pure
  // white and the room loses its edges. Directional lights aim at the origin,
  // so only their direction matters.
  const hemi = new HemisphereLight(0xffffff, 0x9a9a9a, 1.0)
  const key = new DirectionalLight(0xfff1dc, 0.6)
  key.position.set(2, 8, -3)
  // Shadows come from the key alone. Its shadow camera is a 40 m box that the
  // engine keeps centred on the visitor: one map over a 250 m museum would be
  // 12 cm a texel; over 40 m it is 2 cm, and a frame's shadow reads as a frame.
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -20
  key.shadow.camera.right = 20
  key.shadow.camera.top = 20
  key.shadow.camera.bottom = -20
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 60
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  const fill = new DirectionalLight(0xcfe0ff, 0.3)
  fill.position.set(-3, 6, 4)
  scene.add(hemi, key, key.target, fill)

  return {
    scene,
    wallsMesh,
    floorsMesh: floors,
    paintingMeshes,
    paintingIndex,
    keyLight: key,
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
