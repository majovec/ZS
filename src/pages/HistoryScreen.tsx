import React from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'

export interface HistoryScreenProps {
  onNavigate?: (page: string) => void
}

export const HistoryScreen: React.FC<HistoryScreenProps> = () => {
  const transactions = useAppStore((state) => state.transactions)

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>📜 Historie transakcí</h1>

      {transactions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: spacing.lg }}>
          <p style={{ color: colors.textSecondary }}>Zatím nemáš žádné transakce</p>
        </Card>
      ) : (
        transactions.map((tx) => (
          <Card key={tx.id} style={{ marginBottom: spacing.sm, padding: spacing.md }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ display: 'block' }}>{tx.title || tx.category}</strong>
                <small style={{ color: colors.textSecondary }}>
                  {new Date(tx.createdAt).toLocaleDateString('cs-CZ')}
                </small>
              </div>
              <span
                style={{
                  fontWeight: 'bold',
                  color: tx.type === 'income' ? colors.greenIncome : colors.redExpense,
                }}
              >
                {tx.type === 'income' ? '+' : '-'}{tx.amount} Kč
              </span>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
