import { Link } from 'react-router-dom'
import IpfsImage from './IpfsImage'
import type { CardToken } from '../lib/types'

export default function TokenCard({
  token,
  archived = false,
  localThumb,
  authorLabel,
}: {
  token: CardToken
  archived?: boolean
  /** Filename under `data/thumbs/`, when this project's preview is stored here. */
  localThumb?: string
  /**
   * Overrides the recorded author. Used for the 553 collaborations, whose author
   * field holds the KT1 contract they minted through rather than a person — a card
   * reading "KT1EDDWGi1ZD…" credits nobody.
   */
  authorLabel?: string
}) {
  return (
    <Link to={`/token/${token.slug}`} className="token-card">
      {/* A stored preview is preferred over the IPFS one wherever we have it: it
          is the same image, but it loads from this origin, which is faster while
          IPFS is up and the only option once it is not. */}
      {localThumb ? (
        <img
          src={`${import.meta.env.BASE_URL}data/thumbs/${localThumb}`}
          alt={token.name}
          className="token-thumb"
          loading="lazy"
        />
      ) : (
        <IpfsImage uri={token.thumbnailUri} alt={token.name} className="token-thumb" />
      )}
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
      <div className="token-author">{authorLabel ?? token.author?.name ?? token.author?.id ?? 'unknown'}</div>
    </Link>
  )
}
