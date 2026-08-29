import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { aiEngine } from '@/services/aiService'
import { useAppStore } from '@/store/appStore'

export interface ChatScreenProps {
  onNavigate?: (page: string) => void
}

interface Message {
  sender: 'user' | 'ai'
  text: string
}

export const ChatScreen: React.FC<ChatScreenProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Ahoj! Jsem tvůj finanční asistent. Jak ti mohu dnes pomoci?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const transactions = useAppStore((state) => state.transactions)
  const categories = useAppStore((state) => state.categories)
  const goals = useAppStore((state) => state.goals)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setLoading(true)

    try {
      const response = await aiEngine.chat(userMsg, {
        transactions,
        categories,
        goals,
        monthlyIncome: 0,
        monthlyExpense: 0,
      })
      setMessages((prev) => [...prev, { sender: 'ai', text: response }])
    } catch (error) {
      console.error('AI chat error:', error)
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Omlouvám se, ale při zpracování dotazu došlo k chybě.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ marginBottom: spacing.md }}>🤖 AI Asistent</h1>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: spacing.md }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: spacing.sm,
            }}
          >
            <Card
              style={{
                maxWidth: '80%',
                backgroundColor:
                  msg.sender === 'user' ? colors.gold : colors.blackSurface,
                color: msg.sender === 'user' ? colors.blackDeep : colors.textPrimary,
                padding: spacing.md,
              }}
            >
              {msg.text}
            </Card>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: spacing.sm }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Napiš dotaz..."
            value={input}
            onChange={setInput}
          />
        </div>
        <Button type="submit" loading={loading}>
          Odeslat
        </Button>
      </form>
    </div>
  )
}
