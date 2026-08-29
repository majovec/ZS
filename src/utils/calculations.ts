import { Transaction, Category, CategoryType } from '@/models/types'

// Spočítej celkový příjem za období
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
}

// Spočítej celkový výdaj za období
export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
}

// Výdaje po kategoriích
export const calculateExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[]
): Record<string, number> => {
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const result: Record<string, number> = {}

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const category = categoryMap.get(tx.categoryId)
      const categoryName = category?.name || 'Ostatní'
      result[categoryName] = (result[categoryName] || 0) + tx.amount
    })

  return result
}

// Výdaje po kategorii typu
export const calculateExpensesByType = (
  transactions: Transaction[],
  categories: Category[]
): Record<CategoryType, number> => {
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const result: Record<CategoryType, number> = {
    [CategoryType.INCOME]: 0,
    [CategoryType.FIXED]: 0,
    [CategoryType.VARIABLE]: 0,
    [CategoryType.UNEXPECTED]: 0,
  }

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const category = categoryMap.get(tx.categoryId)
      if (category) {
        result[category.type] = (result[category.type] || 0) + tx.amount
      }
    })

  return result
}

// Měsíční trend
export const calculateMonthlyTrend = (
  transactions: Transaction[]
): Record<string, { income: number; expense: number }> => {
  const result: Record<string, { income: number; expense: number }> = {}

  transactions.forEach((tx) => {
    const month = tx.date.toISOString().slice(0, 7)
    if (!result[month]) {
      result[month] = { income: 0, expense: 0 }
    }

    if (tx.type === 'income') {
      result[month].income += tx.amount
    } else {
      result[month].expense += tx.amount
    }
  })

  return result
}

// Průměrný měsíční výdaj
export const calculateAverageMonthlyExpense = (transactions: Transaction[]): number => {
  const trend = calculateMonthlyTrend(transactions)
  const months = Object.values(trend)
  if (months.length === 0) return 0
  const totalExpense = months.reduce((sum, m) => sum + m.expense, 0)
  return totalExpense / months.length
}

// Získej transakce pro měsíc
export const getTransactionsForMonth = (
  transactions: Transaction[],
  yearMonth: string
): Transaction[] => {
  return transactions.filter((tx) => tx.date.toISOString().slice(0, 7) === yearMonth)
}

// Nejlepší výdajová kategorie (top spender)
export const getTopExpenseCategory = (
  transactions: Transaction[],
  categories: Category[]
): { category: Category | null; amount: number } => {
  const expenses = calculateExpensesByCategory(transactions, categories)
  const categoryMap = new Map(categories.map((c) => [c.name, c]))

  let topCategory = null
  let topAmount = 0

  Object.entries(expenses).forEach(([categoryName, amount]) => {
    if (amount > topAmount) {
      topAmount = amount
      topCategory = categoryMap.get(categoryName) || null
    }
  })

  return { category: topCategory, amount: topAmount }
}

// Detekuj anomálie ve výdajích
export const detectAnomalies = (
  transactions: Transaction[]
): Transaction[] => {
  const expenses = transactions.filter((tx) => tx.type === 'expense')
  const amounts = expenses.map((tx) => tx.amount)
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
  const stdDev = Math.sqrt(
    amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length
  )

  return expenses.filter((tx) => Math.abs(tx.amount - avg) > 2 * stdDev)
}
