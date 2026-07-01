import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useState } from 'react'
import './styles.css'

const INITIAL_FORM = {
  username: '',
  password: '',
}

function Login({ onLogin }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function updateField(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
    setErrorMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const loggedIn = onLogin(formData)

    if (!loggedIn) {
      setErrorMessage('Usuário ou senha inválidos.')
      return
    }

    setFormData(INITIAL_FORM)
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__header">
          <div className="login-card__brand">
            <img src="/logo.svg" alt="" aria-hidden="true" />
            <span>Liora</span>
          </div>
          <h1>Entrar com clareza</h1>
          <p>Um espaço leve para entender para onde seu dinheiro está indo.</p>
        </div>

        {errorMessage ? (
          <p className="login-card__error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <label>
          <span>Usuário</span>
          <div className="login-card__field">
            <UserRound size={18} aria-hidden="true" />
            <input
              type="text"
              value={formData.username}
              onChange={(event) => updateField('username', event.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
        </label>

        <label>
          <span>Senha</span>
          <div className="login-card__field">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              autoComplete="current-password"
            />
            <button
              className="login-card__toggle-password"
              type="button"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </label>

        <button className="button button--primary" type="submit">
          Entrar
        </button>
      </form>
    </main>
  )
}

export default Login
