// Tried in order; each entry must be a *live, independent* operator, or the depth of
// this chain is a fiction. (`cloudflare-ipfs.com` used to sit here and had gone
// NXDOMAIN, so every image that failed the first two burned its last retry on a DNS
// error before showing a placeholder. `w3s.link` and `nftstorage.link` both 301 onto
// dweb.link, so they would have been the same operator as entry 2 wearing a hat.)
export const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
]

// The only known resolver for fxhash's on-chain filesystem scheme.
export const ONCHFS_GATEWAY = 'https://onchfs.fxhash2.xyz/'

// Despite the name, this resolves more than ipfs:// — it's the single boundary
// where every scheme found in fxhash metadata (ipfs:, onchfs:) gets turned into a
// fetchable URL, and anything else — javascript:, data:, an unrecognised scheme, or
// a bare http(s) URL — is rejected rather than passed through, since these values
// can end up as an <iframe src> and NFT metadata is attacker-influenceable.
//
// http(s) is deliberately *not* allowed: no real record uses it (snapshot image and
// code URIs are 100% ipfs://, on-chain artifactUri is ipfs:// or onchfs://), so the
// branch could only ever have served a hostile URL.
export function ipfsToHttp(uri: string | null | undefined, gatewayIndex = 0): string | null {
  if (!uri) return null

  if (uri.startsWith('ipfs://')) {
    const i = Math.min(gatewayIndex, GATEWAYS.length - 1)
    return GATEWAYS[i] + uri.slice('ipfs://'.length)
  }

  if (uri.startsWith('onchfs://')) {
    // Only one known resolver exists, so any retry beyond it signals exhaustion.
    if (gatewayIndex > 0) return null
    return ONCHFS_GATEWAY + uri.slice('onchfs://'.length)
  }

  return null
}
