import { RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { MonthField } from '../../compartilhado/calendarField'
import SearchBar from '../../compartilhado/searchBar'
import { sortCategoriesByName } from '../../../utils/categoryUtils'
import './styles.css'

function ExpenseFilters({ categories, filters, onChange, onClear }) {
  const sortedCategories = useMemo(() => sortCategoriesByName(categories), [categories])

  return (
    <section className="expense-filters" aria-label="Filtros de gastos">
      <SearchBar value={filters.search} onChange={(value) => onChange('search', value)} />

      <label>
        <span>Categoria</span>
        <select
          value={filters.categoryId}
          onChange={(event) => onChange('categoryId', event.target.value)}
        >
          <option value="todos">Todas</option>
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nome}
            </option>
          ))}
        </select>
      </label>

      <MonthField
        label="Mês"
        value={filters.monthKey}
        onChange={(value) => onChange('monthKey', value)}
      />

      <button className="button button--ghost" type="button" onClick={onClear}>
        <RotateCcw size={17} aria-hidden="true" />
        Limpar
      </button>
    </section>
  )
}

export default ExpenseFilters
