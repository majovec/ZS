import React from 'react'
import { colors, spacing } from '@/theme/colors'
import { Card } from '@/components/Card'

export interface InvestmentsScreenProps {
  onNavigate?: (page: string) => void
}

export const InvestmentsScreen: React.FC<InvestmentsScreenProps> = () => {
  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>📈 Investice a Spoření</h1>

      <Card style={{ padding: spacing.lg, textAlign: 'center' }}>
        <h3 style={{ marginTop: 0 }}>Modul Investic</h3>
        <p style={{ color: colors.textSecondary }}>
          Tato sekce je v přípravě. Brzy zde uvidíš přehled svých úspor, portfolia a zhodnocení.
        </p>
      </Card>
    </div>
  )
}
