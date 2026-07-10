import { BarChart3, ReceiptText, Tags, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

function DashboardCards({ dashboard }) {
  const cards = [
    {
      id: 'total',
      label: 'Total do mês',
      value: formatCurrency(dashboard.totalMonth),
      detail: 'Somatório do mês atual',
      Icon: TrendingUp,
      tone: 'amber',
    },
    {
      id: 'count',
      label: 'Sobra do salário',
      value: formatCurrency(dashboard.salaryRemaining),
      detail: 'Salário menos gastos do mês',
      Icon: ReceiptText,
      tone: dashboard.salaryRemaining < 0 ? 'danger' : 'green',
    },
    {
      id: 'top',
      label: 'Maior categoria',
      value: dashboard.topCategory?.label ?? 'Sem dados',
      detail: dashboard.topCategory
        ? formatCurrency(dashboard.topCategory.total)
        : 'Cadastre um gasto para ver',
      Icon: Tags,
      categoryColor: dashboard.topCategory?.color,
      tone: dashboard.topCategory ? 'category' : 'amber',
    },
    {
      id: 'average',
      label: 'Média mensal',
      value: formatCurrency(dashboard.averageMonthlyTotal),
      detail: 'Média dos meses com gastos',
      Icon: BarChart3,
      tone: 'neutral',
    },
  ]

  return (
    <section className="dashboard-cards" aria-label="Resumo financeiro">
      {cards.map(({ id, label, value, detail, Icon, tone, categoryColor }) => {
        const valueClassName =
          id === 'top'
            ? 'dashboard-card__value dashboard-card__value--text'
            : 'dashboard-card__value dashboard-card__value--number'

        return (
          <article
            className={`dashboard-card dashboard-card--${tone}`}
            key={id}
            style={categoryColor ? { '--category-color': categoryColor } : undefined}
          >
            <div className="dashboard-card__icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="dashboard-card__content">
              <span>{label}</span>
              {categoryColor ? (
                <strong className="category-badge dashboard-card__category">
                  {value}
                </strong>
              ) : (
                <strong className={valueClassName}>{value}</strong>
              )}
              <small>{detail}</small>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default DashboardCards
