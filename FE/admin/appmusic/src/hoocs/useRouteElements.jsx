import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext } from 'react'

import { AuthContext } from '../contexts/auth.context'
import PATH from '../constants/paths'

// layout
import RegisterLayout from '../layouts/RegisterLayout'
import DashboardLayout from '../layouts/DashboardLayout'
// import ProfileLayout from '../layouts/ProfileLayout'

// page
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import SongList from '../pages/Song/List'
import SongCreate from '../pages/Song/Create'
import Analytics from '../pages/Analytics'
import ArtistList from '../pages/Artist/List'
import ArtistCreate from '../pages/Artist/Create'
import { AudioProvider } from '../contexts/audio.context'
import SongEdit from '../pages/Song/Edit'
import AlbumList from '../pages/Album/List'
import ComposerList from '../pages/Composer/List'
import CategoryList from '../pages/Category/List'
import ArtistEdit from '../pages/Artist/Edit'
import ComposerCreate from '../pages/Composer/Create'
import ComposerEdit from '../pages/Composer/Edit'
import AlbumCreate from '../pages/Album/Create'
import AlbumEdit from '../pages/Album/Edit'
import UserList from '../pages/User/List'
import UserEdit from '../pages/User/Edit'

// check user is authenticated, if not then redirect to /login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.auth.login} />
}

// prevent authenticated user from returning to the login page
function RejectedRoute() {
  const { isAuthenticated } = useContext(AuthContext)
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
          <div>404 Not Found</div>
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
              element: (
                <AudioProvider>
                  <Analytics />
                </AudioProvider>
              )
            },
            {
              path: 'user',
              children: [
                { element: <Navigate to={PATH.dashboard.user.root} replace /> },
                {
                  path: '',
                  element: (
                    <AudioProvider>
                      <UserList />
                    </AudioProvider>
                  )
                },
                { path: 'modify/:slug/:id', element: <UserEdit /> }
              ]
            },
            {
              path: 'song',
              children: [
                { element: <Navigate to={PATH.dashboard.song.root} replace /> },
                {
                  path: '',
                  element: (
                    <AudioProvider>
                      <SongList />
                    </AudioProvider>
                  )
                },
                { path: 'create', element: <SongCreate /> },
                { path: 'modify/:slug/:id', element: <SongEdit /> }
              ]
            },
            {
              path: 'artist',
              children: [
                { element: <Navigate to={PATH.dashboard.artist.root} replace /> },
                { path: '', element: <ArtistList /> },
                { path: 'create', element: <ArtistCreate /> },
                { path: 'modify/:slug/:id', element: <ArtistEdit /> }
              ]
            },
            {
              path: 'album',
              children: [
                { element: <Navigate to={PATH.dashboard.album.root} replace /> },
                { path: '', element: <AlbumList /> },
                { path: 'create', element: <AlbumCreate /> },
                { path: 'modify/:slug/:id', element: <AlbumEdit /> }
              ]
            },
            {
              path: 'composer',
              children: [
                { element: <Navigate to={PATH.dashboard.composer.root} replace /> },
                { path: '', element: <ComposerList /> },
                { path: 'create', element: <ComposerCreate /> },
                { path: 'modify/:slug/:id', element: <ComposerEdit /> }
              ]
            },
            {
              path: 'category',
              children: [
                { element: <Navigate to={PATH.dashboard.category.root} replace /> },
                { path: '', element: <CategoryList /> }
              ]
            }
          ]
        },
        {
          path: PATH.profile.root,
          element: <DashboardLayout />,
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
