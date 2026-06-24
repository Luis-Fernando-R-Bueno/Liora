import { History, LayoutDashboard, ReceiptText, Tags } from 'lucide-react'
import './styles.css'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Painel',
    Icon: LayoutDashboard,
  },
  {
    id: 'gastos',
    label: 'Gastos',
    Icon: ReceiptText,
  },
  {
    id: 'categorias',
    label: 'Categorias',
    Icon: Tags,
  },
  {
    id: 'historico',
    label: 'Histórico',
    Icon: History,
  },
]

function AppHeader({ activeView, onChangeView }) {
  return (
    <header className="app-header">
      <nav className="app-header__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={activeView === id ? 'app-header__tab is-active' : 'app-header__tab'}
            type="button"
            aria-label={label}
            title={label}
            onClick={() => onChangeView(id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="app-header__tab-label">{label}</span>
          </button>
        ))}
      </nav>
    </header>
  )
}

export default AppHeader
