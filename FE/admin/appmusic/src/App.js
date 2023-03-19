import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from './contexts/auth.context'

import useRouteElements from './hoocs/useRouteElements'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AuthContext)
  // listen event from LocalStorageEventTarget dispatch in method clearLocalStorage()
  // reset, clear AuthContext
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clear-local-strorage', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clear-local-strorage', reset)
    }
  }, [reset])
  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
