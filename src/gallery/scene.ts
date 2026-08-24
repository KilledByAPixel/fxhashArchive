// The building as three.js objects. Lit like a gallery, unlit where the art is:
// the walls take light so the rooms read as rooms, the paintings do not, so a
// piece on the wall is the same pixels the artist's program produced.
//
// The first build had #2a2a2a walls under a near-black ground light — "dark
// neutral, so the pictures are the light" taken literally — and a vertical wall
// got about six percent of the light, which every monitor shows as black. The
// walls are now a warm mid grey under a warm sky, a warm key light angled down
// the spine, a cool fill from the other side, and a pool of lamplight on the
// wall behind every painting. The pictures are still the brightest thing in the
// room; the room just exists now.

import {
  AdditiveBlending, Color, DirectionalLight, FogExp2, HemisphereLight, Mesh, MeshBasicMaterial,
  MeshLambertMaterial, Scene, Texture,
} from 'three'
import type { Gallery, Painting } from './types'
import {
  atlasFile, buildCeilingGeometry, buildFloorGeometry, buildFrameGeometry, buildPaintingGeometry,
  buildPoolGeometry, buildSignGeometry, buildWallGeometry, type TileUv,
} from './geometry'
import { makePoolTexture, POOL_COLOR, POOL_OPACITY } from './pools'

export interface BuiltScene {
  scene: Scene
  /** The one merged walls mesh, so picking can be blocked by it — see engine.ts paintingAt. */
  wallsMesh: Mesh
  paintingMeshes: Mesh[]
  /** paintingIndex[f][floor(faceIndex / 2)] is the painting behind a hit on paintingMeshes[f]. */
  paintingIndex: Painting[][]
  dispose(): void
}

export const BACKGROUND = 0x151515

export function buildScene(
  gallery: Gallery,
  atlasTextures: (Texture | null)[],
  labels: { texture: Texture; uvs: TileUv[] } | null,
): BuiltScene {
  const scene = new Scene()
  scene.background = new Color(BACKGROUND)
  // Exponential fog in the background colour: the long halls fade rather than end.
  scene.fog = new FogExp2(BACKGROUND, 0.018)

  const meshes: Mesh[] = []
  const add = (name: string, mesh: Mesh) => {
    mesh.name = name
    scene.add(mesh)
    meshes.push(mesh)
    return mesh
  }

  const wallsMesh = add('walls', new Mesh(buildWallGeometry(gallery.walls), new MeshLambertMaterial({ color: 0x7a746c })))
  add('floors', new Mesh(buildFloorGeometry(gallery.rooms), new MeshLambertMaterial({ color: 0x3a3634 })))
  add('ceilings', new Mesh(buildCeilingGeometry(gallery.rooms), new MeshLambertMaterial({ color: 0x2b2b2b })))

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

  // A warm sky over a grey floor; a warm key from above and ahead, down the
  // spine; a cool fill from behind and to the side so the shadowed faces of
  // walls and door reveals are not flat. Directional lights aim at the origin,
  // so only their direction matters.
  const hemi = new HemisphereLight(0xfff4e6, 0x3a3a3a, 1.6)
  const key = new DirectionalLight(0xfff1dc, 1.2)
  key.position.set(2, 8, -3)
  const fill = new DirectionalLight(0xcfe0ff, 0.4)
  fill.position.set(-3, 6, 4)
  scene.add(hemi, key, fill)

  return {
    scene,
    wallsMesh,
    paintingMeshes,
    paintingIndex,
    dispose() {
      for (const m of meshes) {
        m.geometry.dispose()
        ;(m.material as MeshBasicMaterial).dispose()   // atlas and label textures are the loader's to dispose
      }
      poolTexture.dispose()   // ours: made here, disposed here
      scene.clear()
    },
  }
}
