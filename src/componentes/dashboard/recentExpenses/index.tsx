import { ReceiptText } from 'lucide-react'
import { formatDate } from '../../../utils/dateUtils'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

function RecentExpenses({ expenses }) {
  return (
    <section className="recent-expenses">
      <div className="section-heading">
        <div>
          <span>Últimos registros</span>
          <h2>Gastos recentes</h2>
        </div>
        <ReceiptText size={20} aria-hidden="true" />
      </div>

      {expenses.length > 0 ? (
        <ul className="recent-expenses__list">
          {expenses.map((expense) => (
            <li className="recent-expenses__item" key={expense.id}>
              <span
                className="category-dot"
                style={{ '--category-color': expense.category.cor }}
                aria-hidden="true"
              />
              <div className="recent-expenses__main">
                <strong>{expense.description || expense.category.nome}</strong>
                <span className="recent-expenses__meta">
                  {formatDate(expense.date)}
                  <span
                    className="category-badge recent-expenses__badge"
                    style={{ '--category-color': expense.category.cor }}
                  >
                    {expense.category.nome}
                  </span>
                </span>
              </div>
              <b>{formatCurrency(expense.value)}</b>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <ReceiptText size={28} aria-hidden="true" />
          <p>Nenhum gasto cadastrado.</p>
        </div>
      )}
    </section>
  )
}

export default RecentExpenses
