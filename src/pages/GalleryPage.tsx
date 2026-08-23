import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'

// three.js lives behind this import and is only fetched once WebGL is known to exist.
const GalleryView = lazy(() => import('../gallery/GalleryView'))

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * A museum of the archived generators. Full-bleed, outside Layout: the page is
 * the building, and a site header over a building reads as a bug.
 */
export default function GalleryPage() {
  const [supported] = useState(hasWebGL)
  if (!supported) {
    return (
      <div className="gallery gallery-unsupported">
        <p>
          The gallery needs WebGL, which this browser does not offer. The same archived
          works are all in <Link to="/artwork">the grid</Link>.
        </p>
      </div>
    )
  }
  return (
    <Suspense fallback={<div className="gallery"><p className="gallery-loading">Loading the gallery…</p></div>}>
      <GalleryView />
    </Suspense>
  )
}
