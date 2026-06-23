import MonthHistoryList from '../../componentes/historico/monthHistoryList'
import './styles.css'

function Historico({ months, onOpenMonth }) {
  return (
    <section className="historico" aria-label="Histórico mensal">
      <div className="historico__header">
        <span>Meses anteriores</span>
        <h1>Histórico</h1>
        <p>
          Acompanhe os meses já encerrados e abra qualquer período no painel
          para consultar seus detalhes.
        </p>
      </div>

      <MonthHistoryList months={months} onOpenMonth={onOpenMonth} />
    </section>
  )
}

export default Historico
