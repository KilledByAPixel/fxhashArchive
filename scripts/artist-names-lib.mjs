/**
 * Apply accepted display-name changes to the committed catalog.
 *
 * An artist's name is stored wherever the site needs to print it: on their row in
 * artists/index.json, on `author` in every token shard that holds one of their
 * projects, and on each `collaborators` entry recovered from a collaboration
 * contract. All three are the same fact repeated, so a rename has to reach all
 * three or the site will disagree with itself.
 *
 * The rule is deliberately narrow: rewrite `name` on any object whose `id` is an
 * address the caller named, and only where a `name` already exists. Project ids are
 * numbers and these keys are tz/KT1 addresses, so a project that happens to share an
 * artist's name is never touched, and a record that carries an id without a display
 * name — a `byArtist` credit, a contract — is left the shape its readers expect.
 */
export function renameById(value, names) {
  let changed = 0
  const walk = (node) => {
    if (Array.isArray(node)) { for (const item of node) walk(item); return }
    if (!node || typeof node !== 'object') return
    if (typeof node.id === 'string' && 'name' in node) {
      const wanted = names[node.id]
      if (wanted !== undefined && node.name !== wanted) { node.name = wanted; changed += 1 }
    }
    for (const child of Object.values(node)) walk(child)
  }
  walk(value)
  return changed
}
