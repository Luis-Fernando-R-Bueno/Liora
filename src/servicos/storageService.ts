import { getCategoryColor } from '../utils/categoryColors'

const STORAGE_KEYS = {
  categories: 'controle-gastos:categories',
  categoryDefaultsVersion: 'controle-gastos:category-defaults-version',
  expenses: 'controle-gastos:expenses',
}

const CATEGORY_DEFAULTS_VERSION = 2
const SIMULATION_DESCRIPTION_PREFIX = 'Simulação -'

export const DEFAULT_CATEGORIES = [
  'Cartão de Crédito',
  'Alimentação',
  'Transporte',
  'Corrida/Esportes',
  'Lazer',
  'Dízimo',
  'Presentes',
  'Itens',
  'Outros',
  'Estética',
].map((name, index) => ({
  id: `categoria-${index + 1}`,
  nome: name,
  cor: getCategoryColor(name, index),
  ativa: true,
  createdAt: new Date().toISOString(),
}))

function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function normalizeCategoryName(name) {
  const names = {
    Alimentacao: 'Alimentação',
    'Cartao de Credito': 'Cartão de Crédito',
    Dizimo: 'Dízimo',
  }

  return names[name] ?? name
}

function normalizeCategoryKey(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function applyCategoryDefaultMigrations(categories) {
  const currentVersion = Number(readStorage(STORAGE_KEYS.categoryDefaultsVersion, 0)) || 0

  if (currentVersion >= CATEGORY_DEFAULTS_VERSION) {
    return categories
  }

  const existingNames = new Set(
    categories.map((category) => normalizeCategoryKey(category.nome)),
  )
  const existingIds = new Set(categories.map((category) => category.id))
  const categoriesToAdd = DEFAULT_CATEGORIES.filter(
    (category) =>
      category.nome === 'Estética' && !existingNames.has(normalizeCategoryKey(category.nome)),
  ).map((category) => ({
    ...category,
    id: existingIds.has(category.id) ? 'categoria-padrao-estetica' : category.id,
    createdAt: new Date().toISOString(),
  }))

  writeStorage(STORAGE_KEYS.categoryDefaultsVersion, CATEGORY_DEFAULTS_VERSION)
  return [...categories, ...categoriesToAdd]
}

export function loadCategories() {
  const storedCategories = readStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)

  if (!Array.isArray(storedCategories) || storedCategories.length === 0) {
    writeStorage(STORAGE_KEYS.categoryDefaultsVersion, CATEGORY_DEFAULTS_VERSION)
    return DEFAULT_CATEGORIES
  }

  const categories = storedCategories.map((category, index) => {
    const nome = normalizeCategoryName(category.nome ?? 'Categoria')

    return {
      id: category.id ?? `categoria-${index + 1}`,
      nome,
      cor: getCategoryColor(nome, index),
      ativa: category.ativa !== false,
      createdAt: category.createdAt ?? new Date().toISOString(),
    }
  })

  return applyCategoryDefaultMigrations(categories)
}

export function saveCategories(categories) {
  writeStorage(STORAGE_KEYS.categories, categories)
}

export function loadExpenses() {
  const storedExpenses = readStorage(STORAGE_KEYS.expenses, [])

  if (!Array.isArray(storedExpenses)) {
    return []
  }

  return storedExpenses
    .map((expense) => ({
      id: expense.id,
      date: expense.date,
      categoryId: expense.categoryId,
      value: Number(expense.value) || 0,
      description: expense.description ?? '',
      createdAt: expense.createdAt ?? new Date().toISOString(),
      updatedAt: expense.updatedAt ?? expense.createdAt ?? new Date().toISOString(),
    }))
    .filter(
      (expense) =>
        !String(expense.description).startsWith(SIMULATION_DESCRIPTION_PREFIX),
    )
}

export function saveExpenses(expenses) {
  writeStorage(STORAGE_KEYS.expenses, expenses)
}
