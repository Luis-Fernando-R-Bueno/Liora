export function getExportFileName() {
  const today = new Date()
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  return `controle-gastos-registros-${date}.json`
}

export function downloadRecordsFile(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = getExportFileName()
  link.click()
  URL.revokeObjectURL(url)
}
