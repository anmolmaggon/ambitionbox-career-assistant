import { useEffect, useState } from 'react'
import { DemoLauncher } from './screens/DemoLauncher'
import { TodayScreen } from './screens/TodayScreen'
import { ApplicationsScreen } from './screens/ApplicationsScreen'
import { ApplicationScreen } from './screens/ApplicationScreen'
import { ProfileScreen } from './screens/ProfileScreen'

function useLocation() {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, search: window.location.search }))
  useEffect(() => {
    const onChange = () => setLocation({ pathname: window.location.pathname, search: window.location.search })
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])
  return location
}

function App() {
  const { pathname } = useLocation()
  const routes = {
    '/': DemoLauncher,
    '/demo': DemoLauncher,
    '/today': TodayScreen,
    '/applications': ApplicationsScreen,
    '/applications/juspay': ApplicationScreen,
    '/profile': ProfileScreen,
  }
  const Component = routes[pathname] || DemoLauncher
  return <Component />
}

export default App
