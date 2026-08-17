export const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
]

// The only known resolver for fxhash's on-chain filesystem scheme.
export const ONCHFS_GATEWAY = 'https://onchfs.fxhash2.xyz/'

// Despite the name, this resolves more than ipfs:// — it's the single boundary
// where every scheme found in fxhash metadata (ipfs:, onchfs:, http(s):) gets
// turned into a fetchable URL, and anything else (javascript:, data:, or an
// unrecognised scheme) is rejected rather than passed through, since these
// values can end up as an <iframe src> and NFT metadata is attacker-influenceable.
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

  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri

  return null
}
