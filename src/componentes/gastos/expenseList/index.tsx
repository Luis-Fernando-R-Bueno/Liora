import { Pencil, ReceiptText, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import ConfirmDialog from '../../compartilhado/confirmDialog'
import { formatDate } from '../../../utils/dateUtils'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

const SORT_COLUMNS = [
  {
    key: 'date',
    label: 'Data',
    defaultDirection: 'desc',
    getValue: (expense) => expense.date,
  },
  {
    key: 'category',
    label: 'Categoria',
    defaultDirection: 'asc',
    getValue: (expense) => expense.category.nome,
  },
  {
    key: 'description',
    label: 'Descrição',
    defaultDirection: 'asc',
    getValue: (expense) => expense.description || '',
  },
  {
    key: 'value',
    label: 'Valor',
    defaultDirection: 'desc',
    getValue: (expense) => expense.value,
  },
]

function compareValues(a, b, direction) {
  const multiplier = direction === 'asc' ? 1 : -1

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * multiplier
  }

  return String(a).localeCompare(String(b), 'pt-BR', { numeric: true }) * multiplier
}

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  const [pendingDeleteExpense, setPendingDeleteExpense] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc',
  })

  const sortedExpenses = useMemo(() => {
    const column = SORT_COLUMNS.find((item) => item.key === sortConfig.key)

    if (!column) {
      return expenses
    }

    return [...expenses].sort((a, b) => {
      const valueDiff = compareValues(
        column.getValue(a),
        column.getValue(b),
        sortConfig.direction,
      )

      if (valueDiff !== 0) {
        return valueDiff
      }

      return String(b.createdAt).localeCompare(String(a.createdAt))
    })
  }, [expenses, sortConfig])

  function handleSort(column) {
    setSortConfig((currentConfig) => {
      if (currentConfig.key !== column.key) {
        return {
          key: column.key,
          direction: column.defaultDirection,
        }
      }

      return {
        key: column.key,
        direction: currentConfig.direction === 'asc' ? 'desc' : 'asc',
      }
    })
  }

  function handleDelete(expense) {
    setPendingDeleteExpense(expense)
  }

  function confirmDeleteExpense() {
    if (pendingDeleteExpense) {
      onDeleteExpense(pendingDeleteExpense.id)
    }

    setPendingDeleteExpense(null)
  }

  if (expenses.length === 0) {
    return (
      <section className="expense-list expense-list--empty">
        <div className="empty-state">
          <ReceiptText size={28} aria-hidden="true" />
          <p>Nenhum gasto encontrado.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="expense-list">
        <div className="expense-list__table-wrap">
          <table className="expense-list__table">
            <thead>
              <tr>
                {SORT_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    aria-sort={
                      sortConfig.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      className={
                        sortConfig.key === column.key
                          ? 'expense-list__sort-button is-active'
                          : 'expense-list__sort-button'
                      }
                      type="button"
                      onClick={() => handleSort(column)}
                    >
                      {column.label}
                    </button>
                  </th>
                ))}
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>
                    <span
                      className="category-badge expense-list__badge"
                      style={{ '--category-color': expense.category.cor }}
                    >
                      {expense.category.nome}
                    </span>
                  </td>
                  <td>{expense.description || '-'}</td>
                  <td>
                    <strong>{formatCurrency(expense.value)}</strong>
                  </td>
                  <td>
                    <div className="expense-list__actions">
                      <button
                        className="icon-button"
                        type="button"
                        title="Editar gasto"
                        aria-label="Editar gasto"
                        onClick={() => onEditExpense(expense)}
                      >
                        <Pencil size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button icon-button--danger"
                        type="button"
                        title="Excluir gasto"
                        aria-label="Excluir gasto"
                        onClick={() => handleDelete(expense)}
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        confirmLabel="Excluir"
        isOpen={Boolean(pendingDeleteExpense)}
        message="Esta ação removerá o gasto do histórico e atualizará o painel."
        title="Excluir gasto?"
        onCancel={() => setPendingDeleteExpense(null)}
        onConfirm={confirmDeleteExpense}
      />
    </>
  )
}

export default ExpenseList
