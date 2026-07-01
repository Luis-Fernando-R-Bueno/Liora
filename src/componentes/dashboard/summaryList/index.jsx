import { formatMonthLabel } from '../../../utils/dateUtils'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

function SummaryList({ emptyText, items, title, type }) {
  const defaultSummaryColor = 'var(--secondary)'

  return (
    <section className="summary-list">
      <div className="section-heading">
        <div>
          <span>{type === 'month' ? 'Histórico' : 'Distribuição'}</span>
          <h2>{title}</h2>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="summary-list__items">
          {items.map((item) => (
            <li className="summary-list__item" key={item.id}>
              <div className="summary-list__topline">
                <span className="summary-list__label">
                  {type === 'month' ? formatMonthLabel(item.label) : item.label}
                </span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
              <div className="summary-list__track" aria-hidden="true">
                <span
                  style={{
                    '--summary-color': item.color ?? defaultSummaryColor,
                    width: `${Math.max(item.percent, 4)}%`,
                  }}
                />
              </div>
              <small>
                {item.count} {item.count === 1 ? 'lançamento' : 'lançamentos'}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="summary-list__empty">{emptyText}</p>
      )}
    </section>
  )
}

export default SummaryList
