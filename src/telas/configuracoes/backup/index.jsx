import { ArrowLeft, Download, FileJson, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { downloadRecordsFile } from '../../../utils/recordsFile'
import '../styles.css'
import './styles.css'

function ConfiguracoesBackup({ onBack, onExportRecords, onImportRecords }) {
  const fileInputRef = useRef(null)
  const [feedback, setFeedback] = useState(null)

  function handleExport() {
    downloadRecordsFile(onExportRecords())
    setFeedback({
      type: 'success',
      title: 'Backup exportado',
      details: ['Arquivo JSON criado com seus registros locais'],
    })
  }

  async function handleImport(event) {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const result = onImportRecords(data)

      setFeedback({
        type: 'success',
        title: 'Backup importado',
        details: [
          `${result.importedCount} importados`,
          `${result.skippedCount} duplicados ignorados`,
          `${result.invalidCount} inválidos`,
        ],
      })
    } catch {
      setFeedback({
        type: 'error',
        title: 'Arquivo inválido',
        details: ['Use um JSON exportado pela Liora.'],
      })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="configuracoes-subpagina backup-config" aria-label="Backup">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section backup-config__panel">
        <div className="backup-config__icon" aria-hidden="true">
          <FileJson size={32} />
        </div>

        <div className="configuracoes__conteudo backup-config__content">
          <h2>Arquivos locais</h2>
          <p>
            O backup gera um arquivo JSON com os gastos cadastrados. Na importação,
            registros idênticos aos existentes são ignorados automaticamente.
          </p>
        </div>

        <div className="configuracoes__acoes backup-config__actions">
          <button className="button button--ghost" type="button" onClick={handleExport}>
            <Download size={18} aria-hidden="true" />
            Exportar registros
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} aria-hidden="true" />
            Importar arquivo
          </button>
        </div>

        {feedback ? (
          <div className={`backup-config__feedback backup-config__feedback--${feedback.type}`}>
            <strong>{feedback.title}</strong>
            <span>{feedback.details.join(', ')}.</span>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
        />
      </section>
    </section>
  )
}

export default ConfiguracoesBackup
