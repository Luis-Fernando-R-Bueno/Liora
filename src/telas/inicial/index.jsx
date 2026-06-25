import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AppHeader from '../../componentes/compartilhado/appHeader'
import { MonthField } from '../../componentes/compartilhado/calendarField'
import Rodape from '../../componentes/compartilhado/rodape'
import DashboardCards from '../../componentes/dashboard/dashboardCards'
import RecentExpenses from '../../componentes/dashboard/recentExpenses'
import SummaryList from '../../componentes/dashboard/summaryList'
import ExpenseFilters from '../../componentes/gastos/expenseFilters'
import ExpenseForm from '../../componentes/gastos/expenseForm'
import ExpenseList from '../../componentes/gastos/expenseList'
import { useControleGastos } from '../../hooks/useControleGastos'
import Configuracoes from '../configuracoes'
import ConfiguracoesBackup from '../configuracoes/backup'
import ConfiguracoesCategorias from '../configuracoes/categorias'
import ConfiguracoesPerfil from '../configuracoes/perfil'
import ConfiguracoesSaibaMais from '../configuracoes/saibaMais'
import ConfiguracoesQuemSomos from '../configuracoes/saibaMais/quemSomos'
import ConfiguracoesTermosDeUso from '../configuracoes/saibaMais/termosDeUso'
import ConfiguracoesSeguranca from '../configuracoes/segurancaEAcesso'
import ConfiguracoesSuporte from '../configuracoes/suporte'
import ConfiguracoesDuvidasFrequentes from '../configuracoes/suporte/duvidasFrequentes'
import ConfiguracoesParticipeDoProjeto from '../configuracoes/suporte/participeDoProjeto'
import Historico from '../historico'
import { getCurrentMonthKey } from '../../utils/dateUtils'
import './styles.css'

const INITIAL_FILTERS = {
  search: '',
  categoryId: 'todos',
  monthKey: '',
}

const MONTHLY_SALARY_KEY = 'controle-gastos:salario-mensal'

function loadMonthlySalary() {
  try {
    return Number(localStorage.getItem(MONTHLY_SALARY_KEY)) || 0
  } catch {
    return 0
  }
}

function saveMonthlySalary(value) {
  localStorage.setItem(MONTHLY_SALARY_KEY, String(Number(value) || 0))
}

function Inicial({ onLogout, session }) {
  const navigate = useNavigate()
  const [dashboardMonthKey, setDashboardMonthKey] = useState(getCurrentMonthKey)
  const {
    addCategory,
    addExpense,
    categories,
    dashboard,
    deleteExpense,
    exportRecords,
    expenses,
    filterExpenses,
    historicalMonths,
    importRecords,
    removeCategory,
    toggleCategoryStatus,
    updateCategory,
    updateExpense,
  } = useControleGastos(dashboardMonthKey)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formFocusKey, setFormFocusKey] = useState(0)
  const [monthlySalary, setMonthlySalary] = useState(loadMonthlySalary)

  const filteredExpenses = useMemo(
    () => filterExpenses(filters),
    [filterExpenses, filters],
  )

  const dashboardWithSalary = useMemo(
    () => ({
      ...dashboard,
      monthlySalary,
      salaryRemaining: monthlySalary - dashboard.totalMonth,
    }),
    [dashboard, monthlySalary],
  )

  function handleUpdateMonthlySalary(value) {
    setMonthlySalary(value)
    saveMonthlySalary(value)
  }

  function handleFilterChange(field, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }))
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense)
    setFormFocusKey((currentKey) => currentKey + 1)
    navigate('/gastos')
  }

  function handleDeleteExpense(expenseId) {
    deleteExpense(expenseId)

    if (editingExpense?.id === expenseId) {
      setEditingExpense(null)
    }
  }

  function handleAddExpense(expenseData) {
    addExpense(expenseData)
    setEditingExpense(null)
  }

  function handleUpdateExpense(expenseId, expenseData) {
    updateExpense(expenseId, expenseData)
    setEditingExpense(null)
  }

  function openDashboardMonth(monthKey) {
    setDashboardMonthKey(monthKey)
    navigate('/painel')
  }

  return (
    <div className="pagina-inicial">
      <AppHeader />

      <main className="pagina-inicial__main">
        <Routes>
          <Route path="/" element={<Navigate to="/painel" replace />} />

          <Route
            path="/painel"
            element={
              <section className="pagina-inicial__view" aria-label="Painel mensal">
                <div className="pagina-inicial__dashboard-toolbar">
                  <MonthField
                    label=""
                    value={dashboardMonthKey}
                    onChange={setDashboardMonthKey}
                  />
                </div>

                <DashboardCards dashboard={dashboardWithSalary} />

                <RecentExpenses expenses={dashboard.recentExpenses} />

                <div className="pagina-inicial__summary-grid">
                  <SummaryList
                    emptyText="Nenhum gasto no mês selecionado."
                    items={dashboard.categorySummary}
                    title="Resumo por categoria"
                    type="category"
                  />
                  <SummaryList
                    emptyText="Nenhum histórico mensal ainda."
                    items={dashboard.monthSummary}
                    title="Resumo por mês"
                    type="month"
                  />
                </div>
              </section>
            }
          />

          <Route
            path="/gastos"
            element={
              <section className="pagina-inicial__view" aria-label="Histórico de gastos">
                <div className="pagina-inicial__expense-layout">
                  <ExpenseForm
                    key={`${editingExpense?.id ?? 'novo-gasto'}-${formFocusKey}`}
                    categories={categories}
                    editingExpense={editingExpense}
                    focusKey={formFocusKey}
                    onAddExpense={handleAddExpense}
                    onCancelEdit={() => setEditingExpense(null)}
                    onUpdateExpense={handleUpdateExpense}
                  />

                  <div className="pagina-inicial__expense-list">
                    <ExpenseFilters
                      categories={categories}
                      filters={filters}
                      onChange={handleFilterChange}
                      onClear={() => setFilters(INITIAL_FILTERS)}
                    />
                    <ExpenseList
                      expenses={filteredExpenses}
                      onDeleteExpense={handleDeleteExpense}
                      onEditExpense={handleEditExpense}
                    />
                  </div>
                </div>
              </section>
            }
          />

          <Route
            path="/historico"
            element={
              <Historico
                months={historicalMonths}
                onOpenMonth={openDashboardMonth}
              />
            }
          />

          <Route
            path="/configuracoes"
            element={
              <Configuracoes
                onAbrirBackup={() => navigate('/configuracoes/backup')}
                onAbrirCategorias={() => navigate('/configuracoes/categorias')}
                onAbrirPerfil={() => navigate('/configuracoes/perfil')}
                onAbrirSaibaMais={() => navigate('/configuracoes/saiba-mais')}
                onAbrirSeguranca={() => navigate('/configuracoes/seguranca-e-acesso')}
                onAbrirSuporte={() => navigate('/configuracoes/suporte')}
              />
            }
          />

          <Route
            path="/configuracoes/perfil"
            element={
              <ConfiguracoesPerfil
                monthlySalary={monthlySalary}
                onBack={() => navigate('/configuracoes')}
                onUpdateMonthlySalary={handleUpdateMonthlySalary}
                session={session}
              />
            }
          />

          <Route
            path="/configuracoes/categorias"
            element={
              <ConfiguracoesCategorias
                categories={categories}
                expenses={expenses}
                onAddCategory={addCategory}
                onBack={() => navigate('/configuracoes')}
                onRemoveCategory={removeCategory}
                onToggleCategory={toggleCategoryStatus}
                onUpdateCategory={updateCategory}
              />
            }
          />

          <Route
            path="/configuracoes/seguranca-e-acesso"
            element={
              <ConfiguracoesSeguranca
                onBack={() => navigate('/configuracoes')}
                onLogout={onLogout}
              />
            }
          />

          <Route
            path="/configuracoes/suporte"
            element={
              <ConfiguracoesSuporte
                onAbrirDuvidas={() => navigate('/configuracoes/suporte/duvidas-frequentes')}
                onAbrirParticipe={() => navigate('/configuracoes/suporte/participe-do-projeto')}
                onBack={() => navigate('/configuracoes')}
              />
            }
          />

          <Route
            path="/configuracoes/suporte/duvidas-frequentes"
            element={
              <ConfiguracoesDuvidasFrequentes
                onBack={() => navigate('/configuracoes/suporte')}
              />
            }
          />

          <Route
            path="/configuracoes/suporte/participe-do-projeto"
            element={
              <ConfiguracoesParticipeDoProjeto
                onBack={() => navigate('/configuracoes/suporte')}
              />
            }
          />

          <Route
            path="/configuracoes/saiba-mais"
            element={
              <ConfiguracoesSaibaMais
                onAbrirQuemSomos={() => navigate('/configuracoes/saiba-mais/quem-somos')}
                onAbrirTermos={() =>
                  navigate('/configuracoes/saiba-mais/termos-de-uso-e-privacidade')
                }
                onBack={() => navigate('/configuracoes')}
              />
            }
          />

          <Route
            path="/configuracoes/saiba-mais/quem-somos"
            element={
              <ConfiguracoesQuemSomos
                onBack={() => navigate('/configuracoes/saiba-mais')}
              />
            }
          />

          <Route
            path="/configuracoes/saiba-mais/termos-de-uso-e-privacidade"
            element={
              <ConfiguracoesTermosDeUso
                onBack={() => navigate('/configuracoes/saiba-mais')}
              />
            }
          />

          <Route
            path="/configuracoes/backup"
            element={
              <ConfiguracoesBackup
                onBack={() => navigate('/configuracoes')}
                onExportRecords={exportRecords}
                onImportRecords={importRecords}
              />
            }
          />

          <Route
            path="/backup"
            element={<Navigate to="/configuracoes/backup" replace />}
          />
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Routes>

        <Rodape />
      </main>
    </div>
  )
}

export default Inicial
