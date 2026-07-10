import { Search } from 'lucide-react'
import './styles.css'

function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <span>Pesquisa</span>
      <div className="search-bar">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Descrição, categoria ou valor"
        />
        <Search size={18} aria-hidden="true" />
      </div>
    </label>
  )
}

export default SearchBar
