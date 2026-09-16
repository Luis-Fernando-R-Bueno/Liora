import { Component, type ErrorInfo, type ReactNode } from 'react'
import './styles.css'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

// Rede de segurança para toda a árvore de componentes: sem isso, qualquer
// exceção não tratada (ex.: falha ao salvar no localStorage, dado
// corrompido) derruba o React e deixa o usuário com uma tela em branco,
// sem nenhuma explicação nem forma de continuar.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro inesperado na aplicação:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <h1>Ocorreu um erro inesperado</h1>
            <p>
              Seus dados continuam salvos neste navegador. Recarregue a página para
              continuar usando o Liora.
            </p>
            <button className="button button--primary" type="button" onClick={this.handleReload}>
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
