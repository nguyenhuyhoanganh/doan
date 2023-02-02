import { useRoutes } from 'react-router-dom'
import RegisterLayout from '../layout/RegisterLayout'
import MainLayout from '../layout/MainLayout'
import DashBoard from '../page/DashBoard'
import Login from '../page/Login'
import Register from '../page/Register'

const useRouteElements = () => {
  const routeElemnts = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <DashBoard />
        </MainLayout>
      )
    },
    {
      path: '/login',
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
  ])
  return routeElemnts
}

export default useRouteElements
