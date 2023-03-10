import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext } from 'react'

import { AppContext } from '../contexts/app.context'
import PATH from '../constants/paths'

// layout
import RegisterLayout from '../layouts/RegisterLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProfileLayout from '../layouts/ProfileLayout'

// page
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import SongList from '../pages/Song/List'
import SongCreate from '../pages/Song/Create'
import Analytics from '../pages/Analytics'
import ArtistList from '../pages/Artist/List'
import ArtistCreate from '../pages/Artist/Create'

// check user is authenticated, if not then redirect to /login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.auth.login} />
}

// prevent authenticated user from returning to the login page
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.dashboard.root} />
}

const useRouteElements = () => {
  const routeElemnts = useRoutes([
    // For routes that are not related to authentication
    // it is recommended to put it on top or add the property: 'index: true' to avoid matching path = ''
    {
      path: '/404',
      element: (
        <RegisterLayout>
          <div>KhongCoGi</div>
        </RegisterLayout>
      )
    },
    // user isn't authenticated
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: PATH.auth.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: PATH.auth.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    // user is authenticated
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.dashboard.root,
          element: <DashboardLayout />,
          children: [
            {
              path: '',
              element: <Navigate to={PATH.dashboard.analytics} replace />
            },
            {
              path: 'analytics',
              element: <Analytics />
            },
            {
              path: 'song',
              children: [
                { element: <Navigate to={PATH.dashboard.song.root} replace /> },
                { path: '', element: <SongList /> },
                { path: 'create', element: <SongCreate /> }
              ]
            },
            {
              path: 'artist',
              children: [
                { element: <Navigate to={PATH.dashboard.artist.root} replace /> },
                { path: '', element: <ArtistList /> },
                { path: 'create', element: <ArtistCreate /> }
              ]
            }
          ]
        },
        {
          path: PATH.profile.root,
          element: <ProfileLayout />,
          children: [
            {
              path: '',
              children: [{ element: <Navigate to={PATH.profile.root} replace /> }, { path: '', element: <Profile /> }]
            }
          ]
        }
      ]
    }
  ])
  return routeElemnts
}

export default useRouteElements
