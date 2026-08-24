import { test, expect } from 'vitest'
import { AdditiveBlending, DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial } from 'three'
import { buildScene } from './scene'
import type { Gallery, Painting } from './types'

const painting = (tile: number): Painting => ({
  project: tile, slug: 'p', name: 'P', artist: 'A', year: 2022, room: 'h', x: -3.98, z: 20, yaw: Math.PI / 2, tile, w: 1.2, h: 1.2,
})
const gallery: Gallery = {
  generatedAt: 'T',
  counts: { paintings: 3, artists: 1, soloRooms: 0, years: [2022, 2022] },
  atlas: { size: 4096, tile: 256, gutter: 4, cols: 15, files: ['gallery/a.webp', 'gallery/b.webp'], small: ['gallery/as.webp', 'gallery/bs.webp'] },
  spawn: { x: 0, z: 4, yaw: 0 },
  rooms: [{ id: 'h', kind: 'hall', title: 'H', rect: { x: -4, z: 0, w: 8, d: 30 }, entry: { x: 0, z: 1.5, yaw: 0 } }],
  walls: [{ x1: -4, z1: 0, x2: -4, z2: 30, y0: 0, y1: 4 }, { x1: -1, z1: 30, x2: 1, z2: 30, y0: 3, y1: 4 }],
  paintings: [painting(0), painting(1), painting(225)],
  signs: [{ text: 't', kind: 'plaque', x: 0, y: 1, z: 0, yaw: 0, w: 0.5, h: 0.12 }],
}

test('wallsMesh is the walls mesh, so picking can be blocked by it', () => {
  const built = buildScene(gallery, [null, null], null)
  expect(built.wallsMesh.name).toBe('walls')
  expect(built.wallsMesh.parent).toBe(built.scene)
  built.dispose()
})

test('one painting mesh per atlas file, indexed so a face maps back to its painting', () => {
  const built = buildScene(gallery, [null, null], null)
  expect(built.paintingMeshes.length).toBe(2)
  expect(built.paintingIndex[0].map((p) => p.tile)).toEqual([0, 1])
  expect(built.paintingIndex[1].map((p) => p.tile)).toEqual([225])
  expect(built.paintingMeshes[0].geometry.getAttribute('position').count).toBe(12)
  expect(built.paintingMeshes[0].parent).toBe(built.scene)
  built.dispose()
})

test('a missing atlas leaves its paintings flat dark, not missing', () => {
  const built = buildScene(gallery, [null, null], null)
  const m = built.paintingMeshes[0].material as MeshBasicMaterial
  expect(m.map).toBeNull()
  expect(m.color.getHex()).toBe(0x222222)
  built.dispose()
})

test('without a label texture there is no sign mesh; the rest of the building is there', () => {
  const built = buildScene(gallery, [null, null], null)
  const meshes = built.scene.children.filter((c) => c instanceof Mesh) as Mesh[]
  expect(meshes.map((m) => m.name).sort()).toEqual(['ceilings', 'floors', 'frames', 'lights', 'paintings-0', 'paintings-1', 'pools', 'walls'])
  built.dispose()
})

/** sRGB lightness of a hex colour, as a monitor shows it — not three's linear working value. */
const lightness = (hex: number) => (((hex >> 16) & 255) + ((hex >> 8) & 255) + (hex & 255)) / (3 * 255)

test('the rooms are lit like a gallery: a sky, a key, a fill, and walls light enough to see', () => {
  // The first build shipped #2a2a2a walls under a near-black ground light; a
  // vertical wall got about 6 % of the light and rendered as black.
  const built = buildScene(gallery, [null, null], null)
  expect(built.scene.children.filter((c) => c instanceof HemisphereLight).length).toBe(1)
  expect(built.scene.children.filter((c) => c instanceof DirectionalLight).length).toBe(2)
  const walls = built.wallsMesh.material as MeshLambertMaterial | MeshStandardMaterial
  // Gallery white: the first fix's #7a746c (0.45) still read as a dim corridor.
  expect(lightness(walls.color.getHex())).toBeGreaterThanOrEqual(0.85)
  built.dispose()
})

test('every painting gets a spot pool: one additive quad each, in one mesh', () => {
  const built = buildScene(gallery, [null, null], null)
  const pools = built.scene.children.find((c) => c.name === 'pools') as Mesh
  expect(pools).toBeDefined()
  expect(pools.geometry.getAttribute('position').count).toBe(gallery.paintings.length * 6)
  const m = pools.material as MeshBasicMaterial
  expect(m.blending).toBe(AdditiveBlending)
  expect(m.transparent).toBe(true)
  expect(m.depthWrite).toBe(false)
  expect(m.map).not.toBeNull()
  built.dispose()
})

test('the ceiling is a bright, unlit surface — a gallery ceiling, not a black void', () => {
  // A downward-facing plane gets nothing from lights placed above it, so lighting
  // the ceiling "properly" cannot make it bright; an unlit flat colour is what a
  // white gallery ceiling looks like anyway.
  const built = buildScene(gallery, [null, null], null)
  const ceiling = built.scene.children.find((c) => c.name === 'ceilings') as Mesh
  const m = ceiling.material as MeshBasicMaterial
  expect(m.type).toBe('MeshBasicMaterial')
  expect(lightness(m.color.getHex())).toBeGreaterThanOrEqual(0.8)
  built.dispose()
})

test('a floor that can reflect, walls and frames that cast and take shadows, light strips, and a key light to move', () => {
  const built = buildScene(gallery, [null, null], null)
  const floor = built.scene.children.find((c) => c.name === 'floors') as Mesh
  const m = floor.material as MeshStandardMaterial
  expect(m.type).toBe('MeshStandardMaterial')
  expect(m.roughness).toBeLessThanOrEqual(0.4)       // polished concrete: takes the room's reflection
  expect(floor.receiveShadow).toBe(true)
  expect(built.wallsMesh.receiveShadow).toBe(true)
  expect(built.wallsMesh.castShadow).toBe(true)
  const frames = built.scene.children.find((c) => c.name === 'frames') as Mesh
  expect(frames.castShadow).toBe(true)
  const lights = built.scene.children.find((c) => c.name === 'lights') as Mesh
  expect(lights.geometry.getAttribute('position').count).toBe(gallery.rooms.length * 36)
  expect((lights.material as MeshBasicMaterial).type).toBe('MeshBasicMaterial')   // it is the light; it is not lit
  expect(built.keyLight.castShadow).toBe(true)
  expect(built.keyLight.parent).toBe(built.scene)
  built.dispose()
})
