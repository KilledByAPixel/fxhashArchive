import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSummary, loadAllTokens, isVisible } from '../lib/data'
import { seededShuffle } from '../lib/shuffle'
import type { LeanToken, Summary } from '../lib/types'
import TokenCard from '../components/TokenCard'

const STRIP = 8
const n = (value: number) => value.toLocaleString()

/** The curve as an SVG polyline plus one dot per sampled point. */
function ConcentrationCurve({ curve }: { curve: Summary['curve'] }) {
  // Two points are needed to span an axis; one would divide by zero below.
  if (curve.length < 2) return null

  const w = 320
  const h = 120
  // Rank position is plotted on a log scale: the interesting behaviour is all in
  // the first few percent, which a linear axis would squash into the left edge.
  const x = (p: number) => (Math.log10(p) - Math.log10(curve[0].p)) /
    (Math.log10(100) - Math.log10(curve[0].p)) * w
  const y = (share: number) => h - (share / 100) * h
  const points = curve.map((c) => `${x(c.p).toFixed(1)},${y(c.share).toFixed(1)}`).join(' ')

  return (
    <svg
      className="curve"
      data-testid="concentration-curve"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Share of collector spending held by the top-ranked projects"
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
      {curve.map((c) => (
        <circle key={c.p} cx={x(c.p)} cy={y(c.share)} r="3" fill="currentColor" />
      ))}
    </svg>
  )
}

export default function LandingPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [tokens, setTokens] = useState<LeanToken[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seed] = useState(() => Math.floor(Math.random() * 0xffffffff))

  useEffect(() => {
    loadSummary().then(setSummary, (e) => setError(String(e)))
    // The art strips are a bonus; the archive statistics are the point. A failed
    // catalog fetch must not take the whole page down with it.
    loadAllTokens().then(setTokens, () => setTokens(null))
  }, [])

  const shown = useMemo(() => (tokens ?? []).filter(isVisible), [tokens])
  const random = useMemo(() => seededShuffle(shown, seed).slice(0, STRIP), [shown, seed])
  const collected = useMemo(() => {
    if (!summary) return []
    const byId = new Map(shown.map((t) => [t.id, t]))
    return summary.ranked.map((id) => byId.get(id)).filter((t): t is LeanToken => Boolean(t)).slice(0, STRIP)
  }, [summary, shown])

  const archivedPct = summary
    ? (100 * summary.counts.archived) / summary.counts.projects
    : 0

  // The headline argument is "the top 1% accounts for most of the spending", which
  // is specifically the p:1 sample — not curve[0], which is the finest point on the
  // chart's axis (currently p:0.25) and reads as a much smaller, less compelling slice.
  const headlinePoint = summary
    ? summary.curve.find((c) => c.p === 1) ?? summary.curve[0]
    : undefined

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
          <li><strong>{n(summary.counts.projects)}</strong> projects catalogued</li>
          <li><strong>{n(summary.counts.artists)}</strong> artists</li>
          <li><strong>{n(summary.counts.iterations)}</strong> iterations</li>
          <li><strong>{n(summary.counts.seeds)}</strong> seeds preserved</li>
          <li><strong>{n(summary.counts.archived)}</strong> playable offline</li>
        </ul>
      )}

      {/* Art before charts: this is a gallery that happens to keep statistics,
          not a dashboard that happens to show pictures. */}
      {random.length > 0 && (
        <section>
          <h2>Random from the archive</h2>
          <div className="token-grid" data-testid="landing-random">
            {random.map((t) => <TokenCard key={t.id} token={t} />)}
          </div>
        </section>
      )}

      {summary && (
        <section className="landing-coverage">
          <h2>What is preserved</h2>
          <p>
            Every project's details and every iteration's seed are stored here, so any
            piece can be regenerated. Generator code is larger, so it is archived
            selectively: {n(summary.counts.archived)} projects run with
            no network at all, while the rest still depend on IPFS staying up.
          </p>
          <div className="bar" title="Share of projects playable offline">
            <div className="bar-fill" style={{ width: `${archivedPct.toFixed(2)}%` }} />
          </div>
          <p className="landing-note">
            Those projects are chosen by how much collectors engaged with them, which is
            concentrated enough that a small archive covers most of it:
          </p>
          <ConcentrationCurve curve={summary.curve} />
          {headlinePoint && (
            <p className="landing-note">
              The top {headlinePoint.p}% of projects account for {headlinePoint.share}%
              of all collector spending on the platform.
            </p>
          )}
        </section>
      )}

      {collected.length > 0 && (
        <section>
          <h2>Most collected</h2>
          <div className="token-grid" data-testid="landing-collected">
            {collected.map((t) => <TokenCard key={t.id} token={t} />)}
          </div>
          <Link to="/artwork">Browse all {n(summary?.counts.projects ?? 0)} projects →</Link>
        </section>
      )}
    </div>
  )
}
