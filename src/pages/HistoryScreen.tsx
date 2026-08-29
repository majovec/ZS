import React from 'react'
import { colors, spacing } from '@/theme/colors'

export interface HistoryScreenProps {
  onNavigate?: (page: string) => void
}

export const HistoryScreen: React.FC<HistoryScreenProps> = () => {
  return (
    <div style={{ padding: spacing.md, color: colors.textPrimary }}>
      <h1 style={{ color: colors.gold, marginTop: 0 }}>Historie transakcí</h1>
      <p>Přehled všech zaznamenaných transakcí.</p>
    </div>
  )
}
