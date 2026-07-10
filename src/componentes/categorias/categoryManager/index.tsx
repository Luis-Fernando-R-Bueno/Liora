import { EyeOff, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import ConfirmDialog from '../../compartilhado/confirmDialog'
import { sortCategoriesByName } from '../../../utils/categoryUtils'
import './styles.css'

function CategoryManager({
  categories,
  expenses,
  onAddCategory,
  onRemoveCategory,
  onToggleCategory,
  onUpdateCategory,
}) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [pendingRemoveCategory, setPendingRemoveCategory] = useState(null)

  const usageByCategory = useMemo(
    () =>
      expenses.reduce((acc, expense) => {
        acc[expense.categoryId] = (acc[expense.categoryId] ?? 0) + 1
        return acc
      }, {}),
    [expenses],
  )

  const sortedCategories = useMemo(() => sortCategoriesByName(categories), [categories])

  function handleAddCategory(event) {
    event.preventDefault()
    const created = onAddCategory(newCategoryName)

    if (created) {
      setNewCategoryName('')
      setFeedback('')
      return
    }

    setFeedback('Informe um nome único para a categoria.')
  }

  function startEditing(category) {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.nome)
    setFeedback('')
  }

  function saveEditing() {
    const updated = onUpdateCategory(editingCategoryId, editingCategoryName)

    if (updated) {
      setEditingCategoryId('')
      setEditingCategoryName('')
      setFeedback('')
      return
    }

    setFeedback('Informe um nome válido para a categoria.')
  }

  function cancelEditing() {
    setEditingCategoryId('')
    setEditingCategoryName('')
    setFeedback('')
  }

  function handleRemove(category) {
    setPendingRemoveCategory(category)
  }

  function confirmRemoveCategory() {
    if (pendingRemoveCategory) {
      onRemoveCategory(pendingRemoveCategory.id)
    }

    setPendingRemoveCategory(null)
  }

  const pendingCategoryUsage = pendingRemoveCategory
    ? usageByCategory[pendingRemoveCategory.id] ?? 0
    : 0
  const pendingCategoryIsUsed = pendingCategoryUsage > 0

  return (
    <>
      <section className="category-manager">
        <div className="category-manager__intro">
          <div className="section-heading">
            <h2>Categorias</h2>
          </div>

          <form className="category-manager__form" onSubmit={handleAddCategory}>
            <label>
              <span>Nova categoria</span>
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Ex.: Saúde"
              />
            </label>
            <button className="button button--primary" type="submit">
              <Plus size={18} aria-hidden="true" />
              Adicionar
            </button>
          </form>

          {feedback ? <p className="category-manager__feedback">{feedback}</p> : null}
        </div>

        <div className="category-manager__list">
          {sortedCategories.map((category) => {
            const isEditing = editingCategoryId === category.id
            const usageCount = usageByCategory[category.id] ?? 0

            return (
              <article className="category-manager__item" key={category.id}>
                <span
                  className="category-manager__color"
                  style={{ '--category-color': category.cor }}
                  aria-hidden="true"
                />

                <div className="category-manager__main">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(event) => setEditingCategoryName(event.target.value)}
                    />
                  ) : (
                    <strong>{category.nome}</strong>
                  )}
                  <span>
                    {category.ativa ? 'Ativa' : 'Inativa'} - {usageCount}{' '}
                    {usageCount === 1 ? 'gasto' : 'gastos'}
                  </span>
                </div>

                <div className="category-manager__actions">
                  {isEditing ? (
                    <>
                      <button
                        className="icon-button"
                        type="button"
                        title="Salvar categoria"
                        aria-label="Salvar categoria"
                        onClick={saveEditing}
                      >
                        <Save size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        title="Cancelar edição"
                        aria-label="Cancelar edição"
                        onClick={cancelEditing}
                      >
                        <X size={17} aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="icon-button"
                        type="button"
                        title="Editar categoria"
                        aria-label="Editar categoria"
                        onClick={() => startEditing(category)}
                      >
                        <Pencil size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        title={category.ativa ? 'Inativar categoria' : 'Ativar categoria'}
                        aria-label={category.ativa ? 'Inativar categoria' : 'Ativar categoria'}
                        onClick={() => onToggleCategory(category.id)}
                      >
                        {category.ativa ? (
                          <EyeOff size={17} aria-hidden="true" />
                        ) : (
                          <RotateCcw size={17} aria-hidden="true" />
                        )}
                      </button>
                      <button
                        className="icon-button icon-button--danger"
                        type="button"
                        title={usageCount > 0 ? 'Inativar categoria' : 'Excluir categoria'}
                        aria-label={usageCount > 0 ? 'Inativar categoria' : 'Excluir categoria'}
                        onClick={() => handleRemove(category)}
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <ConfirmDialog
        confirmLabel={pendingCategoryIsUsed ? 'Inativar' : 'Excluir'}
        isOpen={Boolean(pendingRemoveCategory)}
        message={
          pendingCategoryIsUsed
            ? 'Esta categoria possui gastos vinculados e será inativada.'
            : 'Esta ação removerá a categoria da lista.'
        }
        title={pendingCategoryIsUsed ? 'Inativar categoria?' : 'Excluir categoria?'}
        onCancel={() => setPendingRemoveCategory(null)}
        onConfirm={confirmRemoveCategory}
      />
    </>
  )
}

export default CategoryManager
