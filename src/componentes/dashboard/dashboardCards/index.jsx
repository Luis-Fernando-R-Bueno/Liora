import { BarChart3, CircleDollarSign, ReceiptText, Tags } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'
import './styles.css'

function DashboardCards({ dashboard }) {
  const cards = [
    {
      id: 'total',
      label: 'Total do mês',
      value: formatCurrency(dashboard.totalMonth),
      detail: 'Somatório do mês atual',
      Icon: CircleDollarSign,
      tone: 'blue',
    },
    {
      id: 'count',
      label: 'Lançamentos',
      value: dashboard.countMonth,
      detail: 'Gastos cadastrados no mês',
      Icon: ReceiptText,
      tone: 'green',
    },
    {
      id: 'top',
      label: 'Maior categoria',
      value: dashboard.topCategory?.label ?? 'Sem dados',
      detail: dashboard.topCategory
        ? formatCurrency(dashboard.topCategory.total)
        : 'Cadastre um gasto para ver',
      Icon: Tags,
      tone: 'amber',
    },
    {
      id: 'average',
      label: 'Média mensal',
      value: formatCurrency(dashboard.averageMonthlyTotal),
      detail: 'Média dos meses com gastos',
      Icon: BarChart3,
      tone: 'purple',
    },
  ]

  return (
    <section className="dashboard-cards" aria-label="Resumo financeiro">
      {cards.map(({ id, label, value, detail, Icon, tone }) => (
        <article className={`dashboard-card dashboard-card--${tone}`} key={id}>
          <div className="dashboard-card__icon">
            <Icon size={20} aria-hidden="true" />
          </div>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </div>
        </article>
      ))}
    </section>
  )
}

export default DashboardCards
