import { Link, Outlet } from 'react-router-dom'
import { REPO_URL } from '../lib/links'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">fxhash archive</Link>
        <nav>
          <Link to="/artwork">Artwork</Link>
          <Link to="/artists">Artists</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        Unofficial read-only archive viewer. Data: snapshot + TzKT + IPFS.
        {' · '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </footer>
    </>
  )
}
