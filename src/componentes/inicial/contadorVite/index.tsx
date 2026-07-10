/*
 * Tipo: componente visual.
 * Funcao: exibe o contador interativo do template Vite.
 * Importado em: tela Inicial.
 */

import './styles.css'

function ContadorVite({ contador, onIncrementar }) {
  return (
    <button
      type="button"
      className="contador-vite"
      onClick={onIncrementar}
    >
      Count is {contador}
    </button>
  )
}

export default ContadorVite
