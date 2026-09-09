import IpfsImage from './IpfsImage'
import type { Artist } from '../lib/types'

/**
 * An artist's picture.
 *
 * The stored copy first, the gateway only as a fallback — the same order TokenCard
 * uses for project thumbnails, and for the same reason: it loads from this origin,
 * which is faster while IPFS is up and the only option once it is not. fxhash's own
 * gateway was switched off on 2026-09-08 and the pins are the next thing to go.
 *
 * The file name is the artist's address, so nothing but the flag has to be stored
 * alongside; see markLocalAvatars in scripts/snapshot-lib.mjs.
 */
export default function Avatar({
  artist,
  className,
}: {
  artist: Pick<Artist, 'id' | 'name' | 'avatarUri'> & { avatar?: boolean }
  className?: string
}) {
  const alt = artist.name ?? artist.id
  if (artist.avatar) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}data/avatars/${artist.id}.webp`}
        alt={alt}
        className={className}
        loading="lazy"
      />
    )
  }
  return <IpfsImage uri={artist.avatarUri} alt={alt} className={className} />
}
