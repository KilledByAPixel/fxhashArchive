import { createHashRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import BrowsePage from './pages/BrowsePage'
import TokenPage from './pages/TokenPage'
import IterationPage from './pages/IterationPage'
import ArtistsPage from './pages/ArtistsPage'
import ArtistPage from './pages/ArtistPage'
import NotFoundPage from './pages/NotFoundPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/artwork', element: <BrowsePage /> },
      { path: '/token/:slug', element: <TokenPage /> },
      { path: '/gentk/:contract/:tokenId', element: <IterationPage /> },
      { path: '/artists', element: <ArtistsPage /> },
      { path: '/artist/:id', element: <ArtistPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

const router = createHashRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}
