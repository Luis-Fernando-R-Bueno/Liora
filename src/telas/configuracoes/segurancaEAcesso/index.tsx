import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react'
import '../styles.css'

function ConfiguracoesSeguranca({ onBack, onLogout }) {
  return (
    <section className="configuracoes-subpagina" aria-label="Segurança e acesso">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section">
        <div className="section-heading">
          <div>
            <span>Acesso local</span>
            <h2>Sessão do aplicativo</h2>
          </div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>

        <div className="configuracoes__conteudo">
          <p>
            Este projeto usa autenticação local simples. Ao sair, o aplicativo
            remove a sessão salva neste navegador, mas mantém seus gastos e
            categorias armazenados no dispositivo.
          </p>
        </div>

        <div className="configuracoes__acoes">
          <button className="button configuracoes__danger" type="button" onClick={onLogout}>
            <LogOut size={18} aria-hidden="true" />
            Sair do sistema
          </button>
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesSeguranca
