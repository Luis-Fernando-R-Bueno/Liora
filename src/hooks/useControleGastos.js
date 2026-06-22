import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_COLORS,
  loadCategories,
  loadExpenses,
  saveCategories,
  saveExpenses,
} from '../servicos/storageService'
import {
  compareExpensesByDate,
  getCurrentMonthKey,
  getMonthKey,
  toInputDate,
} from '../utils/dateUtils'
import { formatCurrency, parseCurrencyInput } from '../utils/formatCurrency'

function createId(prefix) {
  const randomId = globalThis.crypto?.randomUUID?.()
  return randomId ? `${prefix}-${randomId}` : `${prefix}-${Date.now()}`
}

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function aggregateByCategory(expenses) {
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
  }, {})

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percent: total > 0 ? Math.round((item.total / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

function aggregateByMonth(expenses) {
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
  }, {})

  const highestTotal = Math.max(...Object.values(grouped).map((item) => item.total), 0)

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percent: highestTotal > 0 ? Math.round((item.total / highestTotal) * 100) : 0,
    }))
    .sort((a, b) => String(b.id).localeCompare(String(a.id)))
}

export function useControleGastos(dashboardMonthKey = getCurrentMonthKey()) {
  const [categories, setCategories] = useState(loadCategories)
  const [expenses, setExpenses] = useState(loadExpenses)

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
            cor: '#64748b',
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
    const monthSummary = aggregateByMonth(expensesWithCategory).slice(0, 8)
    const totalMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.value, 0)

    return {
      totalMonth,
      countMonth: currentMonthExpenses.length,
      topCategory: categorySummary[0] ?? null,
      recentExpenses: recentExpenses.slice(0, 5),
      categorySummary,
      monthSummary,
      selectedMonth,
    }
  }, [dashboardMonthKey, expensesWithCategory])

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
        cor: CATEGORY_COLORS[currentCategories.length % CATEGORY_COLORS.length],
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
        category.id === categoryId ? { ...category, nome: cleanName } : category,
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
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    removeCategory,
    filterExpenses,
  }
}
