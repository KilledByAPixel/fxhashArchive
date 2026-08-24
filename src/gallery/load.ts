// src/gallery/load.ts
// Fetching the two thumbnail atlases, at the size this device can use.

import { LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace, Texture, TextureLoader, WebGLRenderer } from 'three'
import type { Gallery } from './types'

/**
 * A 4096² texture is the large atlas's whole point, and a phone that cannot
 * take one — or that would spend a third of its memory on two — gets the pair
 * drawn at half size, same layout, same UVs.
 */
export const chooseSmall = (maxTextureSize: number, screenShortSide: number) =>
  maxTextureSize < 4096 || screenShortSide < 800

/**
 * How much rendering a device gets. 'low' is the plain renderer: no shadows, no
 * post-processing — phones and small GPUs. 'high' adds shadows, ambient
 * occlusion and anti-aliasing. 'ultra' is 'high' with screen-space reflections
 * on the floor, which costs real frame time and is the visitor's to switch on.
 */
export type Quality = 'low' | 'high' | 'ultra'
export const chooseQuality = (touch: boolean, maxTextureSize: number): Quality =>
  touch || maxTextureSize < 4096 ? 'low' : 'high'

export const atlasUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`

/** Ask a throwaway context what the GPU allows, before choosing which atlases to fetch. */
export function probeCapabilities(): { maxTextureSize: number; maxAnisotropy: number } {
  const probe = new WebGLRenderer({ canvas: document.createElement('canvas') })
  const caps = { maxTextureSize: probe.capabilities.maxTextureSize, maxAnisotropy: probe.capabilities.getMaxAnisotropy() }
  probe.dispose()
  probe.forceContextLoss()
  return caps
}

/**
 * Every atlas in parallel. One that fails resolves to null rather than rejecting
 * the lot: its paintings draw as flat dark tiles and the rest of the museum is
 * unaffected — captions, approaching and playing need no image.
 */
export function loadAtlases(gallery: Gallery, small: boolean, maxAnisotropy: number): Promise<(Texture | null)[]> {
  const loader = new TextureLoader()
  const files = small ? gallery.atlas.small : gallery.atlas.files
  return Promise.all(
    files.map(
      (file) =>
        new Promise<Texture | null>((resolve) => {
          loader.load(
            atlasUrl(file),
            (texture) => {
              texture.colorSpace = SRGBColorSpace
              texture.minFilter = LinearMipmapLinearFilter
              texture.magFilter = LinearFilter
              texture.anisotropy = maxAnisotropy
              resolve(texture)
            },
            undefined,
            () => {
              console.warn(`gallery: could not load ${file}; its paintings will be blank`)
              resolve(null)
            },
          )
        }),
    ),
  )
}
