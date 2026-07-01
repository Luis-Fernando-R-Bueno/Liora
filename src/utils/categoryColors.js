export const categoryColors = {
  'Cartão de Crédito': 'var(--category-credit-card)',
  Alimentação: 'var(--category-food)',
  Transporte: 'var(--category-transport)',
  'Corrida/Esportes': 'var(--category-sports)',
  Lazer: 'var(--category-leisure)',
  Dízimo: 'var(--category-tithe)',
  Presentes: 'var(--category-gifts)',
  Itens: 'var(--category-items)',
  Outros: 'var(--category-other)',
  Estética: 'var(--category-beauty)',
  'Sem categoria': 'var(--category-uncategorized)',
}

const fallbackCategoryColors = [
  'var(--category-fallback-sage)',
  'var(--category-fallback-rose)',
  'var(--category-fallback-clay)',
  'var(--category-fallback-green)',
  'var(--category-fallback-lilac)',
  'var(--category-fallback-amber)',
  'var(--category-fallback-caramel)',
  'var(--category-fallback-mint)',
]

function normalizeCategoryColorKey(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function hashCategoryName(name) {
  return normalizeCategoryColorKey(name)
    .split('')
    .reduce((hash, char) => hash + char.charCodeAt(0), 0)
}

const normalizedCategoryColors = Object.entries(categoryColors).reduce(
  (acc, [name, color]) => ({
    ...acc,
    [normalizeCategoryColorKey(name)]: color,
  }),
  {},
)

export function getCategoryColor(name, fallbackIndex = 0) {
  const normalizedName = normalizeCategoryColorKey(name)
  const mappedColor = normalizedCategoryColors[normalizedName]

  if (mappedColor) {
    return mappedColor
  }

  const colorIndex =
    normalizedName.length > 0
      ? hashCategoryName(normalizedName) % fallbackCategoryColors.length
      : fallbackIndex % fallbackCategoryColors.length

  return fallbackCategoryColors[colorIndex]
}
