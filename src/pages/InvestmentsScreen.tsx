import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { investmentsService } from '@/services/firestoreService'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export const InvestmentsScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const investments = useAppStore((state) => state.investments)
  const setInvestments = useAppStore((state) => state.setInvestments)

  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [isSavings, setIsSavings] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !name || !amount) return

    setLoading(true)
    try {
      await investmentsService.addInvestment(user.uid, {
        name,
        amount: parseFloat(amount),
        date: new Date(),
        isSavings,
      })
      const updatedInvestments = await investmentsService.getInvestments(user.uid)
      setInvestments(updatedInvestments)
      setName('')
      setAmount('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding investment:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSavings = investments
    .filter((inv) => inv.isSavings)
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalInvestments = investments
    .filter((inv) => !inv.isSavings)
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>💰 Spoření a Investice</h1>

      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <Card style={{ padding: spacing.md }}>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '12px' }}>
            Spoření
          </p>
          <p
            style={{
              color: colors.greenSuccess,
              fontSize: '20px',
              fontWeight: 'bold',
              margin: `${spacing.sm} 0 0`,
            }}
          >
            {totalSavings.toFixed(0)} Kč
          </p>
        </Card>
        <Card style={{ padding: spacing.md }}>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '12px' }}>
            Investice
          </p>
          <p
            style={{
              color: colors.blueInfo,
              fontSize: '20px',
              fontWeight: 'bold',
              margin: `${spacing.sm} 0 0`,
            }}
          >
            {totalInvestments.toFixed(0)} Kč
          </p>
        </Card>
      </div>

      {!showAddForm && (
        <Button
          fullWidth
          onClick={() => setShowAddForm(true)}
          style={{ marginBottom: spacing.lg }}
        >
          ➕ Přidat vklad
        </Button>
      )}

      {showAddForm && (
        <Card style={{ marginBottom: spacing.lg, padding: spacing.lg }}>
          <form onSubmit={handleAddInvestment}>
            <Input
              label="Název"
              placeholder="Vklad na účet..."
              value={name}
              onChange={setName}
            />

            <Input
              type="number"
              label="Částka (Kč)"
              placeholder="0"
              value={amount}
              onChange={setAmount}
            />

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                marginBottom: spacing.md,
              }}
            >
              <input
                type="checkbox"
                checked={isSavings}
                onChange={(e) => setIsSavings(e.target.checked)}
              />
              <span>Spoření (ne investice)</span>
            </label>

            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button type="submit" fullWidth loading={loading}>
                Přidat
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowAddForm(false)}
              >
                Storno
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {investments.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: spacing.lg }}>
          <p style={{ color: colors.textSecondary }}>Nemáš zatím žádné vklady</p>
        </Card>
      ) : (
        investments.map((inv) => (
          <Card key={inv.id} style={{ marginBottom: spacing.md, padding: spacing.md }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{inv.name}</h3>
                <p style={{ margin: 0, color: colors.textSecondary, fontSize: '12px' }}>
                  {new Date(inv.date).toLocaleDateString('cs-CZ')}
                </p>
              </div>
              <p
                style={{
                  color: inv.isSavings ? colors.greenSuccess : colors.blueInfo,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                {inv.amount.toFixed(0)} Kč
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
