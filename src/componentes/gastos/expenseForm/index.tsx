import { Plus, Save, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import CalendarField from '../../compartilhado/calendarField'
import { isCreditCardCategory, sortCategoriesByName } from '../../../utils/categoryUtils'
import { toInputDate } from '../../../utils/dateUtils'
import './styles.css'

function getInitialFormData(editingExpense, initialCategoryId) {
  if (editingExpense) {
    return {
      date: editingExpense.date,
      categoryId: editingExpense.categoryId,
      value: String(editingExpense.value),
      description: editingExpense.description,
    }
  }

  return {
    date: toInputDate(),
    categoryId: initialCategoryId,
    value: '',
    description: '',
  }
}

function ExpenseForm({
  categories,
  editingExpense,
  focusKey,
  onAddExpense,
  onCancelEdit,
  onUpdateExpense,
}) {
  const firstInputRef = useRef(null)
  const initialCategoryId = useMemo(() => {
    const activeCategories = categories.filter((category) => category.ativa)
    const creditCardCategory = activeCategories.find(isCreditCardCategory)

    return creditCardCategory?.id ?? activeCategories[0]?.id ?? categories[0]?.id ?? ''
  }, [categories])
  const [formData, setFormData] = useState(() =>
    getInitialFormData(editingExpense, initialCategoryId),
  )

  const availableCategories = useMemo(
    () =>
      sortCategoriesByName(
        categories.filter(
          (category) => category.ativa || category.id === formData.categoryId,
        ),
      ),
    [categories, formData.categoryId],
  )
  const isEditing = Boolean(editingExpense)

  useEffect(() => {
    if (focusKey > 0) {
      firstInputRef.current?.focus()
    }
  }, [focusKey])

  function updateField(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormData(getInitialFormData(null, initialCategoryId))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (isEditing) {
      onUpdateExpense(editingExpense.id, formData)
    } else {
      onAddExpense(formData)
    }

    resetForm()
  }

  function handleCancel() {
    resetForm()
    onCancelEdit()
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{isEditing ? 'Editar gasto' : 'Novo gasto'}</h2>
      </div>

      <div className="expense-form__grid">
        <CalendarField
          buttonRef={firstInputRef}
          label="Data"
          value={formData.date}
          onChange={(value) => updateField('date', value)}
        />

        <label>
          <span>Categoria</span>
          <select
            required
            value={formData.categoryId}
            onChange={(event) => updateField('categoryId', event.target.value)}
          >
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Valor</span>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={formData.value}
            onChange={(event) => updateField('value', event.target.value)}
            placeholder="0,00"
          />
        </label>

        <label className="expense-form__wide">
          <span>Descrição</span>
          <input
            type="text"
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Mercado, combustível, presente..."
          />
        </label>
      </div>

      <div className="expense-form__actions">
        {isEditing ? (
          <button className="button button--ghost" type="button" onClick={handleCancel}>
            <X size={18} aria-hidden="true" />
            Cancelar
          </button>
        ) : null}
        <button className="button button--primary" type="submit">
          {isEditing ? (
            <Save size={18} aria-hidden="true" />
          ) : (
            <Plus size={18} aria-hidden="true" />
          )}
          {isEditing ? 'Salvar alterações' : 'Cadastrar gasto'}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm
