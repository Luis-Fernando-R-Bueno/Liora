/*
 * Tipo: componente visual.
 * Funcao: lista meses anteriores consolidados e permite abrir o periodo no painel.
 * Importado em: tela Historico.
 */

import { CalendarDays, TrendingUp } from 'lucide-react'
import { formatMonthLabel } from '../../../utils/dateUtils'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

function MonthHistoryList({ months, onOpenMonth }) {
  if (months.length === 0) {
    return (
      <section className="month-history-list">
        <div className="empty-state">
          <CalendarDays size={30} aria-hidden="true" />
          <p>Nenhum mês anterior com gastos cadastrados.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="month-history-list">
      <div className="section-heading">
        <div>
          <span>Arquivo mensal</span>
          <h2>Meses passados</h2>
        </div>
        <CalendarDays size={20} aria-hidden="true" />
      </div>

      <div className="month-history-list__grid">
        {months.map((month) => (
          <article className="month-history-card" key={month.id}>
            <div className="month-history-card__top">
              <div>
                <span>{formatMonthLabel(month.label)}</span>
                <strong>{formatCurrency(month.total)}</strong>
              </div>
              <div className="month-history-card__icon">
                <TrendingUp size={20} aria-hidden="true" />
              </div>
            </div>

            <div className="month-history-card__details">
              <span>
                {month.count} {month.count === 1 ? 'lançamento' : 'lançamentos'}
              </span>
              <span>
                Maior categoria:{' '}
                <b>{month.topCategory?.label ?? 'Sem categoria'}</b>
              </span>
            </div>

            <button
              className="button button--ghost"
              type="button"
              onClick={() => onOpenMonth(month.id)}
            >
              Ver no painel
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MonthHistoryList
