import { useEffect, useState } from 'react'
import { loadSummary } from '../lib/data'
import type { Summary } from '../lib/types'

const n = (value: number) => value.toLocaleString()

export default function LandingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSummary().then(setSummary, (e) => setError(String(e)))
  }, [])

  return (
    <div className="landing">
      <h1>An archive of fxhash on Tezos</h1>
      <p className="landing-intro">
        fxhash went offline. This is an unofficial, read-only viewer for the generative
        art made there — every project, every artist, and the seed behind every piece
        ever minted. Nothing here is for sale.
      </p>

      {error && <p>Could not load archive statistics: {error}</p>}
      {summary && (
        <ul className="landing-stats">
          <li><strong>{n(summary.counts.projects)}</strong> projects</li>
          <li><strong>{n(summary.counts.artists)}</strong> artists</li>
          <li><strong>{n(summary.counts.iterations)}</strong> iterations</li>
          <li><strong>{n(summary.counts.seeds)}</strong> seeds preserved</li>
          <li><strong>{n(summary.counts.archived)}</strong> projects playable offline</li>
        </ul>
      )}
    </div>
  )
}
