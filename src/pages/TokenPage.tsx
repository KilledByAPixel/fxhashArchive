import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findTokenBySlug } from '../lib/data'
import { fetchIterations, type Iteration } from '../lib/tzkt'
import type { LeanToken } from '../lib/types'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

const PAGE = 48

export default function TokenPage() {
  const { slug } = useParams()
  const [token, setToken] = useState<LeanToken | null | undefined>(undefined)
  const [iterations, setIterations] = useState<Iteration[] | null>(null)
  const [iterError, setIterError] = useState(false)
  const [offset, setOffset] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { findTokenBySlug(slug!).then(setToken, () => setToken(null)) }, [slug])

  useEffect(() => {
    if (!token?.generativeUri) return
    fetchIterations(token.generativeUri, offset, PAGE).then(
      (page) => {
        setIterations((prev) => [...(prev ?? []), ...page])
        if (page.length < PAGE) setDone(true)
      },
      () => setIterError(true),
    )
  }, [token, offset])

  if (token === undefined) return <p>Loading…</p>
  if (token === null) return <NotFoundPage />

  const hasGenerativeUri = !!token.generativeUri

  return (
    <div>
      <div className="token-hero">
        <IpfsImage uri={token.displayUri ?? token.thumbnailUri} alt={token.name} className="hero-img" />
        <div>
          <h2>{token.name}</h2>
          <p>
            by{' '}
            {token.author
              ? <Link to={`/artist/${token.author.id}`}>{token.author.name ?? token.author.id}</Link>
              : 'unknown'}
          </p>
          <p className="muted">
            edition of {token.supply}
            {iterations && iterations.length > 0 && ` · ${iterations.length} iterations loaded`}
          </p>
          {token.tags.length > 0 && <p className="muted">{token.tags.join(', ')}</p>}
        </div>
      </div>

      <h3>Iterations</h3>
      {iterError && <p>Iterations unavailable right now (TzKT unreachable). Try again later.</p>}
      {!iterError && !hasGenerativeUri && <p>No iterations available for this project.</p>}
      {!iterError && hasGenerativeUri && iterations === null && <p>Loading iterations…</p>}
      {iterations && (
        <>
          <div className="token-grid">
            {iterations.map((it) => (
              <Link key={`${it.contract}-${it.tokenId}`} to={`/gentk/${it.contract}/${it.tokenId}`} className="token-card">
                <IpfsImage uri={it.thumbnailUri ?? it.displayUri} alt={it.name ?? it.tokenId} className="token-thumb" />
                <div className="token-name">{it.name ?? `#${it.tokenId}`}</div>
              </Link>
            ))}
          </div>
          {!done && (
            <button className="load-more" onClick={() => setOffset((o) => o + PAGE)}>Load more</button>
          )}
        </>
      )}
    </div>
  )
}
