/**
 * A Tezos address, linked to the chain.
 *
 * The viewer holds a copy of the art; the chain holds what happened to it. This is
 * the one door between the two, so a visitor who wants to check a claim — who
 * minted this, who owns it now, is that really the artist's address — can go and
 * read the ledger rather than take this site's word for it.
 *
 * tzkt.io rather than a marketplace: it is the same operator as the API this
 * already depends on, so it adds nobody new to trust, and it answers "what is this
 * address" instead of "what is it worth".
 */

import { shortAddress } from './Byline'

const TZKT_EXPLORER = 'https://tzkt.io/'

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
    <a
      className="tzkt-link"
      href={`${TZKT_EXPLORER}${address}`}
      target="_blank"
      // noreferrer as well as noopener: which piece someone is looking at is
      // theirs to share, not ours to announce to a third party.
      rel="noopener noreferrer"
      title={address}
    >
      {label}
    </a>
  )
}
