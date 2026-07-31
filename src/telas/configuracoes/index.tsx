import { Tags, Wallet } from 'lucide-react'
import './styles.css'

const OPTIONS = [
  {
    id: 'salario',
    title: 'Salário',
    description: 'Definir o salário mensal usado no painel.',
    Icon: Wallet,
  },
  {
    id: 'categorias',
    title: 'Categorias',
    description: 'Criar, editar, inativar ou remover categorias de gastos.',
    Icon: Tags,
  },
]

function Configuracoes({
  onAbrirCategorias,
  onAbrirSalario,
}) {
  const actions = {
    categorias: onAbrirCategorias,
    salario: onAbrirSalario,
  }

  return (
    <section className="configuracoes" aria-label="Configurações">
      <section className="configuracoes__section">
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
