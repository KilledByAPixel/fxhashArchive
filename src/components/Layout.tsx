import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">fxhash viewer</Link>
        <nav>
          <Link to="/artwork">Artwork</Link>
          <Link to="/artists">Artists</Link>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        Unofficial read-only archive viewer. Data: snapshot + TzKT + IPFS.
        {' · '}
        <a
          href="https://github.com/KilledByAPixel/fxhashViewer"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </footer>
    </>
  )
}
