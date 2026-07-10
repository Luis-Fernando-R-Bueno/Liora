import { Info, LifeBuoy, LockKeyhole, Save, Tags, UserRound } from 'lucide-react'
import './styles.css'

const OPTIONS = [
  {
    id: 'perfil',
    title: 'Perfil',
    description: 'Dados do acesso local usado neste dispositivo.',
    Icon: UserRound,
  },
  {
    id: 'categorias',
    title: 'Categorias',
    description: 'Criar, editar, inativar ou remover categorias de gastos.',
    Icon: Tags,
  },
  {
    id: 'seguranca',
    title: 'Segurança e acesso',
    description: 'Consultar o acesso local e sair do sistema.',
    Icon: LockKeyhole,
  },
  {
    id: 'suporte',
    title: 'Suporte',
    description: 'Dúvidas frequentes e ideias de evolução do projeto.',
    Icon: LifeBuoy,
  },
  {
    id: 'saibaMais',
    title: 'Saiba mais',
    description: 'Quem somos, termos de uso e privacidade.',
    Icon: Info,
  },
  {
    id: 'backup',
    title: 'Backup',
    description: 'Exportar e importar os registros locais do aplicativo.',
    Icon: Save,
  },
]

function Configuracoes({
  onAbrirBackup,
  onAbrirCategorias,
  onAbrirPerfil,
  onAbrirSaibaMais,
  onAbrirSeguranca,
  onAbrirSuporte,
}) {
  const actions = {
    backup: onAbrirBackup,
    categorias: onAbrirCategorias,
    perfil: onAbrirPerfil,
    saibaMais: onAbrirSaibaMais,
    seguranca: onAbrirSeguranca,
    suporte: onAbrirSuporte,
  }

  return (
    <section className="configuracoes" aria-label="Configurações">
      <section className="configuracoes__section">
        <div className="section-heading">
          <div>
            <h1>Olá, Luis</h1>
          </div>
        </div>

        <div className="configuracoes__cards">
          {OPTIONS.map(({ id, title, description, Icon }) => (
            <button
              className="configuracoes__card"
              type="button"
              key={id}
              onClick={actions[id]}
            >
              <span className="configuracoes__icon" aria-hidden="true">
                <Icon size={24} />
              </span>
              <span className="configuracoes__info">
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Configuracoes
