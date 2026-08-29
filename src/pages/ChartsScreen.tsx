import React, { useMemo, useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/Card'

interface ChartsScreenProps {
  onNavigate?: (page: string) => void
}

const ChartsScreen: React.FC<ChartsScreenProps> = () => {
  const transactions = useAppStore((state) => state.transactions)
  const categories = useAppStore((state) => state.categories)
  const [currentMonth] = useState(new Date().toISOString().slice(0, 7))

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const monthlyTrend = useMemo(() => {
    const last6Months: Record<string, { income: number; expense: number }> = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7)
      last6Months[monthKey] = { income: 0, expense: 0 }
    }

    transactions.forEach((tx) => {
      const monthKey = tx.date.toISOString().slice(0, 7)
      if (last6Months[monthKey]) {
        if (tx.type === 'income') {
          last6Months[monthKey].income += tx.amount
        } else {
          last6Months[monthKey].expense += tx.amount
        }
      }
    })

    return Object.entries(last6Months).map(([month, data]) => ({
      month: month.slice(5),
      income: Math.round(data.income),
      expense: Math.round(data.expense),
    }))
  }, [transactions])

  const categoryExpenses = useMemo(() => {
    const currentMonthStr = currentMonth || new Date().toISOString().slice(0, 7)
    const expenses: Record<string, number> = {}

    transactions.forEach((tx) => {
      const txMonth = tx.date.toISOString().slice(0, 7)
      if (txMonth === currentMonthStr && tx.type === 'expense') {
        const categoryName = categoryMap.get(tx.categoryId)?.name || 'Ostatní'
        expenses[categoryName] = (expenses[categoryName] || 0) + tx.amount
      }
    })

    return Object.entries(expenses)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, categoryMap, currentMonth])

  const COLORS = [
    colors.gold,
    colors.greenSuccess,
    colors.redExpense,
    colors.orangeWarning,
    colors.blueInfo,
    colors.purpleUnexpected,
  ]

  return (
    <div style={{ padding: spacing.md, paddingBottom: 100 }}>
      <h1 style={{ marginTop: 0, color: colors.gold }}>📊 Grafy a Analytika</h1>

      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ marginTop: 0, color: colors.gold, fontSize: '16px' }}>Trend (posledních 6 měsíců)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="month" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.blackCard,
                border: `1px solid ${colors.border}`,
              }}
            />
            <Legend />
            <Bar dataKey="income" fill={colors.greenSuccess} />
            <Bar dataKey="expense" fill={colors.redExpense} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ marginTop: 0, color: colors.gold, fontSize: '16px' }}>
          Výdaje po kategoriích ({currentMonth})
        </h2>

        {categoryExpenses.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}Kč`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryExpenses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.blackCard,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: spacing.lg }}>
              <h3 style={{ marginTop: 0, fontSize: '14px', color: colors.textSecondary }}>
                Detailní rozpis:
              </h3>
              {categoryExpenses.map(({ name, value }) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.sm,
                    paddingBottom: spacing.sm,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <span>{name}</span>
                  <span style={{ fontWeight: 'bold', color: colors.redExpense }}>
                    {value} Kč
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: colors.textSecondary }}>
            Žádné výdaje v tomto měsíci
          </div>
        )}
      </Card>
    </div>
  )
}

export default ChartsScreen
