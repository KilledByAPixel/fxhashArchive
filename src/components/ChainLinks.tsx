/**
 * Links out to the chain, and to the market that trades on it.
 *
 * The viewer holds a copy of the art; the chain holds what happened to it. This is
 * the one door between the two, so a visitor who wants to check a claim — who
 * minted this, who owns it now, is that really the artist's address — can go and
 * read the ledger rather than take this site's word for it.
 *
 * Two destinations, because they answer different questions. tzkt.io is a block
 * explorer — it reads the ledger, so it says what a thing *is*: the metadata as
 * stored on chain, every transfer, who holds it. objkt.com is a marketplace — it
 * says what a thing is *worth*: listings, offers, what it last sold for.
 *
 * They are placed by how often they are wanted, not by preference. The explorer
 * links sit inline in the facts table, where somebody checking a claim will look.
 * The market link is a button beside "Run artwork", because a collector arriving
 * at a piece wants it immediately and should not have to read a table to find it.
 *
 * Preferring the explorer as a *source* is still deliberate — this archive exists
 * because a marketplace switched off and the chain did not — but a link is only a
 * link: it fetches nothing, and if objkt goes the way of fxhash the cost is a dead
 * href rather than a broken page.
 */

import { shortAddress } from './Byline'

const TZKT_EXPLORER = 'https://tzkt.io/'
const OBJKT_MARKET = 'https://objkt.com/tokens/'

/**
 * Whether a string is really a Tezos address.
 *
 * `tz1`/`tz2`/`tz3` implicit accounts and `KT1` originated contracts, followed by
 * 33 base58 characters — the alphabet excludes `0`, `O`, `I` and `l` precisely so a
 * mistyped address cannot be read two ways.
 *
 * This gate exists because everything on an iteration page ultimately comes from
 * chain metadata, which anyone can write, on a page that also executes untrusted
 * art. The same reasoning already keeps unrecognised schemes out of an iframe src
 * (see ipfsToHttp); an address that does not look like one gets no link at all.
 */
export function isTezosAddress(value: string): boolean {
  return /^(tz[1-3]|KT1)[1-9A-HJ-NP-Za-km-z]{33}$/.test(value)
}

/**
 * A token id, which is a decimal integer and nothing else.
 *
 * Named rather than inlined so both links check it the same way: it lands in a URL
 * path segment, where `../..` would climb out of the token page entirely.
 */
export function isTokenId(value: string): boolean {
  return /^[0-9]+$/.test(value)
}

/** Shared by every outbound link: open away, tell the destination nothing. */
const EXTERNAL = {
  target: '_blank',
  // noreferrer as well as noopener: which piece someone is looking at is theirs to
  // share, not ours to announce to a third party.
  rel: 'noopener noreferrer',
} as const

interface TokenProps {
  contract: string
  tokenId: string
}

/**
 * The piece itself on the explorer.
 *
 * A step beyond naming its owner: this is the token's own page — the metadata as
 * stored on chain, and every transfer it has ever had. It answers *how* a piece
 * reached the owner listed above it, which is the question the owner alone raises.
 *
 * Both parts are validated before either reaches the URL. The contract comes from
 * a route parameter and the token id from chain metadata, and neither is ours.
 */
export function TzktTokenLink({ contract, tokenId }: TokenProps) {
  const label = `#${tokenId}`
  if (!isTezosAddress(contract) || !isTokenId(tokenId)) return <>{label}</>
  return (
    <a {...EXTERNAL} className="tzkt-link" href={`${TZKT_EXPLORER}${contract}/tokens/${tokenId}`} title="View this token on tzkt.io">
      {label}
    </a>
  )
}

/**
 * The same token on the marketplace, as a button.
 *
 * What it sold for, whether it is listed, what has been offered — none of which
 * the ledger records in a readable form, and all of which is the first thing a
 * collector wants. It began life as small print in the facts table, which put the
 * most-wanted link in the least-looked-at place.
 *
 * An anchor rather than a button element, because it navigates: middle-click,
 * copy-link and open-in-new-tab all have to keep working. It only looks like a
 * button.
 *
 * Same validation as the explorer link — nothing unchecked reaches a URL — and
 * nothing at all when it cannot be built, since a dead button is worse than none.
 */
export function ObjktButton({ contract, tokenId }: TokenProps) {
  if (!isTezosAddress(contract) || !isTokenId(tokenId)) return null
  return (
    <a
      {...EXTERNAL}
      className="load-more objkt-button"
      href={`${OBJKT_MARKET}${contract}/${tokenId}`}
      title="Listings and sale history on objkt.com"
    >
      View on objkt
    </a>
  )
}

interface Props {
  address: string
  /** A name TzKT has on file. Display only — it never reaches the URL. */
  alias?: string | null
}

export default function TzktLink({ address, alias }: Props) {
  const label = alias ?? (isTezosAddress(address) ? shortAddress(address) : address)

  // Not a link rather than a broken one: a visitor following an explorer link
  // expects the explorer, and this is the only place a hostile value could turn
  // into a destination.
  if (!isTezosAddress(address)) return <>{label}</>

  return (
    <a {...EXTERNAL} className="tzkt-link" href={`${TZKT_EXPLORER}${address}`} title={address}>
      {label}
    </a>
  )
}
