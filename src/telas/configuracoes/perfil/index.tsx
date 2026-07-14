import {
  ArrowLeft,
  LineChart,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { formatCurrency, parseCurrencyInput } from '../../../utils/formatCurrency'
import '../styles.css'
import './styles.css'

const PROFILE_PHOTO_KEY = 'controle-gastos:perfil-foto'
const PROFILE_NAME_KEY = 'controle-gastos:perfil-nome'
const PROFILE_PHONE_KEY = 'controle-gastos:perfil-telefone'
const PROFILE_EMAIL_KEY = 'controle-gastos:perfil-email'
const PROFILE_SALARY_KEY = 'controle-gastos:salario-mensal'

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

function loadProfileData() {
  return {
    name: localStorage.getItem(PROFILE_NAME_KEY) || 'Usuário',
    phone: localStorage.getItem(PROFILE_PHONE_KEY) || '',
    email: localStorage.getItem(PROFILE_EMAIL_KEY) || '',
  }
}

function saveProfileData(key, value) {
  localStorage.setItem(key, value)
}

function ConfiguracoesPerfil({
  monthlySalary = 0,
  onBack,
  onUpdateMonthlySalary,
  onProfileUpdate,
}) {
  const fileInputRef = useRef(null)
  const [photo, setPhoto] = useState(() => localStorage.getItem(PROFILE_PHOTO_KEY) || '')
  const profileData = loadProfileData()
  
  const [name, setName] = useState(profileData.name)
  const [phone, setPhone] = useState(profileData.phone)
  const [email, setEmail] = useState(profileData.email)
  
  const [salaryInput, setSalaryInput] = useState(() => formatSalaryInput(monthlySalary))
  const [salaryFeedback, setSalaryFeedback] = useState('')
  
  const [editingFields, setEditingFields] = useState({
    name: false,
    phone: false,
    email: false,
    salary: false,
  })

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

  function handleEditField(field) {
    setEditingFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  function handleSaveField(field) {
    const fieldMap = {
      name: { value: name, key: PROFILE_NAME_KEY },
      phone: { value: phone, key: PROFILE_PHONE_KEY },
      email: { value: email, key: PROFILE_EMAIL_KEY },
    }

    const { value, key } = fieldMap[field]
    const trimmedValue = value.trim()

    if (!trimmedValue && field === 'name') {
      setName('Usuário')
      saveProfileData(key, 'Usuário')
    } else {
      saveProfileData(key, trimmedValue)
    }

    setEditingFields((prev) => ({
      ...prev,
      [field]: false,
    }))

    if (onProfileUpdate) {
      onProfileUpdate()
    }
  }

  function handleStartSalaryEdit() {
    setSalaryInput(formatSalaryInput(monthlySalary))
    setSalaryFeedback('')
    setEditingFields((prev) => ({
      ...prev,
      salary: true,
    }))
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
    setEditingFields((prev) => ({
      ...prev,
      salary: false,
    }))
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
              <img src={photo} alt={`Foto de ${name}`} />
            ) : (
              <UserRound size={52} aria-hidden="true" />
            )}
          </button>

          <div className="perfil-config__identity">
            <strong>{name}</strong>
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
            <UserRound size={22} aria-hidden="true" />
            <div>
              <span>Nome</span>
              {editingFields.name ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleSaveField('name')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('name')
                  }}
                  autoFocus
                  className="perfil-config__input-field"
                />
              ) : (
                <div className="perfil-config__field-display">
                  <strong>{name}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleEditField('name')}
                    aria-label="Editar nome"
                    title="Editar nome"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </article>

          <article className="perfil-config__metric">
            <Phone size={22} aria-hidden="true" />
            <div>
              <span>Telefone</span>
              {editingFields.phone ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleSaveField('phone')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('phone')
                  }}
                  autoFocus
                  placeholder="Seu número"
                  className="perfil-config__input-field"
                />
              ) : (
                <div className="perfil-config__field-display">
                  <strong>{phone || 'Não informado'}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleEditField('phone')}
                    aria-label="Editar telefone"
                    title="Editar telefone"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </article>

          <article className="perfil-config__metric">
            <Mail size={22} aria-hidden="true" />
            <div>
              <span>Email</span>
              {editingFields.email ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleSaveField('email')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('email')
                  }}
                  autoFocus
                  placeholder="seu.email@exemplo.com"
                  className="perfil-config__input-field"
                />
              ) : (
                <div className="perfil-config__field-display">
                  <strong>{email || 'Não informado'}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleEditField('email')}
                    aria-label="Editar email"
                    title="Editar email"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
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

              {!editingFields.salary ? (
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

            {editingFields.salary ? (
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
