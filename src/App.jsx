import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  clearLoginSession,
  loadLoginSession,
  validateLogin,
} from './servicos/authService'
import Inicial from './telas/inicial'
import Login from './telas/login'

const LOGIN_ROUTE = '/login'
const PANEL_ROUTE = '/painel'

function App() {
  const [session, setSession] = useState(loadLoginSession)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session && location.pathname !== LOGIN_ROUTE) {
      navigate(LOGIN_ROUTE, { replace: true })
      return
    }

    if (session && location.pathname === LOGIN_ROUTE) {
      navigate(PANEL_ROUTE, { replace: true })
    }
  }, [location.pathname, navigate, session])

  function handleLogin(credentials) {
    const nextSession = validateLogin(credentials)

    if (!nextSession) {
      return false
    }

    setSession(nextSession)
    navigate(PANEL_ROUTE, { replace: true })
    return true
  }

  function handleLogout() {
    clearLoginSession()
    setSession(null)
    navigate(LOGIN_ROUTE, { replace: true })
  }

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  return <Inicial session={session} onLogout={handleLogout} />
}

export default App
