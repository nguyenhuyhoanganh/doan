import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import RegisterLayout from '../layouts/RegisterLayout'
import MainLayout from '../layouts/MainLayout'
import DashBoard from '../pages/DashBoard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'

const isAuthenticated = false

// check user is authenticated, if not then redirect to /login
function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

// prevent authenticated user from returning to the login page
function RejectedRoute() {
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
  const routeElemnts = useRoutes([
    // For routes that are not related to authentication
    // it is recommended to put it on top or add the property: 'index: true' to avoid matching path = ''
    {
      path: '',
      element: (
        <MainLayout>
          <DashBoard />
        </MainLayout>
      )
    },
    // user is authenticated
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: 'profile',
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
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: 'register',
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
