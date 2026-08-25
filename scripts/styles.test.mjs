import { test, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const css = readFileSync('src/styles.css', 'utf8')

/** The declaration block for a selector, as written. */
function rule(selector) {
  const at = css.indexOf(selector)
  expect(at, `${selector} not found in styles.css`).toBeGreaterThanOrEqual(0)
  return css.slice(at, css.indexOf('}', at))
}

test('everything under a running artwork shares one width', () => {
  // This is the bug that shipped, and it was invisible from the code: an archived
  // piece was 640px, a streamed one filled the page, and the buttons under both
  // centred across the full 1200px content area — so they sat under nothing.
  //
  // "Centred under the artwork" only means something if these agree on how wide
  // the artwork is, and they only agree if they read the same number.
  const column = [
    '.iteration-view',
    '.iteration-img',
    '.live-frame',
    '.legacy-note',
    '.iteration-actions',
    '.archived-stage',
    '.archived-frame, .archived-blank',
    '.archived-nav',
    '.archived-caption',
  ]
  for (const selector of column) {
    expect(rule(selector), `${selector} should size itself from --artwork`).toContain(
      'var(--artwork)',
    )
  }
})

test('the width is defined once', () => {
  expect(css.match(/--artwork:/g)).toHaveLength(1)
})

test('a running piece is the same size whichever source it came from', () => {
  // Archived or streamed is our distinction, not the viewer's, and it should not
  // change the size of the art.
  for (const selector of ['.live-frame', '.archived-frame, .archived-blank']) {
    expect(rule(selector)).toContain('aspect-ratio: 1 / 1')
    expect(rule(selector)).toContain('max-width: var(--artwork)')
  }
})

// Frank: opening Rooms or About while a piece was running put the panel *behind*
// the artwork. Nothing in the gallery declared a z-index at all, so the two
// layers stacked by document order — and GalleryView renders the Viewer after
// the Hud, which is exactly backwards for a menu you are meant to reach from
// inside a piece.
test('the HUD stacks above the running artwork, so its panels are reachable', () => {
  const zOf = (selector) => {
    const m = /z-index:\s*(-?\d+)/.exec(rule(selector))
    expect(m, `${selector} declares no z-index, so it stacks by document order`).toBeTruthy()
    return Number(m[1])
  }
  const hud = zOf('.gallery-hud {')
  const viewer = zOf('.gallery-viewer {')
  expect(hud).toBeGreaterThan(viewer)
  // Both are positioned, or a z-index on them means nothing at all.
  for (const s of ['.gallery-hud {', '.gallery-viewer {']) {
    expect(rule(s)).toMatch(/position:\s*(absolute|fixed|relative)/)
  }
})
