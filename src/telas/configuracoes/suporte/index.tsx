import { ArrowLeft, Hand, MessageCircleQuestion } from 'lucide-react'
import '../styles.css'

function ConfiguracoesSuporte({ onBack, onAbrirDuvidas, onAbrirParticipe }) {
  return (
    <section className="configuracoes-subpagina" aria-label="Suporte">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section">
        <div className="section-heading">
          <div>
            <span>Recursos</span>
            <h2>O que deseja consultar?</h2>
          </div>
        </div>

        <div className="configuracoes__cards">
          <button className="configuracoes__card" type="button" onClick={onAbrirDuvidas}>
            <span className="configuracoes__icon" aria-hidden="true">
              <MessageCircleQuestion size={24} />
            </span>
            <span className="configuracoes__info">
              <strong>Dúvidas frequentes</strong>
              <small>Respostas rápidas sobre dados locais, backup e uso offline.</small>
            </span>
          </button>

          <button className="configuracoes__card" type="button" onClick={onAbrirParticipe}>
            <span className="configuracoes__icon" aria-hidden="true">
              <Hand size={24} />
            </span>
            <span className="configuracoes__info">
              <strong>Participe do projeto</strong>
              <small>Ideias de evolução e pontos que podem virar próximas telas.</small>
            </span>
          </button>
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesSuporte
