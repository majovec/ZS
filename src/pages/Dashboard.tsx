import React, { useEffect, useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { transactionsService, categoriesService } from '@/services/firestoreService'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

export const Dashboard: React.FC<{
  onNavigate: (page: string) => void
}> = ({ onNavigate }) => {
  const user = useAppStore((state) => state.user)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const setCategories = useAppStore((state) => state.setCategories)
  const logoTapCount = useAppStore((state) => state.logoTapCount)
  const setLogoTapCount = useAppStore((state) => state.setLogoTapCount)
  const setShowAddTransactionModal = useAppStore(
    (state) => state.setShowAddTransactionModal
  )

  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpense, setMonthlyExpense] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)
  const [motivation, setMotivation] = useState('')

  const motivationalTexts = [
    'Držíš to! Finanční svoboda je v dosahu!',
    'Každá koruna ušetřená je koruna pro tvou budoucnost.',
    'Znovu silnější! 💪',
    'Máš to pod kontrolou!',
    'Pokračuj! Jsi na správné cestě.',
  ]

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return
    try {
      const [transactions, categories] = await Promise.all([
        transactionsService.getTransactions(user.uid),
        categoriesService.getCategories(user.uid),
      ])

      setTransactions(transactions)
      setCategories(categories)

      // Vypočítej měsíční sumy
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      let income = 0
      let expense = 0

      transactions.forEach((tx) => {
        const txMonth = tx.date.toISOString().slice(0, 7)
        if (txMonth === currentMonth) {
          if (tx.type === 'income') {
            income += tx.amount
          } else {
            expense += tx.amount
          }
        }
      })

      setMonthlyIncome(income)
      setMonthlyExpense(expense)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleLogoClick = () => {
    const newCount = logoTapCount + 1
    setLogoTapCount(newCount)

    if (newCount >= 5) {
      const randomMotivation =
        motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)]
      setMotivation(randomMotivation)
      setShowMotivation(true)
      setLogoTapCount(0)
    }
  }

  const remaining = monthlyIncome - monthlyExpense

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div
            onClick={handleLogoClick}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.gold,
              transition: 'transform 0.2s',
            }}
          >
            <img src="/android_192x192.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              Finance pod kontrolou
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
              Přehled vytváří klid
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: spacing.sm }}>
          <button
            onClick={() => onNavigate('chat')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            💬
          </button>
          <button
            onClick={() => onNavigate('investments')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            💰
          </button>
          <button
            onClick={() => onNavigate('settings')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Main Card */}
      <Card
        style={{
          textAlign: 'center',
          marginBottom: spacing.lg,
          padding: spacing.lg,
        }}
      >
        <p style={{ color: colors.textSecondary, margin: 0 }}>Zbývá ti</p>
        <h2
          style={{
            color: remaining > 0 ? colors.greenSuccess : colors.redExpense,
            fontSize: '32px',
            fontWeight: 'bold',
            margin: `${spacing.md} 0`,
          }}
        >
          {remaining.toFixed(0)} Kč
        </h2>
        <p style={{ color: colors.textSecondary, margin: 0, fontSize: '12px' }}>
          Tento měsíc
        </p>
      </Card>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <Card>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '12px' }}>
            Příjmy
          </p>
          <p
            style={{
              color: colors.greenSuccess,
              fontSize: '20px',
              fontWeight: 'bold',
              margin: `${spacing.sm} 0 0`,
            }}
          >
            {monthlyIncome.toFixed(0)} Kč
          </p>
        </Card>
        <Card>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '12px' }}>
            Výdaje
          </p>
          <p
            style={{
              color: colors.redExpense,
              fontSize: '20px',
              fontWeight: 'bold',
              margin: `${spacing.sm} 0 0`,
            }}
          >
            {monthlyExpense.toFixed(0)} Kč
          </p>
        </Card>
      </div>

      {/* Action Buttons */}
      <Button
        fullWidth
        onClick={() => setShowAddTransactionModal(true)}
        style={{ marginBottom: spacing.md }}
      >
        ➕ Nový zápis
      </Button>

      {/* Motivation Modal */}
      {showMotivation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowMotivation(false)}
        >
          <Card
            style={{
              padding: spacing.lg,
              textAlign: 'center',
              maxWidth: '300px',
            }}
          >
            <h2 style={{ color: colors.gold, marginBottom: spacing.md }}>
              💡 Motivace
            </h2>
            <p style={{ margin: 0, fontSize: '16px' }}>{motivation}</p>
            <Button
              fullWidth
              style={{ marginTop: spacing.lg }}
              onClick={() => setShowMotivation(false)}
            >
              OK
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
