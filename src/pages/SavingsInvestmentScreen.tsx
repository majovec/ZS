import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { v4 as uuidv4 } from 'uuid'
import { ZSSavings, ZSInvestment } from '@/models/types'

export const SavingsInvestmentScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const zsCurrentMonth = useAppStore((state) => state.zsCurrentMonth)
  const zsSavings = useAppStore((state) => state.zsSavings)
  const setZsSavings = useAppStore((state) => state.setZsSavings)
  const zsInvestments = useAppStore((state) => state.zsInvestments)
  const addZsInvestment = useAppStore((state) => state.addZsInvestment)
  const deleteZsInvestment = useAppStore((state) => state.deleteZsInvestment)

  const [savingsPlanned, setSavingsPlanned] = useState(zsSavings?.plánované || 0)
  const [savingsActual, setSavingsActual] = useState(zsSavings?.skutečné || 0)
  const [investmentName, setInvestmentName] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investmentType, setInvestmentType] = useState<'nákup' | 'prodej'>('nákup')

  const handleSaveSavings = () => {
    if (!user) return

    const savings: ZSSavings = {
      id: zsSavings?.id || uuidv4(),
      userId: user.uid,
      month: zsCurrentMonth,
      plánované: savingsPlanned,
      skutečné: savingsActual,
      zůstatek: savingsActual,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setZsSavings(savings)
  }

  const handleAddInvestment = () => {
    if (!investmentName || !investmentAmount || !user) return

    const investment: ZSInvestment = {
      id: uuidv4(),
      userId: user.uid,
      název: investmentName,
      počátek: Number(investmentAmount),
      investováno: Number(investmentAmount),
      bank: Number(investmentAmount),
      měsíc: zsCurrentMonth,
      položky: [
        {
          datum: new Date(),
          částka: Number(investmentAmount),
          popis: investmentType === 'nákup' ? 'Nákup' : 'Prodej',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addZsInvestment(investment)
    setInvestmentName('')
    setInvestmentAmount('')
  }

  const totalInvestments = zsInvestments.reduce((sum, inv) => sum + inv.bank, 0)

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>💰 Spoření & Investice</h1>

      {/* SPOŘENÍ */}
      <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.blackSurface }}>
        <h2 style={{ marginBottom: spacing.md, fontSize: '16px', color: colors.gold }}>💚 SPOŘENÍ</h2>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Plánované (Kč)</label>
          <input
            type="number"
            value={savingsPlanned}
            onChange={(e) => setSavingsPlanned(Number(e.target.value))}
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Skutečné (Kč)</label>
          <input
            type="number"
            value={savingsActual}
            onChange={(e) => setSavingsActual(Number(e.target.value))}
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <Button fullWidth onClick={handleSaveSavings}>
          💾 Uložit spoření
        </Button>

        <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span style={{ color: colors.textSecondary }}>Zůstatek:</span>
            <span style={{ color: colors.greenSuccess, fontWeight: 'bold' }}>{savingsActual.toFixed(0)} Kč</span>
          </div>
        </div>
      </Card>

      {/* INVESTICE */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ marginBottom: spacing.md, fontSize: '16px', color: colors.gold }}>📈 INVESTICE</h2>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Název investice</label>
          <input
            type="text"
            value={investmentName}
            onChange={(e) => setInvestmentName(e.target.value)}
            placeholder="např. Nákup látek"
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Částka (Kč)</label>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Typ</label>
          <select
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value as any)}
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
            }}
          >
            <option value="nákup">💰 Nákup</option>
            <option value="prodej">📤 Prodej</option>
          </select>
        </div>

        <Button fullWidth onClick={handleAddInvestment}>
          ➕ Přidat investici
        </Button>
      </Card>

      {/* PŘEHLED INVESTIC */}
      {zsInvestments.length > 0 && (
        <Card>
          <h2 style={{ marginBottom: spacing.md, fontSize: '16px', color: colors.gold }}>📊 Přehled Investic</h2>

          {zsInvestments.map((inv) => (
            <div
              key={inv.id}
              style={{
                marginBottom: spacing.md,
                paddingBottom: spacing.md,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <span style={{ fontWeight: 'bold' }}>{inv.název}</span>
                <button
                  onClick={() => deleteZsInvestment(inv.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.redExpense,
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm, fontSize: '12px' }}>
                <div>
                  <p style={{ color: colors.textSecondary, margin: 0, marginBottom: '4px' }}>Počátek</p>
                  <p style={{ color: colors.gold, margin: 0, fontWeight: 'bold' }}>{inv.počátek.toFixed(0)} Kč</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, margin: 0, marginBottom: '4px' }}>Investováno</p>
                  <p style={{ color: colors.gold, margin: 0, fontWeight: 'bold' }}>{inv.investováno.toFixed(0)} Kč</p>
                </div>
                <div>
                  <p style={{ color: colors.textSecondary, margin: 0, marginBottom: '4px' }}>BANK</p>
                  <p style={{ color: colors.greenSuccess, margin: 0, fontWeight: 'bold' }}>{inv.bank.toFixed(0)} Kč</p>
                </div>
              </div>
            </div>
          ))}

          <div style={{ paddingTop: spacing.md, borderTop: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Celkem BANK:</span>
              <span style={{ color: colors.gold }}>{totalInvestments.toFixed(0)} Kč</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
