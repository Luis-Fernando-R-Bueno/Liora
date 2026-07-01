import { History, LayoutDashboard, ReceiptText, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import './styles.css'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Painel',
    path: '/painel',
    end: true,
    Icon: LayoutDashboard,
  },
  {
    id: 'gastos',
    label: 'Gastos',
    path: '/gastos',
    Icon: ReceiptText,
  },
  {
    id: 'historico',
    label: 'Histórico',
    path: '/historico',
    Icon: History,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    path: '/configuracoes',
    Icon: Settings,
  },
]

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__brand" aria-label="Liora">
        <img src="/logo.svg" alt="" aria-hidden="true" />
        <span>Liora</span>
      </div>
      <nav className="app-header__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ id, label, path, end, Icon }) => (
          <NavLink
            key={id}
            className={({ isActive }) =>
              isActive ? 'app-header__tab is-active' : 'app-header__tab'
            }
            to={path}
            end={end}
            aria-label={label}
            title={label}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="app-header__tab-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default AppHeader
