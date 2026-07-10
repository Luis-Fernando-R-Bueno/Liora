import { Download } from 'lucide-react'
import { useState } from 'react'
import { downloadRecordsFile } from '../../../utils/recordsFile'
import './styles.css'

function ExpenseDataActions({ onExportRecords }) {
  const [feedback, setFeedback] = useState('')

  function handleExport() {
    downloadRecordsFile(onExportRecords())
    setFeedback('Registros exportados.')
  }

  return (
    <section className="expense-data-actions" aria-label="Exportar registros">
      <div className="expense-data-actions__buttons">
        <button className="button button--ghost" type="button" onClick={handleExport}>
          <Download size={17} aria-hidden="true" />
          Exportar registros
        </button>
      </div>

      {feedback ? <p className="expense-data-actions__feedback">{feedback}</p> : null}
    </section>
  )
}

export default ExpenseDataActions
