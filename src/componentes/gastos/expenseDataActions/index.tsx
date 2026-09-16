import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { downloadRecordsFile } from '../../../utils/recordsFile'
import './styles.css'

function ExpenseDataActions({ onExportRecords, onImportRecords }) {
  const fileInputRef = useRef(null)
  const [feedback, setFeedback] = useState('')
  const [isError, setIsError] = useState(false)

  function handleExport() {
    downloadRecordsFile(onExportRecords())
    setIsError(false)
    setFeedback('Registros exportados.')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        const result = onImportRecords(data)

        if (result.totalCount === 0) {
          setIsError(true)
          setFeedback('Nenhum registro encontrado nesse arquivo.')
          return
        }

        setIsError(false)
        setFeedback(
          `${result.importedCount} importado(s), ${result.skippedCount} duplicado(s) ignorado(s), ${result.invalidCount} inválido(s).`,
        )
      } catch {
        setIsError(true)
        setFeedback('Não foi possível ler o arquivo. Verifique se é um backup válido.')
      }
    }

    reader.onerror = () => {
      setIsError(true)
      setFeedback('Não foi possível ler o arquivo selecionado.')
    }

    reader.readAsText(file)
  }

  return (
    <section className="expense-data-actions" aria-label="Backup de registros">
      <div className="expense-data-actions__buttons">
        <button className="button button--ghost" type="button" onClick={handleExport}>
          <Download size={17} aria-hidden="true" />
          Exportar registros
        </button>
        <button className="button button--ghost" type="button" onClick={handleImportClick}>
          <Upload size={17} aria-hidden="true" />
          Importar registros
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImportFile}
        />
      </div>

      {feedback ? (
        <p
          className={
            isError
              ? 'expense-data-actions__feedback expense-data-actions__feedback--error'
              : 'expense-data-actions__feedback'
          }
        >
          {feedback}
        </p>
      ) : null}
    </section>
  )
}

export default ExpenseDataActions
