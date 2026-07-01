import {
  ArrowLeft,
  CalendarClock,
  Database,
  LineChart,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { formatCurrency, parseCurrencyInput } from '../../../utils/formatCurrency'
import '../styles.css'
import './styles.css'

const PROFILE_PHOTO_KEY = 'controle-gastos:perfil-foto'

function formatLoginDate(value) {
  if (!value) return 'Não informado'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Não informado'

  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

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

function ConfiguracoesPerfil({
  monthlySalary = 0,
  onBack,
  onUpdateMonthlySalary,
  session,
}) {
  const fileInputRef = useRef(null)
  const [photo, setPhoto] = useState(() => localStorage.getItem(PROFILE_PHOTO_KEY) || '')
  const [salaryInput, setSalaryInput] = useState(() => formatSalaryInput(monthlySalary))
  const [salaryFeedback, setSalaryFeedback] = useState('')
  const [isEditingSalary, setIsEditingSalary] = useState(false)
  const displayName = 'Luis'

  function handleSelectPhoto(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      const nextPhoto = typeof reader.result === 'string' ? reader.result : ''

      setPhoto(nextPhoto)
      localStorage.setItem(PROFILE_PHOTO_KEY, nextPhoto)
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function handleRemovePhoto() {
    setPhoto('')
    localStorage.removeItem(PROFILE_PHOTO_KEY)
  }

  function handleStartSalaryEdit() {
    setSalaryInput(formatSalaryInput(monthlySalary))
    setSalaryFeedback('')
    setIsEditingSalary(true)
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
    setIsEditingSalary(false)
  }

  return (
    <section className="configuracoes-subpagina perfil-config" aria-label="Perfil">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="perfil-config__hero">
        <div className="perfil-config__photo-card">
          <button
            className="perfil-config__photo"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Selecionar foto de perfil"
            title="Selecionar foto de perfil"
          >
            {photo ? (
              <img src={photo} alt={`Foto de ${displayName}`} />
            ) : (
              <UserRound size={52} aria-hidden="true" />
            )}
          </button>

          <div className="perfil-config__identity">
            <strong>{displayName}</strong>
          </div>

          {photo ? (
            <div className="perfil-config__actions">
              <button className="button button--ghost" type="button" onClick={handleRemovePhoto}>
                <Trash2 size={18} aria-hidden="true" />
                Remover
              </button>
            </div>
          ) : null}
        </div>

        <div className="perfil-config__summary">
          <article className="perfil-config__metric">
            <ShieldCheck size={22} aria-hidden="true" />
            <div>
              <span>Acesso</span>
              <strong>Local</strong>
            </div>
          </article>

          <article className="perfil-config__metric">
            <CalendarClock size={22} aria-hidden="true" />
            <div>
              <span>Último login</span>
              <strong>{formatLoginDate(session?.loggedAt)}</strong>
            </div>
          </article>

          <article className="perfil-config__metric">
            <Database size={22} aria-hidden="true" />
            <div>
              <span>Dados</span>
              <strong>Neste navegador</strong>
            </div>
          </article>

          <form className="perfil-config__salary-card" onSubmit={handleSaveSalary}>
            <div className="perfil-config__salary-heading">
              <div className="perfil-config__salary-title">
                <LineChart size={22} aria-hidden="true" />
                <div>
                  <span>Salário mensal</span>
                  <strong>{formatCurrency(monthlySalary)}</strong>
                </div>
              </div>

              {!isEditingSalary ? (
                <button
                  className="icon-button perfil-config__salary-edit"
                  type="button"
                  title="Editar salário"
                  aria-label="Editar salário"
                  onClick={handleStartSalaryEdit}
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
                      setSalaryInput(event.target.value)
                      setSalaryFeedback('')
                    }}
                    placeholder="Ex.: 3500,00"
                  />
                </label>

                <button className="button button--primary" type="submit">
                  Salvar salário
                </button>

                {salaryFeedback ? (
                  <small className="perfil-config__salary-feedback">{salaryFeedback}</small>
                ) : null}
              </>
            ) : null}
          </form>
        </div>

        <input
          ref={fileInputRef}
          className="perfil-config__input"
          type="file"
          accept="image/*"
          onChange={handleSelectPhoto}
        />
      </section>
    </section>
  )
}

export default ConfiguracoesPerfil
