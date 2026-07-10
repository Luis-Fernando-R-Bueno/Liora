import { ArrowLeft } from 'lucide-react'
import CategoryManager from '../../../componentes/categorias/categoryManager'
import '../styles.css'

function ConfiguracoesCategorias({
  categories,
  expenses,
  onAddCategory,
  onBack,
  onRemoveCategory,
  onToggleCategory,
  onUpdateCategory,
}) {
  return (
    <section className="configuracoes-subpagina" aria-label="Categorias">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <CategoryManager
        categories={categories}
        expenses={expenses}
        onAddCategory={onAddCategory}
        onRemoveCategory={onRemoveCategory}
        onToggleCategory={onToggleCategory}
        onUpdateCategory={onUpdateCategory}
      />
    </section>
  )
}

export default ConfiguracoesCategorias
