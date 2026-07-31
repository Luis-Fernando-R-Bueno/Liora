import { ArrowLeft, LineChart, Pencil, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, parseCurrencyInput } from '../../../utils/formatCurrency'
import '../styles.css'
import './styles.css'

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

function ConfiguracoesSalario({
  monthlySalary = 0,
  onBack,
  onUpdateMonthlySalary,
}) {
  const [salaryInput, setSalaryInput] = useState(() => formatSalaryInput(monthlySalary))
  const [salaryFeedback, setSalaryFeedback] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  function handleStartEdit() {
    setSalaryInput(formatSalaryInput(monthlySalary))
    setSalaryFeedback('')
    setIsEditing(true)
  }

  function handleSaveSalary(event) {
    event.preventDefault()

    const nextSalary = salaryInput.trim() ? parseCurrencyInput(salaryInput) : 0

    if (!Number.isFinite(nextSalary) || nextSalary < 0) {
      setSalaryFeedback('Informe um salário válido.')
      return
    }

    onUpdateMonthlySalary(nextSalary)
    setSalaryInput(formatSalaryInput(nextSalary))
    setSalaryFeedback(nextSalary > 0 ? 'Salário salvo.' : 'Salário removido.')
    setIsEditing(false)
  }

  return (
    <section className="configuracoes-subpagina salario-config" aria-label="Salário">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

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

            {!isEditing ? (
              <button
                className="icon-button salario-config__edit"
                type="button"
                title="Editar salário"
                aria-label="Editar salário"
                onClick={handleStartEdit}
              >
                <Pencil size={17} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {isEditing ? (
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
    </section>
  )
}

export default ConfiguracoesSalario
