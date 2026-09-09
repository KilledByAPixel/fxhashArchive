// Tried in order; each entry must be a *live, independent* operator, or the depth of
// this chain is a fiction. (`cloudflare-ipfs.com` used to sit here and had gone
// NXDOMAIN, so every image that failed the first two burned its last retry on a DNS
// error before showing a placeholder. `w3s.link` and `nftstorage.link` both 301 onto
// dweb.link, so they would have been the same operator as entry 2 wearing a hat.)
//
// "Live" has to mean live *to a browser*. The previous three entries — ipfs.io,
// dweb.link and gateway.pinata.cloud — all answer curl with a cheerful 200 and answer
// a real browser with a Cloudflare challenge: 403, plus `X-Frame-Options: SAMEORIGIN`
// on the challenge page itself. An <img> can limp along on a clearance cookie and
// falls back to a placeholder when it cannot; an <iframe> just says "refused to
// connect", which is what running a live artwork had started doing for everyone. The
// scripts never saw it because Node is not browser-shaped. `npm run check:gateways`
// probes them the way a browser would; run it whenever the live view looks broken.
//
// Caveat kept honest: entries 1 and 3 both report `server: Filebase`, so they are one
// operator serving two pinsets, not two operators. Entry 2 is genuinely separate.
// Verified 2026-09-08 over six real CIDs with a browser's headers: both return
// byte-identical content, `access-control-allow-origin: *`, no X-Frame-Options, and
// support `?format=tar` for the archiver. Re-check with `npm run check:gateways`.
//
// gateway.fxhash.xyz was here, and first, as the one place every CID in this catalog
// was definitely pinned. On 2026-09-08 it began answering *every* request with 403
// and "This gateway is currently unavailable. Please contact the gateway owner." —
// Filebase's message for a dedicated gateway that has been switched off. fxhash shut
// down in 2024 and this had outlived it; now it has not. Nothing was lost: the same
// CIDs come back byte-identical from both gateways below, so the content is still
// pinned and only fxhash's door onto it closed.
export const GATEWAYS = [
  'https://gateway.pinit.io/ipfs/',
  'https://ipfs.raribleuserdata.com/ipfs/',
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
