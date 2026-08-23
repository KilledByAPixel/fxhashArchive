// The building as three.js objects. Dark, neutral, and unlit where the art is:
// the walls take light so the rooms read as rooms, the paintings do not, so a
// piece on the wall is the same pixels the artist's program produced.

import {
  Color, DirectionalLight, FogExp2, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  Scene, Texture,
} from 'three'
import type { Gallery, Painting } from './types'
import {
  atlasFile, buildFloorGeometry, buildFrameGeometry, buildPaintingGeometry, buildSignGeometry, buildWallGeometry,
  type TileUv,
} from './geometry'

export interface BuiltScene {
  scene: Scene
  paintingMeshes: Mesh[]
  /** paintingIndex[f][floor(faceIndex / 2)] is the painting behind a hit on paintingMeshes[f]. */
  paintingIndex: Painting[][]
  dispose(): void
}

export const BACKGROUND = 0x111111

export function buildScene(
  gallery: Gallery,
  atlasTextures: (Texture | null)[],
  labels: { texture: Texture; uvs: TileUv[] } | null,
): BuiltScene {
  const scene = new Scene()
  scene.background = new Color(BACKGROUND)
  // Exponential fog in the background colour: the long halls fade rather than end.
  scene.fog = new FogExp2(BACKGROUND, 0.022)

  const meshes: Mesh[] = []
  const add = (name: string, mesh: Mesh) => {
    mesh.name = name
    scene.add(mesh)
    meshes.push(mesh)
    return mesh
  }

  add('walls', new Mesh(buildWallGeometry(gallery.walls), new MeshLambertMaterial({ color: 0x2a2a2a })))
  add('floors', new Mesh(buildFloorGeometry(gallery.rooms), new MeshLambertMaterial({ color: 0x1a1a1a })))
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

  const hemi = new HemisphereLight(0x9a9288, 0x0c0c0c, 1.4)
  const sun = new DirectionalLight(0xffffff, 0.5)
  sun.position.set(3, 10, 2)
  scene.add(hemi, sun)

  return {
    scene,
    paintingMeshes,
    paintingIndex,
    dispose() {
      for (const m of meshes) {
        m.geometry.dispose()
        ;(m.material as MeshBasicMaterial).dispose()   // textures are the loader's to dispose
      }
      scene.clear()
    },
  }
}
