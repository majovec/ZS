import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ZSDailyExpense } from '@/models/types'
import { zsFirestoreService } from '@/services/zsFirestoreService'

export const DailyExpensesScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const zsDailyExpenses = useAppStore((state) => state.zsDailyExpenses)
  const addZsDailyExpense = useAppStore((state) => state.addZsDailyExpense)
  const deleteZsDailyExpense = useAppStore((state) => state.deleteZsDailyExpense)

  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0])
  const [kategorie, setKategorie] = useState<'jídlo' | 'osobka' | 'doprava' | 'nečekané'>('jídlo')
  const [částka, setCástka] = useState('')
  const [poznámka, setPoznámka] = useState('')

  const handleAddExpense = async () => {
    if (!částka || !user) return

    const expense: ZSDailyExpense = {
      id: crypto.randomUUID(),
      userId: user.uid,
      datum: new Date(datum),
      kategorie,
      částka: Number(částka),
      poznámka,
      createdAt: new Date(),
    }

    addZsDailyExpense(expense)
    try { await zsFirestoreService.saveDailyExpense(user.uid, expense) } catch (error) { console.error('Uložení denního výdaje selhalo:', error) }
    setCástka('')
    setPoznámka('')
  }

  const handleDeleteExpense = async (id: string) => {
    if (!user) return
    deleteZsDailyExpense(id)
    try { await zsFirestoreService.deleteDailyExpense(user.uid, id) } catch (error) { console.error('Smazání denního výdaje selhalo:', error) }
  }

  const expensesByCategory = {
    jídlo: zsDailyExpenses.filter((e) => e.kategorie === 'jídlo'),
    osobka: zsDailyExpenses.filter((e) => e.kategorie === 'osobka'),
    doprava: zsDailyExpenses.filter((e) => e.kategorie === 'doprava'),
    nečekané: zsDailyExpenses.filter((e) => e.kategorie === 'nečekané'),
  }

  const categoryTotals = {
    jídlo: expensesByCategory.jídlo.reduce((sum, e) => sum + e.částka, 0),
    osobka: expensesByCategory.osobka.reduce((sum, e) => sum + e.částka, 0),
    doprava: expensesByCategory.doprava.reduce((sum, e) => sum + e.částka, 0),
    nečekané: expensesByCategory.nečekané.reduce((sum, e) => sum + e.částka, 0),
  }

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>📅 Denní Výdaje</h1>

      {/* Přidání výdaje */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ marginBottom: spacing.md, fontSize: '14px' }}>➕ Nový výdaj</h2>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Datum</label>
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
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
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Kategorie</label>
          <select
            value={kategorie}
            onChange={(e) => setKategorie(e.target.value as any)}
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
            <option value="jídlo">🍜 Jídlo</option>
            <option value="osobka">👤 Osobka</option>
            <option value="doprava">🚗 Doprava</option>
            <option value="nečekané">⚠️ Nečekané</option>
          </select>
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Částka (Kč)</label>
          <input
            type="number"
            value={částka}
            onChange={(e) => setCástka(e.target.value)}
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
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>Poznámka</label>
          <input
            type="text"
            value={poznámka}
            onChange={(e) => setPoznámka(e.target.value)}
            placeholder="Co jsi koupil?"
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

        <Button fullWidth onClick={handleAddExpense}>
          💾 Uložit výdaj
        </Button>
      </Card>

      {/* Kategorie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <Card>
          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, marginBottom: spacing.sm }}>🍜 Jídlo</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.gold, margin: 0 }}>
            {categoryTotals.jídlo.toFixed(0)} Kč
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, marginBottom: spacing.sm }}>👤 Osobka</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.gold, margin: 0 }}>
            {categoryTotals.osobka.toFixed(0)} Kč
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, marginBottom: spacing.sm }}>🚗 Doprava</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.gold, margin: 0 }}>
            {categoryTotals.doprava.toFixed(0)} Kč
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, marginBottom: spacing.sm }}>⚠️ Nečekané</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: colors.gold, margin: 0 }}>
            {categoryTotals.nečekané.toFixed(0)} Kč
          </p>
        </Card>
      </div>

      {/* Výdaje podle kategorií */}
      <ExpenseCategory title="🍜 Jídlo" expenses={expensesByCategory.jídlo} onDelete={handleDeleteExpense} />
      <ExpenseCategory title="👤 Osobka" expenses={expensesByCategory.osobka} onDelete={handleDeleteExpense} />
      <ExpenseCategory title="🚗 Doprava" expenses={expensesByCategory.doprava} onDelete={handleDeleteExpense} />
      <ExpenseCategory title="⚠️ Nečekané" expenses={expensesByCategory.nečekané} onDelete={handleDeleteExpense} />
    </div>
  )
}

interface ExpenseCategoryProps {
  title: string
  expenses: ZSDailyExpense[]
  onDelete: (id: string) => void
}

const ExpenseCategory: React.FC<ExpenseCategoryProps> = ({ title, expenses, onDelete }) => {
  if (expenses.length === 0) return null

  return (
    <Card style={{ marginBottom: spacing.lg }}>
      <h3 style={{ marginBottom: spacing.md, fontSize: '14px' }}>{title}</h3>
      {expenses.map((expense) => (
        <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, paddingBottom: spacing.md, borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
              {new Date(expense.datum).toLocaleDateString('cs-CZ')}
            </div>
            {expense.poznámka && <div style={{ fontSize: '12px' }}>{expense.poznámka}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <span style={{ fontWeight: 'bold', color: colors.gold }}>{expense.částka.toFixed(0)} Kč</span>
            <button
              onClick={() => onDelete(expense.id)}
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
        </div>
      ))}
    </Card>
  )
}
