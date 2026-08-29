import React from 'react'
import { colors, spacing } from '@/theme/colors'
import { aiEngine } from '@/services/aiService'

export interface ChatScreenProps {
  onNavigate?: (page: string) => void
}

export const ChatScreen: React.FC<ChatScreenProps> = () => {
  React.useEffect(() => {
    aiEngine.initialize()
  }, [])

  return (
    <div style={{ padding: spacing.md, color: colors.textPrimary }}>
      <h1 style={{ color: colors.gold, marginTop: 0 }}>AI Asistent</h1>
      <p>Chat rozhraní je připraveno.</p>
    </div>
  )
}
