import React, { useState, useEffect, useRef } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { aiEngine } from '@/services/aiService'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const ChatScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const transactions = useAppStore((state) => state.transactions)
  const categories = useAppStore((state) => state.categories)
  const goals = useAppStore((state) => state.goals)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Ahoj! Jsem tvůj AI finanční poradce. Iniciuji AI model (první spuštění může trvat 2-3 minuty). Zeptej se mě na cokoli o tvých financích!',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Inicializuji...')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initAI = async () => {
      try {
        await aiEngine.initialize()
        setAiStatus('✅ Připraveno!')
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '✅ AI je připravená! Teď se mě můžeš ptát na cokoliv.',
          },
        ])
      } catch (error) {
        console.error('AI init error:', error)
        setAiStatus('⚠️ Fallback mode')
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              '⚠️ AI se nepodařila načíst. Používám základní režim. Zeptej se mě!',
          },
        ])
      }
    }

    initAI()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return

    const userMessage = inputValue
    setInputValue('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Vypočítej měsíční sumy
      let monthlyIncome = 0
      let monthlyExpense = 0
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      transactions.forEach((tx) => {
        const txMonth = tx.date.toISOString().slice(0, 7)
        if (txMonth === currentMonth) {
          if (tx.type === 'income') {
            monthlyIncome += tx.amount
          } else {
            monthlyExpense += tx.amount
          }
        }
      })

      const response = await aiEngine.chat(userMessage, {
        transactions,
        categories,
        goals,
        monthlyIncome,
        monthlyExpense,
      })

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Omlouvám se, došlo k chybě. Zkus to prosím později.',
        },
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
        display: 'flex',
        flexDirection: 'column',
        color: colors.textPrimary,
      }}
    >
      <div style={{ marginBottom: spacing.md }}>
        <h1 style={{ marginBottom: spacing.sm }}>💬 AI Rádce</h1>
        <p style={{ fontSize: '12px', color: colors.textSecondary }}>
          Status: {aiStatus}
        </p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: spacing.md,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent:
                msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Card
              style={{
                maxWidth: '80%',
                backgroundColor:
                  msg.role === 'user' ? colors.gold : colors.blackCard,
                color: msg.role === 'user' ? colors.blackDeep : colors.textPrimary,
              }}
            >
              {msg.content}
            </Card>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Card>🤔 Gemma přemýšlí...</Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: spacing.sm,
        }}
      >
        <input
          type="text"
          placeholder="Zeptej se na finance..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage()
          }}
          style={{
            flex: 1,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.blackSurface,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            color: colors.textPrimary,
            fontFamily: 'inherit',
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !inputValue.trim()}
          style={{ padding: `${spacing.sm} ${spacing.md}` }}
        >
          Poslat
        </Button>
      </div>
    </div>
  )
}
