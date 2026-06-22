import { useMemo, useState } from 'react'
import CategoryManager from '../../componentes/categorias/categoryManager'
import AppHeader from '../../componentes/compartilhado/appHeader'
import { MonthField } from '../../componentes/compartilhado/calendarField'
import DashboardCards from '../../componentes/dashboard/dashboardCards'
import RecentExpenses from '../../componentes/dashboard/recentExpenses'
import SummaryList from '../../componentes/dashboard/summaryList'
import ExpenseFilters from '../../componentes/gastos/expenseFilters'
import ExpenseForm from '../../componentes/gastos/expenseForm'
import ExpenseList from '../../componentes/gastos/expenseList'
import { useControleGastos } from '../../hooks/useControleGastos'
import { getCurrentMonthKey } from '../../utils/dateUtils'
import './styles.css'

const INITIAL_FILTERS = {
  search: '',
  categoryId: 'todos',
  monthKey: '',
}

function Inicial() {
  const [dashboardMonthKey, setDashboardMonthKey] = useState(getCurrentMonthKey)
  const {
    addCategory,
    addExpense,
    categories,
    dashboard,
    deleteExpense,
    expenses,
    filterExpenses,
    removeCategory,
    toggleCategoryStatus,
    updateCategory,
    updateExpense,
  } = useControleGastos(dashboardMonthKey)
  const [activeView, setActiveView] = useState('dashboard')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formFocusKey, setFormFocusKey] = useState(0)

  const filteredExpenses = useMemo(
    () => filterExpenses(filters),
    [filterExpenses, filters],
  )

  function handleFilterChange(field, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }))
  }

  function handleEditExpense(expense) {
    setActiveView('gastos')
    setEditingExpense(expense)
    setFormFocusKey((currentKey) => currentKey + 1)
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

  return (
    <div className="pagina-inicial">
      <AppHeader
        activeView={activeView}
        onChangeView={setActiveView}
      />

      <main className="pagina-inicial__main">
        {activeView === 'dashboard' ? (
          <section className="pagina-inicial__view" aria-label="Dashboard mensal">
            <div className="pagina-inicial__dashboard-toolbar">
              <MonthField
                label=""
                value={dashboardMonthKey}
                onChange={setDashboardMonthKey}
              />
            </div>

            <DashboardCards dashboard={dashboard} />

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
        ) : null}

        {activeView === 'gastos' ? (
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
        ) : null}

        {activeView === 'categorias' ? (
          <section className="pagina-inicial__view" aria-label="Gerenciamento de categorias">
            <CategoryManager
              categories={categories}
              expenses={expenses}
              onAddCategory={addCategory}
              onRemoveCategory={removeCategory}
              onToggleCategory={toggleCategoryStatus}
              onUpdateCategory={updateCategory}
            />
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default Inicial
