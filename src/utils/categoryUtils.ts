export function isOtherCategory(category) {
  return category.nome.localeCompare('Outros', 'pt-BR', { sensitivity: 'base' }) === 0
}

export function sortCategoriesByName(categories) {
  return [...categories].sort((a, b) => {
    const aIsOther = isOtherCategory(a)
    const bIsOther = isOtherCategory(b)

    if (aIsOther && !bIsOther) {
      return 1
    }

    if (!aIsOther && bIsOther) {
      return -1
    }

    return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  })
}

export function isCreditCardCategory(category) {
  return category.nome.localeCompare('Cartão de Crédito', 'pt-BR', {
    sensitivity: 'base',
  }) === 0
}
