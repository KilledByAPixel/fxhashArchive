import { useEffect, useState } from 'react'
import { ipfsToHttp, GATEWAYS } from '../lib/ipfs'

interface Props { uri: string | null; alt: string; className?: string }

export default function IpfsImage({ uri, alt, className }: Props) {
  const [gateway, setGateway] = useState(0)

  // React keeps this component mounted across param-only navigations (project hero,
  // iteration image, artist avatar), so the failover position must follow the uri.
  // Otherwise the previous image's failures are inherited: at best the healthy primary
  // gateway is skipped, at worst an exhausted chain leaves the *next* image showing a
  // permanent placeholder. Done here rather than with key={uri} at each call site, so
  // it covers all of them and cannot be forgotten by the next caller.
  useEffect(() => { setGateway(0) }, [uri])

  const src = ipfsToHttp(uri, gateway)
  if (!src || gateway >= GATEWAYS.length) {
    // Say which of the two it is. "No image recorded" is a fact about the artwork;
    // "every gateway failed" is a fact about the network, and a blank tile that
    // could mean either leaves a visitor unable to tell a missing piece from an
    // unreachable one — which matters most when IPFS is exactly what has gone away.
    const reason = uri ? 'Image unavailable — IPFS unreachable' : 'No image recorded'
    // Deliberately not role="img": the tests use the absence of an img role to prove
    // that a rejected uri (a javascript: one, say) never reaches an <img> tag at all,
    // and that check is worth more than the label. The visible text is read anyway.
    return (
      <div className={`img-fallback ${className ?? ''}`} title={`${alt}: ${reason}`}>
        <span>{reason}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setGateway((g) => g + 1)}
    />
  )
}
