import { LineChart, Pencil, Tags, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, parseLocalizedCurrencyInput } from '../../utils/formatCurrency'
import './styles.css'

const OPTIONS = [
  {
    id: 'categorias',
    title: 'Categorias',
    description: 'Criar, editar, inativar ou remover categorias de gastos.',
    Icon: Tags,
  },
]

function formatSalaryInput(value) {
  const numericValue = Number(value) || 0

  if (numericValue <= 0) {
    return ''
  }

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatSalaryTyping(value) {
  const rawValue = String(value).replace(/[^\d,]/g, '')
  const [integerPart = '', decimalPart] = rawValue.split(',', 2)
  const integerDigits = integerPart.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  const formattedInteger = integerDigits
    ? integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : decimalPart !== undefined
      ? '0'
      : ''

  if (decimalPart === undefined) {
    return formattedInteger
  }

  return `${formattedInteger},${decimalPart.replace(/\D/g, '').slice(0, 2)}`
}

function Configuracoes({
  monthlySalary = 0,
  onAbrirCategorias,
  onUpdateMonthlySalary,
}) {
  const actions = {
    categorias: onAbrirCategorias,
  }

  const [salaryInput, setSalaryInput] = useState(() => formatSalaryInput(monthlySalary))
  const [salaryFeedback, setSalaryFeedback] = useState('')
  const [isEditingSalary, setIsEditingSalary] = useState(false)

  function handleStartEditSalary() {
    setSalaryInput(formatSalaryInput(monthlySalary))
    setSalaryFeedback('')
    setIsEditingSalary(true)
  }

  function handleSaveSalary(event) {
    event.preventDefault()

    const nextSalary = salaryInput.trim() ? parseLocalizedCurrencyInput(salaryInput) : 0

    if (!Number.isFinite(nextSalary) || nextSalary < 0) {
      setSalaryFeedback('Informe um salário válido.')
      return
    }

    onUpdateMonthlySalary(nextSalary)
    setSalaryInput(formatSalaryInput(nextSalary))
    setSalaryFeedback(nextSalary > 0 ? 'Salário salvo.' : 'Salário removido.')
    setIsEditingSalary(false)
  }

  return (
    <section className="configuracoes" aria-label="Configurações">
      <section className="salario-config__panel">
        <div className="salario-config__icon" aria-hidden="true">
          <Wallet size={30} />
        </div>

        <form className="salario-config__card" onSubmit={handleSaveSalary}>
          <div className="salario-config__heading">
            <div className="salario-config__title">
              <LineChart size={22} aria-hidden="true" />
              <div>
                <span>Salário mensal</span>
                <strong>{formatCurrency(monthlySalary)}</strong>
              </div>
            </div>

            {!isEditingSalary ? (
              <button
                className="icon-button salario-config__edit"
                type="button"
                title="Editar salário"
                aria-label="Editar salário"
                onClick={handleStartEditSalary}
              >
                <Pencil size={17} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {isEditingSalary ? (
            <>
              <label>
                <span>Valor do salário</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={salaryInput}
                  onChange={(event) => {
                    setSalaryInput(formatSalaryTyping(event.target.value))
                    setSalaryFeedback('')
                  }}
                  placeholder="Ex.: 3.500,00"
                  autoFocus
                />
              </label>

              <button className="button button--primary" type="submit">
                Salvar salário
              </button>
            </>
          ) : null}

          {salaryFeedback ? (
            <small className="salario-config__feedback">{salaryFeedback}</small>
          ) : null}
        </form>
      </section>

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
