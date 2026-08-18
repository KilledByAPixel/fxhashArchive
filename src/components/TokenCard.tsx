import { Link } from 'react-router-dom'
import IpfsImage from './IpfsImage'
import type { LeanToken } from '../lib/types'

export default function TokenCard({
  token,
  archived = false,
}: {
  token: LeanToken
  archived?: boolean
}) {
  return (
    <Link to={`/token/${token.slug}`} className="token-card">
      <IpfsImage uri={token.thumbnailUri} alt={token.name} className="token-thumb" />
      {/* "Fully archived", not "Offline" — the bare word is what a server says when
          it is down, so it read as a warning about the artwork rather than a
          guarantee about it. "Fully" is also the honest qualifier: every project here
          has its metadata and seeds kept, and these are the ones whose generator code
          is kept too. */}
      {archived && (
        <span
          className="token-badge"
          title="Fully archived — this project's generator code is stored here, so it needs no network at all"
        >
          Fully archived
        </span>
      )}
      <div className="token-name">{token.name}</div>
      <div className="token-author">{token.author?.name ?? token.author?.id ?? 'unknown'}</div>
    </Link>
  )
}
