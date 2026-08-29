import React, { useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'

export const ChartsScreen: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions)
  const categories = useAppStore((state) => state.categories)
  const currentMonth = useAppStore((state) => state.currentMonth)

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  )

  // Data pro výdaje po kategoriích
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

    return Object.entries(expenses).map(([name, value]) => ({
      name,
      value: Math.round(value),
    })).sort((a, b) => b.value - a.value)
  }, [transactions, categories, currentMonth])

  // Data pro měsíční trend
  const monthlyTrend = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {}

    transactions.forEach((tx) => {
      const month = tx.date.toISOString().slice(0, 7)
      if (!months[month]) {
        months[month] = { income: 0, expense: 0 }
      }

      if (tx.type === 'income') {
        months[month].income += tx.amount
      } else {
        months[month].expense += tx.amount
      }
    })

    return Object.entries(months)
      .sort()
      .map(([month, data]) => ({
        month: new Date(month).toLocaleDateString('cs-CZ', { month: 'short' }),
        income: Math.round(data.income),
        expense: Math.round(data.expense),
      }))
      .slice(-6) // Poslední 6 měsíců
  }, [transactions])

  const COLORS = [colors.gold, colors.redExpense, colors.greenSuccess, colors.blueInfo, colors.purpleUnexpected]

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
        overflowY: 'auto',
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>📈 Grafy</h1>

      {/* Bar Chart - Měsíční trend */}
      <Card style={{ marginBottom: spacing.lg, padding: spacing.md }}>
        <h2 style={{ fontSize: '16px', marginBottom: spacing.md }}>
          Měsíční trend
        </h2>
        {monthlyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" stroke={colors.textSecondary} />
              <YAxis stroke={colors.textSecondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.blackCard,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
              />
              <Bar dataKey="income" stackId="a" fill={colors.greenSuccess} />
              <Bar dataKey="expense" stackId="a" fill={colors.redExpense} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: colors.textSecondary }}>Žádná data</p>
        )}
      </Card>

      {/* Pie Chart - Rozdělení výdajů */}
      <Card style={{ marginBottom: spacing.lg, padding: spacing.md }}>
        <h2 style={{ fontSize: '16px', marginBottom: spacing.md }}>
          Rozdělení výdajů (tento měsíc)
        </h2>
        {categoryExpenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill={colors.gold}
                dataKey="value"
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.blackCard,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: colors.textSecondary }}>Žádné výdaje v tomto měsíci</p>
        )}
      </Card>

      {/* Category List */}
      <Card style={{ padding: spacing.md }}>
        <h2 style={{ fontSize: '16px', marginBottom: spacing.md }}>
          Výdaje po kategoriích
        </h2>
        {categoryExpenses.length > 0 ? (
          categoryExpenses.map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
                paddingBottom: spacing.sm,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <span>{item.name}</span>
              <span style={{ fontWeight: 'bold', color: colors.redExpense }}>
                {item.value} Kč
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: colors.textSecondary }}>Žádné výdaje</p>
        )}
      </Card>
    </div>
  )
}
