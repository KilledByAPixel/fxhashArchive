import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchIteration, type Iteration } from '../lib/tzkt'
import { ipfsToHttp } from '../lib/ipfs'
import IpfsImage from '../components/IpfsImage'
import NotFoundPage from './NotFoundPage'

export default function IterationPage() {
  const { contract, tokenId } = useParams()
  const [it, setIt] = useState<Iteration | null | undefined>(undefined)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Reset per-iteration state synchronously so navigating between two iterations
    // while this page stays mounted can't leave the previous one's content or the
    // "live" toggle visible while the new one loads.
    setIt(undefined)
    setLive(false)
    fetchIteration(contract!, tokenId!).then(
      (result) => { if (!cancelled) setIt(result) },
      () => { if (!cancelled) setIt(null) },
    )
    return () => { cancelled = true }
  }, [contract, tokenId])

  if (it === undefined) return <p>Loading…</p>
  if (it === null) return <NotFoundPage />

  const liveSrc = ipfsToHttp(it.artifactUri)

  return (
    <div>
      <h2>{it.name ?? `#${it.tokenId}`}</h2>
      <div className="iteration-view">
        {live && liveSrc
          ? <iframe src={liveSrc} sandbox="allow-scripts" className="live-frame" title={it.name ?? 'artwork'} />
          : <IpfsImage uri={it.displayUri ?? it.thumbnailUri} alt={it.name ?? 'artwork'} className="iteration-img" />}
      </div>
      {liveSrc && (
        <button className="load-more" onClick={() => setLive((v) => !v)}>
          {live ? 'Show image' : 'Run live'}
        </button>
      )}
      <dl className="iteration-meta">
        <dt>Hash</dt><dd><code>{it.iterationHash ?? 'unknown'}</code></dd>
        <dt>Minted by</dt><dd>{it.minter ?? 'unknown'}</dd>
        {it.attributes.map((a) => (
          <Fragment key={a.name}>
            <dt>{a.name}</dt><dd>{String(a.value)}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  )
}
