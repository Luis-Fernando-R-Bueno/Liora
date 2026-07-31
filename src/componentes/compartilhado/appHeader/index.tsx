import { History, LayoutDashboard, ReceiptText, Settings } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
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

function getCurrentMenuIndex(pathname) {
  const exactIndex = NAV_ITEMS.findIndex((item) => item.path === pathname)

  if (exactIndex !== -1) {
    return exactIndex
  }

  if (pathname.startsWith('/configuracoes')) {
    return NAV_ITEMS.findIndex((item) => item.path === '/configuracoes')
  }

  return -1
}

function AppHeader() {
  const location = useLocation()
  const currentMenuIndex = getCurrentMenuIndex(location.pathname)

  return (
    <header className="app-header">
      <div className="app-header__brand" aria-label="Liora">
        <img src="/liora-logo.svg" alt="Liora" />
      </div>
      <nav className="app-header__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ id, label, path, end, Icon }, index) => (
          <NavLink
            key={id}
            className={({ isActive }) =>
              isActive ? 'app-header__tab is-active' : 'app-header__tab'
            }
            to={path}
            state={{
              menuTransition: {
                fromIndex: currentMenuIndex,
                toIndex: index,
              },
            }}
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
