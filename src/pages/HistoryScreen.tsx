import React, { useMemo } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'

export const HistoryScreen: React.FC = () => {
  const transactions = useAppStore((state) => state.transactions)
  const categories = useAppStore((state) => state.categories)

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  )

  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, typeof transactions> = {}

    transactions.forEach((tx) => {
      const monthKey = new Date(tx.date).toLocaleDateString('cs-CZ', {
        year: 'numeric',
        month: 'long',
      })

      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(tx)
    })

    return grouped
  }, [transactions])

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>📊 Přehled</h1>

      {transactions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: spacing.lg }}>
          <p style={{ color: colors.textSecondary }}>Zatím nemáš žádné transakce</p>
        </Card>
      ) : (
        Object.entries(groupedTransactions).map(([month, monthTxs]) => (
          <div key={month} style={{ marginBottom: spacing.lg }}>
            <h2
              style={{
                fontSize: '16px',
                color: colors.gold,
                marginBottom: spacing.md,
                borderBottom: `1px solid ${colors.border}`,
                paddingBottom: spacing.sm,
              }}
            >
              {month}
            </h2>

            {monthTxs.map((tx) => {
              const category = categoryMap.get(tx.categoryId)
              const isIncome = tx.type === 'income'

              return (
                <Card
                  key={tx.id}
                  style={{
                    marginBottom: spacing.sm,
                    padding: spacing.md,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>
                      {category?.name || 'Neznámá'}
                    </p>
                    {tx.note && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: colors.textSecondary,
                        }}
                      >
                        {tx.note}
                      </p>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '11px',
                        color: colors.textTertiary,
                      }}
                    >
                      {new Date(tx.date).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <p
                    style={{
                      color: isIncome ? colors.greenSuccess : colors.redExpense,
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    {isIncome ? '+' : '-'}{tx.amount.toFixed(0)} Kč
                  </p>
                </Card>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
