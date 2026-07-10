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
import { formatCurrency, parseCurrencyInput } from '../utils/formatCurrency'

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

function aggregateByCategory(expenses: ExpenseWithCategory[]) {
  const total = expenses.reduce((sum, expense) => sum + expense.value, 0)
  const grouped = expenses.reduce((acc, expense) => {
    const key = expense.category.id

    if (!acc[key]) {
      acc[key] = {
        id: key,
        label: expense.category.nome,
        color: expense.category.cor,
        total: 0,
        count: 0,
      }
    }

    acc[key].total += expense.value
    acc[key].count += 1
    return acc
  }, {} as Record<string, Omit<SummaryItem, 'percent'>>)

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percent: total > 0 ? Math.round((item.total / total) * 100) : 0,
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
        total: 0,
        count: 0,
      }
    }

    acc[monthKey].total += expense.value
    acc[monthKey].count += 1
    return acc
  }, {} as Record<string, Omit<SummaryItem, 'percent' | 'color'>>)

  const groupedMonths = Object.values(grouped)
  const highestTotal = Math.max(...groupedMonths.map((item) => item.total), 0)

  return groupedMonths
    .map((item) => ({
      ...item,
      percent: highestTotal > 0 ? Math.round((item.total / highestTotal) * 100) : 0,
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
        total: 0,
        count: 0,
        categories: {},
      }
    }

    const categoryId = expense.category.id

    acc[monthKey].total += expense.value
    acc[monthKey].count += 1

    if (!acc[monthKey].categories[categoryId]) {
      acc[monthKey].categories[categoryId] = {
        id: categoryId,
        label: expense.category.nome,
        color: expense.category.cor,
        total: 0,
        count: 0,
      }
    }

    acc[monthKey].categories[categoryId].total += expense.value
    acc[monthKey].categories[categoryId].count += 1

    return acc
  }, {} as Record<string, HistoricalMonth>)

  return Object.values(grouped)
    .map((month) => ({
      ...month,
      topCategory:
        Object.values(month.categories).sort((a, b) => b.total - a.total)[0] ??
        null,
    }))
    .sort((a, b) => String(b.id).localeCompare(String(a.id)))
}

export function useControleGastos(dashboardMonthKey = getCurrentMonthKey()) {
  const [categories, setCategories] = useState<Category[]>(loadCategories)
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    saveExpenses(expenses)
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
          category: categoryMap.get(expense.categoryId) ?? {
            id: 'sem-categoria',
            nome: 'Sem categoria',
            cor: getCategoryColor('Sem categoria'),
            ativa: false,
          },
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
    const averageMonthlyTotal =
      allMonthSummary.length > 0
        ? allMonthSummary.reduce((sum, item) => sum + item.total, 0) /
          allMonthSummary.length
        : 0
    const monthSummary = allMonthSummary.slice(0, 8)
    const totalMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.value, 0)

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

  const addExpense = useCallback((expenseData) => {
    const now = new Date().toISOString()
    const newExpense = {
      id: createId('gasto'),
      date: expenseData.date,
      categoryId: expenseData.categoryId,
      value: parseCurrencyInput(expenseData.value),
      description: expenseData.description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses])
  }, [])

  const updateExpense = useCallback((expenseId, expenseData) => {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              date: expenseData.date,
              categoryId: expenseData.categoryId,
              value: parseCurrencyInput(expenseData.value),
              description: expenseData.description.trim(),
              updatedAt: new Date().toISOString(),
            }
          : expense,
      ),
    )
  }, [])

  const deleteExpense = useCallback((expenseId) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== expenseId),
    )
  }, [])

  const exportRecords = useCallback(
    () => ({
      exportedAt: new Date().toISOString(),
      expenses,
      recordsCount: expenses.length,
      type: 'controle-gastos-registros',
      version: 1,
    }),
    [expenses],
  )

  const importRecords = useCallback((data) => {
    const records = extractImportRecords(data)
    const existingKeys = new Set(expenses.map(getExpenseDuplicateKey))
    const importedExpenses = []
    let invalidCount = 0
    let skippedCount = 0

    records.forEach((record) => {
      const normalizedExpense = normalizeImportedExpense(record)

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

    if (importedExpenses.length > 0) {
      setExpenses((currentExpenses) => [...importedExpenses, ...currentExpenses])
    }

    return {
      importedCount: importedExpenses.length,
      invalidCount,
      skippedCount,
      totalCount: records.length,
    }
  }, [expenses])

  const addCategory = useCallback((categoryName) => {
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

  const updateCategory = useCallback((categoryId, categoryName) => {
    const cleanName = categoryName.trim()

    if (!cleanName) {
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
  }, [])

  const toggleCategoryStatus = useCallback((categoryId) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId ? { ...category, ativa: !category.ativa } : category,
      ),
    )
  }, [])

  const removeCategory = useCallback((categoryId) => {
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
    ({ search = '', categoryId = 'todos', monthKey = '' }) => {
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
