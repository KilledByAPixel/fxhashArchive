import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div>
      <h2>Not found</h2>
      <p>That page doesn't exist. <Link to="/artwork">Back to browsing</Link>.</p>
    </div>
  )
}
