import { ArrowLeft, Hand } from 'lucide-react'
import '../../styles.css'

function ConfiguracoesParticipeDoProjeto({ onBack }) {
  return (
    <section className="configuracoes-subpagina" aria-label="Participe do projeto">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section">
        <div className="section-heading">
          <div>
            <span>Evolução</span>
            <h2>Próximas melhorias possíveis</h2>
          </div>
          <Hand size={20} aria-hidden="true" />
        </div>

        <div className="configuracoes__conteudo">
          <p>
            Como este projeto é pessoal, esta tela funciona como referência para priorizar
            melhorias sem depender de um canal externo.
          </p>
          <ul>
            <li>Relatórios por período personalizado.</li>
            <li>Metas mensais por categoria.</li>
            <li>Gráficos comparando meses.</li>
            <li>Exportação em CSV além do backup JSON.</li>
            <li>Sincronização futura com API própria, se fizer sentido.</li>
          </ul>
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesParticipeDoProjeto
