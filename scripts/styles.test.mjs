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
