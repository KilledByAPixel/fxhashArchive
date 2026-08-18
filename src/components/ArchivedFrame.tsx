/**
 * One archived generator, running from this repository.
 *
 * Shared by the project page's player and the iteration page so both build the
 * same URL and carry the same sandbox — the two places a visitor can run
 * preserved art, and the only places on the site that touch neither IPFS nor
 * Tezos.
 */

/** Every archived generator unpacks with this entry point; see scripts/archive-generators.mjs. */
const ENTRY = 'index.html'

export function archivedSrc(projectId: number, seed: string) {
  return `${import.meta.env.BASE_URL}data/generators/${projectId}/${ENTRY}?fxhash=${encodeURIComponent(seed)}`
}

export default function ArchivedFrame({
  projectId,
  seed,
  label,
}: {
  projectId: number
  seed: string
  label: string
}) {
  const src = archivedSrc(projectId, seed)
  return (
    <iframe
      key={src}
      className="archived-frame"
      src={src}
      title={`Archived generator for ${label}`}
      // Scripts yes, same-origin never. These generators are served from our own
      // origin rather than a gateway, which makes withholding allow-same-origin
      // matter more here than it did when they were remote.
      sandbox="allow-scripts"
    />
  )
}
