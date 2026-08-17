import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchIteration, type Iteration } from '../lib/tzkt'
import { ipfsToHttp } from '../lib/ipfs'
import IpfsImage from '../components/IpfsImage'
import LoadError from '../components/LoadError'
import NotFoundPage from './NotFoundPage'

/** As on TokenPage/ArtistPage: a failed load must not masquerade as "no such iteration". */
type IterationState =
  | { status: 'loading' }
  | { status: 'ok'; iteration: Iteration }
  | { status: 'notfound' }
  | { status: 'error' }

export default function IterationPage() {
  const { contract, tokenId } = useParams()
  const [state, setState] = useState<IterationState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Reset per-iteration state synchronously so navigating between two iterations
    // while this page stays mounted can't leave the previous one's content or the
    // "live" toggle visible while the new one loads.
    setState({ status: 'loading' })
    setLive(false)
    fetchIteration(contract!, tokenId!).then(
      (result) => { if (!cancelled) setState(result ? { status: 'ok', iteration: result } : { status: 'notfound' }) },
      // A rejected fetch says nothing about whether the iteration exists.
      () => { if (!cancelled) setState({ status: 'error' }) },
    )
    return () => { cancelled = true }
  }, [contract, tokenId, attempt])

  if (state.status === 'loading') return <p>Loading…</p>
  if (state.status === 'notfound') return <NotFoundPage />
  if (state.status === 'error') {
    return <LoadError what="this iteration" onRetry={() => setAttempt((a) => a + 1)} />
  }

  const it = state.iteration

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
