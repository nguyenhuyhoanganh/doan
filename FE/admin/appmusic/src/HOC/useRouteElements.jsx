import { useRoutes } from 'react-router-dom'
import RegisterLayout from '../layout/RegisterLayout'
import DashBoard from '../page/DashBoard'
import Login from '../page/Login'
import Register from '../page/Register'

const useRouteElements = () => {
  const routeElemnts = useRoutes([
    { path: '/', element: <DashBoard /> },
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
