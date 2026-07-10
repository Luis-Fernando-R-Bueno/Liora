import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import './styles.css'

function ConfirmDialog({
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  isOpen,
  message,
  onCancel,
  onConfirm,
  title,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) {
    return null
  }

  return (
    <div className="confirm-dialog" role="presentation">
      <div className="confirm-dialog__backdrop" onClick={onCancel} />
      <section
        className="confirm-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="confirm-dialog__icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </div>

        <div className="confirm-dialog__content">
          <h2 id="confirm-dialog-title">{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirm-dialog__actions">
          <button className="button button--ghost" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="button confirm-dialog__confirm" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
