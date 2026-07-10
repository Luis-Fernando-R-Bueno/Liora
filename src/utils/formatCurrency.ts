export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) || 0)
}

export function parseCurrencyInput(value) {
  if (typeof value === 'number') {
    return value
  }

  const rawValue = String(value).trim()
  const normalizedValue = rawValue.includes(',')
    ? rawValue.replace(/\./g, '').replace(',', '.')
    : rawValue

  return Number(normalizedValue)
}
