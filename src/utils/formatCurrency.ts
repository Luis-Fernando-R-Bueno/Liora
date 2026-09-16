export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) || 0)
}

// Valor decimal com ponto (ex.: "86.5"), como o que sai de um
// <input type="number">. Não deve receber texto com separador de milhar.
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

// Texto no formato brasileiro (ex.: "3.500" ou "3.500,00"), onde o ponto é
// sempre separador de milhar e a vírgula é sempre o separador decimal.
// Use para campos de texto formatados manualmente (ex.: salário), nunca
// para o valor bruto de um <input type="number">.
export function parseLocalizedCurrencyInput(value) {
  if (typeof value === 'number') {
    return value
  }

  const normalizedValue = String(value).trim().replace(/\./g, '').replace(',', '.')

  return Number(normalizedValue)
}

export function toCents(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? Math.round(numericValue * 100) : 0
}

export function fromCents(cents) {
  return cents / 100
}
