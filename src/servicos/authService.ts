const LOGIN_SESSION_KEY = 'controle-gastos:login-session'
const LOCAL_CREDENTIALS = {
  username: 'luis.bueno',
  password: 'rodrigues.bueno',
}

export function loadLoginSession() {
  try {
    const storedSession = localStorage.getItem(LOGIN_SESSION_KEY)

    return storedSession ? JSON.parse(storedSession) : null
  } catch {
    localStorage.removeItem(LOGIN_SESSION_KEY)
    return null
  }
}

export function validateLogin({ username, password }) {
  const credentialsAreValid =
    username.trim() === LOCAL_CREDENTIALS.username &&
    password === LOCAL_CREDENTIALS.password

  if (!credentialsAreValid) {
    return null
  }

  const session = {
    username: LOCAL_CREDENTIALS.username,
    loggedAt: new Date().toISOString(),
  }

  localStorage.setItem(LOGIN_SESSION_KEY, JSON.stringify(session))

  return session
}

export function clearLoginSession() {
  localStorage.removeItem(LOGIN_SESSION_KEY)
}
