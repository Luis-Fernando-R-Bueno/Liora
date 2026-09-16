import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  loadCategories,
  loadExpenses,
  saveCategories,
  saveExpenses,
} from '../servicos/storageService'
import { getCategoryColor } from '../utils/categoryColors'
import {
  compareExpensesByDate,
  getCurrentMonthKey,
  getMonthKey,
  toInputDate,
} from '../utils/dateUtils'
import { formatCurrency, fromCents, parseCurrencyInput, toCents } from '../utils/formatCurrency'

type Category = {
  id: string
  nome: string
  cor: string
  ativa: boolean
  createdAt?: string
}

type Expense = {
  id: string
  date: string
  categoryId: string
  value: number
  description: string
  createdAt: string
  updatedAt: string
}

type ExpenseWithCategory = Expense & {
  category: Category
}

type ExpenseInput = {
  date: string
  categoryId: string
  value: string | number
  description?: string
}

type ExpenseFilters = {
  search?: string
  categoryId?: string
  monthKey?: string
}

type SummaryItem = {
  id: string
  label: string
  color?: string
  total: number
  count: number
  percent: number
}

type HistoricalMonth = Omit<SummaryItem, 'percent' | 'color'> & {
  categories: Record<string, Omit<SummaryItem, 'percent'>>
  topCategory?: Omit<SummaryItem, 'percent'> | null
}

// Categoria de fallback para gastos cujo categoryId não existe mais (ex.:
// categoria excluída). Instância única e estável — evita recriar um objeto
// novo a cada renderização para cada gasto órfão.
const UNCATEGORIZED_CATEGORY: Category = {
  id: 'sem-categoria',
  nome: 'Sem categoria',
  cor: getCategoryColor('Sem categoria'),
  ativa: false,
}

// Arredonda percentuais de forma que a soma dê exatamente 100 (método dos
// maiores restos): arredonda todos para baixo e distribui os pontos que
// faltam para os itens com a maior parte fracionária descartada.
function distributeIntegerPercentages(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0)

  if (total <= 0) {
    return values.map(() => 0)
  }

  const exact = values.map((value) => (value / total) * 100)
  const base = exact.map((value) => Math.floor(value))
  const missingPoints = 100 - base.reduce((sum, value) => sum + value, 0)
  const byRemainderDesc = exact
    .map((value, index) => ({ index, remainder: value - base[index] }))
    .sort((a, b) => b.remainder - a.remainder)

  const result = [...base]

  for (let i = 0; i < missingPoints; i += 1) {
    result[byRemainderDesc[i % byRemainderDesc.length].index] += 1
  }

  return result
}

function createId(prefix: string) {
  const randomId = globalThis.crypto?.randomUUID?.()
  return randomId ? `${prefix}-${randomId}` : `${prefix}-${Date.now()}`
}

function normalizeText(value: unknown) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getExpenseDuplicateKey(expense: Partial<Expense>) {
  return JSON.stringify({
    categoryId: String(expense.categoryId ?? ''),
    date: String(expense.date ?? ''),
    description: String(expense.description ?? '').trim(),
    value: Number(expense.value) || 0,
  })
}

function extractImportRecords(data: Record<string, unknown> | unknown[]) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.expenses)) {
    return data.expenses
  }

  if (Array.isArray(data.registros)) {
    return data.registros
  }

  return []
}

function normalizeImportedExpense(expense: Record<string, unknown>): Expense | null {
  const date = String(expense.date ?? expense.data ?? '').slice(0, 10)
  const categoryId = String(expense.categoryId ?? expense.categoriaId ?? '')
  const value = parseCurrencyInput(expense.value ?? expense.valor)

  if (!date || !categoryId || !Number.isFinite(value) || value <= 0) {
    return null
  }

  const now = new Date().toISOString()
  const createdAt = expense.createdAt ? String(expense.createdAt) : now

  return {
    id: expense.id ? String(expense.id) : createId('gasto'),
    date,
    categoryId,
    value,
    description: String(expense.description ?? expense.descricao ?? '').trim(),
    createdAt,
    updatedAt: expense.updatedAt ? String(expense.updatedAt) : createdAt,
  }
}

// Os totais são acumulados em centavos (inteiros) e só convertidos de volta
// para reais no fim de cada agregação, evitando que a soma de muitos
// valores decimais em ponto flutuante gere diferenças de centavos no total
// exibido (ex.: 0.1 + 0.2 !== 0.3 em JavaScript).
function aggregateByCategory(expenses: ExpenseWithCategory[]) {
  const grouped = expenses.reduce((acc, expense) => {
    const key = expense.category.id

    if (!acc[key]) {
      acc[key] = {
        id: key,
        label: expense.category.nome,
        color: expense.category.cor,
        totalCents: 0,
        count: 0,
      }
    }

    acc[key].totalCents += toCents(expense.value)
    acc[key].count += 1
    return acc
  }, {} as Record<string, { id: string; label: string; color: string; totalCents: number; count: number }>)

  const items = Object.values(grouped)
  // Percentuais de categoria representam partes de um todo (o total do
  // período), então precisam somar exatamente 100.
  const percentages = distributeIntegerPercentages(items.map((item) => item.totalCents))

  return items
    .map((item, index) => ({
      id: item.id,
      label: item.label,
      color: item.color,
      count: item.count,
      total: fromCents(item.totalCents),
      percent: percentages[index],
    }))
    .sort((a, b) => b.total - a.total)
}

function aggregateByMonth(expenses: ExpenseWithCategory[]) {
  const grouped = expenses.reduce((acc, expense) => {
    const monthKey = getMonthKey(expense.date)

    if (!acc[monthKey]) {
      acc[monthKey] = {
        id: monthKey,
        label: monthKey,
        totalCents: 0,
        count: 0,
      }
    }

    acc[monthKey].totalCents += toCents(expense.value)
    acc[monthKey].count += 1
    return acc
  }, {} as Record<string, { id: string; label: string; totalCents: number; count: number }>)

  const groupedMonths = Object.values(grouped)
  const highestTotalCents = Math.max(...groupedMonths.map((item) => item.totalCents), 0)

  // Aqui o percentual é relativo ao maior mês (para a largura da barra no
  // "Resumo por mês"), não uma fatia de um total — não faz sentido somar
  // 100, então o arredondamento simples é suficiente.
  return groupedMonths
    .map((item) => ({
      id: item.id,
      label: item.label,
      count: item.count,
      total: fromCents(item.totalCents),
      percent:
        highestTotalCents > 0 ? Math.round((item.totalCents / highestTotalCents) * 100) : 0,
    }))
    .sort((a, b) => String(b.id).localeCompare(String(a.id)))
}

function aggregateHistoricalMonths(expenses: ExpenseWithCategory[]) {
  const currentMonthKey = getCurrentMonthKey()
  const grouped = expenses.reduce((acc, expense) => {
    const monthKey = getMonthKey(expense.date)

    if (!monthKey || monthKey >= currentMonthKey) {
      return acc
    }

    if (!acc[monthKey]) {
      acc[monthKey] = {
        id: monthKey,
        label: monthKey,
        totalCents: 0,
        count: 0,
        categories: {},
      }
    }

    const categoryId = expense.category.id
    const expenseCents = toCents(expense.value)

    acc[monthKey].totalCents += expenseCents
    acc[monthKey].count += 1

    if (!acc[monthKey].categories[categoryId]) {
      acc[monthKey].categories[categoryId] = {
        id: categoryId,
        label: expense.category.nome,
        color: expense.category.cor,
        totalCents: 0,
        count: 0,
      }
    }

    acc[monthKey].categories[categoryId].totalCents += expenseCents
    acc[monthKey].categories[categoryId].count += 1

    return acc
  }, {} as Record<
    string,
    {
      id: string
      label: string
      totalCents: number
      count: number
      categories: Record<string, { id: string; label: string; color: string; totalCents: number; count: number }>
    }
  >)

  return Object.values(grouped)
    .map((month) => {
      const categories = Object.entries(month.categories).reduce(
        (acc, [categoryId, category]) => {
          acc[categoryId] = {
            id: category.id,
            label: category.label,
            color: category.color,
            count: category.count,
            total: fromCents(category.totalCents),
          }
          return acc
        },
        {} as HistoricalMonth['categories'],
      )

      return {
        id: month.id,
        label: month.label,
        count: month.count,
        total: fromCents(month.totalCents),
        categories,
        topCategory: Object.values(categories).sort((a, b) => b.total - a.total)[0] ?? null,
      }
    })
    .sort((a, b) => String(b.id).localeCompare(String(a.id)))
}

const STORAGE_ERROR_MESSAGE =
  'Não foi possível salvar os dados neste navegador. O espaço de armazenamento pode estar cheio ou indisponível (ex.: modo de navegação privada) — suas últimas alterações podem não ter sido salvas.'

export function useControleGastos(dashboardMonthKey = getCurrentMonthKey()) {
  const [categories, setCategories] = useState<Category[]>(loadCategories)
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    const success = saveCategories(categories)
    // Adiado para fora do corpo síncrono do efeito: o próprio efeito já
    // sincroniza `categories` com o localStorage (um sistema externo); o
    // aviso de falha é uma reação a esse resultado, não parte da mesma
    // sincronização.
    queueMicrotask(() => setStorageError(success ? '' : STORAGE_ERROR_MESSAGE))
  }, [categories])

  useEffect(() => {
    const success = saveExpenses(expenses)
    queueMicrotask(() => setStorageError(success ? '' : STORAGE_ERROR_MESSAGE))
  }, [expenses])

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )

  const expensesWithCategory = useMemo(
    () =>
      expenses
        .map((expense) => ({
          ...expense,
          category: categoryMap.get(expense.categoryId) ?? UNCATEGORIZED_CATEGORY,
        }))
        .sort(compareExpensesByDate),
    [categoryMap, expenses],
  )

  const dashboard = useMemo(() => {
    const selectedMonth = dashboardMonthKey || getCurrentMonthKey()
    const today = toInputDate()
    const currentMonthExpenses = expensesWithCategory.filter(
      (expense) => getMonthKey(expense.date) === selectedMonth,
    )
    const recentExpenses = expensesWithCategory.filter(
      (expense) =>
        getMonthKey(expense.date) === selectedMonth && String(expense.date) <= today,
    )
    const categorySummary = aggregateByCategory(currentMonthExpenses)
    const allMonthSummary = aggregateByMonth(expensesWithCategory)
    // A média considera apenas meses já encerrados: o mês corrente está
    // incompleto e gastos com data futura ainda não aconteceram, então
    // incluí-los distorceria a média para baixo ou para cima.
    const closedMonthsSummary = allMonthSummary.filter(
      (item) => item.id < getCurrentMonthKey(),
    )
    const averageMonthlyTotal =
      closedMonthsSummary.length > 0
        ? fromCents(
            Math.round(
              closedMonthsSummary.reduce((sum, item) => sum + toCents(item.total), 0) /
                closedMonthsSummary.length,
            ),
          )
        : 0
    const monthSummary = allMonthSummary.slice(0, 8)
    const totalMonth = fromCents(
      currentMonthExpenses.reduce((sum, expense) => sum + toCents(expense.value), 0),
    )

    return {
      totalMonth,
      countMonth: currentMonthExpenses.length,
      averageMonthlyTotal,
      topCategory: categorySummary[0] ?? null,
      recentExpenses: recentExpenses.slice(0, 5),
      categorySummary,
      monthSummary,
      selectedMonth,
    }
  }, [dashboardMonthKey, expensesWithCategory])

  const historicalMonths = useMemo(
    () => aggregateHistoricalMonths(expensesWithCategory),
    [expensesWithCategory],
  )

  const addExpense = useCallback((expenseData: ExpenseInput) => {
    const value = fromCents(toCents(parseCurrencyInput(expenseData.value)))

    if (!expenseData.date || !expenseData.categoryId || !Number.isFinite(value) || value <= 0) {
      return false
    }

    const now = new Date().toISOString()
    const newExpense = {
      id: createId('gasto'),
      date: expenseData.date,
      categoryId: expenseData.categoryId,
      value,
      description: String(expenseData.description ?? '').trim(),
      createdAt: now,
      updatedAt: now,
    }

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses])
    return true
  }, [])

  const updateExpense = useCallback((expenseId: string, expenseData: ExpenseInput) => {
    const value = fromCents(toCents(parseCurrencyInput(expenseData.value)))

    if (!expenseData.date || !expenseData.categoryId || !Number.isFinite(value) || value <= 0) {
      return false
    }

    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              date: expenseData.date,
              categoryId: expenseData.categoryId,
              value,
              description: String(expenseData.description ?? '').trim(),
              updatedAt: new Date().toISOString(),
            }
          : expense,
      ),
    )
    return true
  }, [])

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== expenseId),
    )
  }, [])

  const exportRecords = useCallback(
    () => ({
      exportedAt: new Date().toISOString(),
      categories: categories.map((category) => ({ id: category.id, nome: category.nome })),
      expenses,
      recordsCount: expenses.length,
      type: 'controle-gastos-registros',
      version: 1,
    }),
    [categories, expenses],
  )

  const importRecords = useCallback((data: unknown) => {
    const records = extractImportRecords(data as Record<string, unknown> | unknown[])
    // O id de categoria é local a cada instalação (não é portável entre
    // dispositivos). Por isso a importação resolve a categoria de cada
    // gasto pelo nome — presente no arquivo através da lista `categories`
    // exportada junto dos registros — criando a categoria no destino
    // quando ela ainda não existir, em vez de perder a categorização.
    const rawImportedCategories: unknown[] = Array.isArray((data as { categories?: unknown })?.categories)
      ? ((data as { categories: unknown[] }).categories)
      : []
    const importedCategoryNames = new Map<string, string>()

    rawImportedCategories.forEach((rawCategory) => {
      const category = rawCategory as Record<string, unknown>
      importedCategoryNames.set(
        String(category?.id ?? ''),
        String(category?.nome ?? category?.name ?? '').trim(),
      )
    })

    let workingCategories = categories
    const categoryIdByName = new Map<string, string>(
      workingCategories.map((category) => [normalizeText(category.nome), category.id]),
    )

    function resolveCategoryId(rawCategoryId: unknown): string {
      const importedName = importedCategoryNames.get(String(rawCategoryId ?? ''))

      if (!importedName) {
        return String(rawCategoryId ?? '')
      }

      const normalizedName = normalizeText(importedName)
      const existingId = categoryIdByName.get(normalizedName)

      if (existingId) {
        return existingId
      }

      const newCategory = {
        id: createId('categoria'),
        nome: importedName,
        cor: getCategoryColor(importedName, workingCategories.length),
        ativa: true,
        createdAt: new Date().toISOString(),
      }

      workingCategories = [...workingCategories, newCategory]
      categoryIdByName.set(normalizedName, newCategory.id)
      return newCategory.id
    }

    const existingKeys = new Set(expenses.map(getExpenseDuplicateKey))
    const importedExpenses = []
    let invalidCount = 0
    let skippedCount = 0

    records.forEach((record) => {
      const rawCategoryId = record?.categoryId ?? record?.categoriaId
      const normalizedExpense = normalizeImportedExpense({
        ...record,
        categoryId: resolveCategoryId(rawCategoryId),
      })

      if (!normalizedExpense) {
        invalidCount += 1
        return
      }

      const duplicateKey = getExpenseDuplicateKey(normalizedExpense)

      if (existingKeys.has(duplicateKey)) {
        skippedCount += 1
        return
      }

      existingKeys.add(duplicateKey)
      importedExpenses.push(normalizedExpense)
    })

    if (workingCategories !== categories) {
      setCategories(workingCategories)
    }

    if (importedExpenses.length > 0) {
      setExpenses((currentExpenses) => [...importedExpenses, ...currentExpenses])
    }

    return {
      importedCount: importedExpenses.length,
      invalidCount,
      skippedCount,
      totalCount: records.length,
    }
  }, [categories, expenses])

  const addCategory = useCallback((categoryName: string) => {
    const cleanName = categoryName.trim()

    if (!cleanName) {
      return false
    }

    const exists = categories.some(
      (category) => normalizeText(category.nome) === normalizeText(cleanName),
    )

    if (exists) {
      return false
    }

    setCategories((currentCategories) => [
      ...currentCategories,
      {
        id: createId('categoria'),
        nome: cleanName,
        cor: getCategoryColor(cleanName, currentCategories.length),
        ativa: true,
        createdAt: new Date().toISOString(),
      },
    ])

    return true
  }, [categories])

  const updateCategory = useCallback((categoryId: string, categoryName: string) => {
    const cleanName = categoryName.trim()

    if (!cleanName) {
      return false
    }

    const exists = categories.some(
      (category) =>
        category.id !== categoryId && normalizeText(category.nome) === normalizeText(cleanName),
    )

    if (exists) {
      return false
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId
          ? { ...category, nome: cleanName, cor: getCategoryColor(cleanName) }
          : category,
      ),
    )

    return true
  }, [categories])

  const toggleCategoryStatus = useCallback((categoryId: string) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId ? { ...category, ativa: !category.ativa } : category,
      ),
    )
  }, [])

  const removeCategory = useCallback((categoryId: string) => {
    const categoryIsUsed = expenses.some((expense) => expense.categoryId === categoryId)

    if (categoryIsUsed) {
      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === categoryId ? { ...category, ativa: false } : category,
        ),
      )
      return 'inactive'
    }

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== categoryId),
    )
    return 'removed'
  }, [expenses])

  const filterExpenses = useCallback(
    ({ search = '', categoryId = 'todos', monthKey = '' }: ExpenseFilters) => {
      const normalizedSearch = normalizeText(search)

      return expensesWithCategory.filter((expense) => {
        const matchesCategory = categoryId === 'todos' || expense.categoryId === categoryId
        const matchesMonth = !monthKey || getMonthKey(expense.date) === monthKey
        const searchableText = normalizeText(
          [
            expense.description,
            expense.category.nome,
            expense.value,
            formatCurrency(expense.value),
          ].join(' '),
        )
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)

        return matchesCategory && matchesMonth && matchesSearch
      })
    },
    [expensesWithCategory],
  )

  return {
    categories,
    expenses: expensesWithCategory,
    dashboard,
    historicalMonths,
    storageError,
    addExpense,
    updateExpense,
    deleteExpense,
    exportRecords,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    removeCategory,
    filterExpenses,
    importRecords,
  }
}
