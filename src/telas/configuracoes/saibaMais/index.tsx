import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
import '../styles.css'

function ConfiguracoesSaibaMais({ onBack, onAbrirQuemSomos, onAbrirTermos }) {
  return (
    <section className="configuracoes-subpagina" aria-label="Saiba mais">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section">
        <div className="section-heading">
          <div>
            <span>Informações</span>
            <h2>Conheça o projeto</h2>
          </div>
        </div>

        <div className="configuracoes__cards">
          <button className="configuracoes__card" type="button" onClick={onAbrirQuemSomos}>
            <span className="configuracoes__icon" aria-hidden="true">
              <Sparkles size={24} />
            </span>
            <span className="configuracoes__info">
              <strong>Quem somos</strong>
              <small>Origem e propósito da Liora.</small>
            </span>
          </button>

          <button className="configuracoes__card" type="button" onClick={onAbrirTermos}>
            <span className="configuracoes__icon" aria-hidden="true">
              <FileText size={24} />
            </span>
            <span className="configuracoes__info">
              <strong>Termos de uso e privacidade</strong>
              <small>Como o app local trata seus registros e backups.</small>
            </span>
          </button>
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesSaibaMais
