export const GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
]

export function ipfsToHttp(uri: string | null | undefined, gatewayIndex = 0): string | null {
  if (!uri) return null
  if (!uri.startsWith('ipfs://')) return uri
  const i = Math.min(gatewayIndex, GATEWAYS.length - 1)
  return GATEWAYS[i] + uri.slice('ipfs://'.length)
}
