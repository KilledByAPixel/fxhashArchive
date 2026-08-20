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
 * Preferring the explorer is deliberate, since this archive exists because a
 * marketplace switched off and the chain did not. But a link is only a link: it
 * fetches nothing, and if objkt goes the way of fxhash the cost is a dead
 * href rather than a broken page. So both are offered and the explorer goes first.
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

/** Shared by both links: open away, tell the destination nothing. */
const EXTERNAL = {
  className: 'tzkt-link',
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
    <a {...EXTERNAL} href={`${TZKT_EXPLORER}${contract}/tokens/${tokenId}`} title="View this token on tzkt.io">
      {label}
    </a>
  )
}

/**
 * The same token on the marketplace.
 *
 * What it sold for, whether it is listed, what has been offered — none of which
 * the ledger records in a readable form, and all of which a collector wants. Same
 * validation as the explorer link: nothing unchecked reaches a URL.
 */
export function ObjktLink({ contract, tokenId }: TokenProps) {
  if (!isTezosAddress(contract) || !isTokenId(tokenId)) return null
  return (
    <a {...EXTERNAL} href={`${OBJKT_MARKET}${contract}/${tokenId}`} title="View this token on objkt.com">
      objkt
    </a>
  )
}

/**
 * Both destinations for one token, with the separator only where it separates.
 *
 * Rendering the two links and a `·` between them at the call site leaves a dangling
 * bullet whenever the market link cannot be built — which is every piece on a
 * contract we could not verify, and the no-indexer view besides.
 */
export function TokenLinks({ contract, tokenId }: TokenProps) {
  const market = ObjktLink({ contract, tokenId })
  return (
    <>
      <TzktTokenLink contract={contract} tokenId={tokenId} />
      {market && <> · {market}</>}
    </>
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
    <a {...EXTERNAL} href={`${TZKT_EXPLORER}${address}`} title={address}>
      {label}
    </a>
  )
}
