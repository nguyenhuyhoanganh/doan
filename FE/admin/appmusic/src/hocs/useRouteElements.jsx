import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import RegisterLayout from '../layouts/RegisterLayout'
import MainLayout from '../layouts/MainLayout'
import DashBoard from '../pages/DashBoard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import { useContext } from 'react'
import { AppContext } from '../contexts/app.context'
import path from './../constants/path'

// check user is authenticated, if not then redirect to /login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

// prevent authenticated user from returning to the login page
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.dashBoard} />
}

const useRouteElements = () => {
  const routeElemnts = useRoutes([
    // For routes that are not related to authentication
    // it is recommended to put it on top or add the property: 'index: true' to avoid matching path = ''
    {
      path: '/khongcogi',
      element: (
        <RegisterLayout>
          <div>KhongCoGi</div>
        </RegisterLayout>
      )
    },
    // user is authenticated
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.dashBoard,
          element: (
            <MainLayout>
              <DashBoard />
            </MainLayout>
          )
        },
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    // user isn't authenticated
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routeElemnts
}

export default useRouteElements
