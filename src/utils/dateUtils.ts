const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function padDatePart(value) {
  return String(value).padStart(2, '0')
}

export function toInputDate(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

export function getCurrentMonthKey() {
  const today = new Date()
  return `${today.getFullYear()}-${padDatePart(today.getMonth() + 1)}`
}

export function getMonthKey(dateValue) {
  if (!dateValue) {
    return ''
  }

  return String(dateValue).slice(0, 7)
}

export function formatDate(dateValue) {
  if (!dateValue) {
    return '-'
  }

  const [year, month, day] = String(dateValue).split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatMonthLabel(monthKey) {
  if (!monthKey) {
    return 'Sem mês'
  }

  const [year, month] = monthKey.split('-')
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`
}

export function compareExpensesByDate(a, b) {
  const dateDiff = String(b.date).localeCompare(String(a.date))

  if (dateDiff !== 0) {
    return dateDiff
  }

  return String(b.createdAt).localeCompare(String(a.createdAt))
}
