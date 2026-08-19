import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import type { Collaborator } from '../lib/data'

/**
 * Who made a project.
 *
 * Most projects have one artist and this is a link. The 553 collaborations do not:
 * their catalog author is the KT1 contract the work was minted through, which named
 * nobody and linked nowhere. Those now list the actual people, recovered from the
 * contract's on-chain storage.
 */

/** `tz1aFiCb…Gn2b` — long enough to be checkable, short enough to read. */
export const shortAddress = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`

/**
 * A collaboration's credit as one line of plain text, for grid cards.
 *
 * Cards have room for one name, and a four-way collaboration would otherwise wrap
 * into the thumbnail below it — so past two people it summarises. The full credit
 * is on the project page.
 */
export function bylineLabel(collaborators: Collaborator[]): string {
  const names = collaborators.map((c) => c.name ?? shortAddress(c.id))
  if (names.length === 0) return 'unknown'
  if (names.length <= 2) return names.join(' and ')
  return `${names[0]} and ${names.length - 1} others`
}

function Person({ id, name }: { id: string; name: string | null }) {
  // Everyone gets a link: an artist page keyed on the address works whether or not
  // a name was ever registered, and it is the only place their other work is listed.
  return <Link to={`/artist/${id}`}>{name ?? shortAddress(id)}</Link>
}

export default function Byline({
  author,
  collaborators,
}: {
  author: { id: string; name: string | null } | null
  /** Set only for collaborations; overrides the contract in `author`. */
  collaborators?: Collaborator[] | null
}) {
  if (collaborators?.length) {
    return (
      <>
        by{' '}
        {collaborators.map((c, i) => (
          <Fragment key={c.id}>
            {/* Oxford-less on purpose: "A, B and C" reads as a credit, and these are
                credits. Order is by revenue share, which is the closest thing on
                chain to who led the work. */}
            {i > 0 && (i === collaborators.length - 1 ? ' and ' : ', ')}
            <Person id={c.id} name={c.name} />
          </Fragment>
        ))}
        {' '}
        <span className="muted">· collaboration</span>
      </>
    )
  }
  if (!author) return <>by unknown</>
  return (
    <>
      by <Person id={author.id} name={author.name} />
    </>
  )
}
