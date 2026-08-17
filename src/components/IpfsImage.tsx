import { useState } from 'react'
import { ipfsToHttp, GATEWAYS } from '../lib/ipfs'

interface Props { uri: string | null; alt: string; className?: string }

export default function IpfsImage({ uri, alt, className }: Props) {
  const [gateway, setGateway] = useState(0)
  const src = ipfsToHttp(uri, gateway)
  if (!src || gateway >= GATEWAYS.length) {
    return <div className={`img-fallback ${className ?? ''}`} title={alt} />
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
