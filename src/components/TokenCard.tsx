import { Link } from 'react-router-dom'
import IpfsImage from './IpfsImage'
import type { LeanToken } from '../lib/types'

export default function TokenCard({ token }: { token: LeanToken }) {
  return (
    <Link to={`/token/${token.slug}`} className="token-card">
      <IpfsImage uri={token.thumbnailUri} alt={token.name} className="token-thumb" />
      <div className="token-name">{token.name}</div>
      <div className="token-author">{token.author?.name ?? token.author?.id ?? 'unknown'}</div>
    </Link>
  )
}
