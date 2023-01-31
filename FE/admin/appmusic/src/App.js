import './App.css'
import useRouteElements from './HOC/useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return <div>{routeElements}</div>
}

export default App
