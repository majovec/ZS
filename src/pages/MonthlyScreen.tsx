import React, { useState, useEffect } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { zsFirestoreService } from '@/services/zsFirestoreService'

export const MonthlyScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const zsMonthlyIncome = useAppStore((state) => state.zsMonthlyIncome)
  const setZsMonthlyIncome = useAppStore((state) => state.setZsMonthlyIncome)
  const zsMonthlyFixedExpenses = useAppStore((state) => state.zsMonthlyFixedExpenses)
  const setZsMonthlyFixedExpenses = useAppStore((state) => state.setZsMonthlyFixedExpenses)
  const zsMonthlyVariableExpenses = useAppStore((state) => state.zsMonthlyVariableExpenses)
  const setZsMonthlyVariableExpenses = useAppStore((state) => state.setZsMonthlyVariableExpenses)
  const zsMonthlySummary = useAppStore((state) => state.zsMonthlySummary)
  const calculateZsMonthlySummary = useAppStore((state) => state.calculateZsMonthlySummary)

  const [editMode, setEditMode] = useState(false)

  // Automatická inicializace výchozích struktur, pokud jsou v datech null
  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    if (!zsMonthlyIncome) {
      setZsMonthlyIncome({
        id: '',
        userId: user?.uid || '',
        month: currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: {
          výplata: { plánované: 0, skutečné: 0 },
          brigáda: { plánované: 0, skutečné: 0 },
          dárek: { plánované: 0, skutečné: 0 },
          podnikání: { plánované: 0, skutečné: 0 },
        },
      } as any)
    }
    if (!zsMonthlyFixedExpenses) {
      setZsMonthlyFixedExpenses({
        id: '',
        userId: user?.uid || '',
        month: currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: {
          nájem: { plánované: 0, skutečné: 0 },
          energie: { plánované: 0, skutečné: 0 },
          telefon: { plánované: 0, skutečné: 0 },
          internet: { plánované: 0, skutečné: 0 },
          pojistky: { plánované: 0, skutečné: 0 },
          splátky: { plánované: 0, skutečné: 0 },
        },
      } as any)
    }
    if (!zsMonthlyVariableExpenses) {
      setZsMonthlyVariableExpenses({
        id: '',
        userId: user?.uid || '',
        month: currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: {
          osobka: { plánované: 0, skutečné: 0 },
          jídlo: { plánované: 0, skutečné: 0 },
          doprava: { plánované: 0, skutečné: 0 },
          škola: { plánované: 0, skutečné: 0 },
          kroužky: { plánované: 0, skutečné: 0 },
        },
      } as any)
    }
  }, [zsMonthlyIncome, zsMonthlyFixedExpenses, zsMonthlyVariableExpenses, setZsMonthlyIncome, setZsMonthlyFixedExpenses, setZsMonthlyVariableExpenses, user])

  useEffect(() => {
    calculateZsMonthlySummary()
  }, [zsMonthlyIncome, zsMonthlyFixedExpenses, zsMonthlyVariableExpenses, calculateZsMonthlySummary])

  const handleIncomeChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyIncome) return
    const updated = {
      ...zsMonthlyIncome,
      items: {
        ...zsMonthlyIncome.items,
        [key]: {
          ...(zsMonthlyIncome.items as any)[key],
          [type]: value,
        },
      },
    }
    setZsMonthlyIncome(updated)
    if (user) void zsFirestoreService.saveIncome(user.uid, { ...updated, updatedAt: new Date() } as any).catch(console.error)
  }

  const handleFixedChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyFixedExpenses) return
    const updated = {
      ...zsMonthlyFixedExpenses,
      items: {
        ...zsMonthlyFixedExpenses.items,
        [key]: {
          ...(zsMonthlyFixedExpenses.items as any)[key],
          [type]: value,
        },
      },
    }
    setZsMonthlyFixedExpenses(updated)
    if (user) void zsFirestoreService.saveFixed(user.uid, { ...updated, updatedAt: new Date() } as any).catch(console.error)
  }

  const handleVariableChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyVariableExpenses) return
    const updated = {
      ...zsMonthlyVariableExpenses,
      items: {
        ...zsMonthlyVariableExpenses.items,
        [key]: {
          ...(zsMonthlyVariableExpenses.items as any)[key],
          [type]: value,
        },
      },
    }
    setZsMonthlyVariableExpenses(updated)
    if (user) void zsFirestoreService.saveVariable(user.uid, { ...updated, updatedAt: new Date() } as any).catch(console.error)
  }

  const handleToggleEdit = () => {
    setEditMode(!editMode)
  }

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        paddingBottom: '100px',
        color: colors.textPrimary,
      }}
    >
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ marginBottom: spacing.sm }}>📊 Znovu Silnější</h1>
        <p style={{ color: colors.textSecondary, margin: 0 }}>Měsíční přehled</p>
      </div>

      {/* PŘÍJMY */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.gold, marginBottom: spacing.md, fontSize: '16px' }}>💰 PŘÍJMY</h2>
        {zsMonthlyIncome && (
          <>
            <IncomeRow label="Výplata" planned={zsMonthlyIncome.items.výplata.plánované || 0} actual={zsMonthlyIncome.items.výplata.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleIncomeChange('výplata', 'plánované', v)} onActualChange={(v) => handleIncomeChange('výplata', 'skutečné', v)} />
            <IncomeRow label="Brigáda" planned={zsMonthlyIncome.items.brigáda.plánované || 0} actual={zsMonthlyIncome.items.brigáda.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleIncomeChange('brigáda', 'plánované', v)} onActualChange={(v) => handleIncomeChange('brigáda', 'skutečné', v)} />
            <IncomeRow label="Dárek" planned={zsMonthlyIncome.items.dárek.plánované || 0} actual={zsMonthlyIncome.items.dárek.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleIncomeChange('dárek', 'plánované', v)} onActualChange={(v) => handleIncomeChange('dárek', 'skutečné', v)} />
            <IncomeRow label="Podnikání" planned={zsMonthlyIncome.items.podnikání.plánované || 0} actual={zsMonthlyIncome.items.podnikání.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleIncomeChange('podnikání', 'plánované', v)} onActualChange={(v) => handleIncomeChange('podnikání', 'skutečné', v)} />

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: spacing.md, marginTop: spacing.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>CELKEM PŘÍJMY</span>
                <span>{(zsMonthlySummary?.příjmySkutečné || 0).toFixed(0)} Kč</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* FIXNÍ VÝDAJE */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.gold, marginBottom: spacing.md, fontSize: '16px' }}>🔴 FIXNÍ VÝDAJE</h2>
        {zsMonthlyFixedExpenses && (
          <>
            <ExpenseRow label="Nájem" planned={zsMonthlyFixedExpenses.items.nájem.plánované || 0} actual={zsMonthlyFixedExpenses.items.nájem.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('nájem', 'plánované', v)} onActualChange={(v) => handleFixedChange('nájem', 'skutečné', v)} />
            <ExpenseRow label="Energie" planned={zsMonthlyFixedExpenses.items.energie.plánované || 0} actual={zsMonthlyFixedExpenses.items.energie.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('energie', 'plánované', v)} onActualChange={(v) => handleFixedChange('energie', 'skutečné', v)} />
            <ExpenseRow label="Telefon" planned={zsMonthlyFixedExpenses.items.telefon.plánované || 0} actual={zsMonthlyFixedExpenses.items.telefon.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('telefon', 'plánované', v)} onActualChange={(v) => handleFixedChange('telefon', 'skutečné', v)} />
            <ExpenseRow label="Internet" planned={zsMonthlyFixedExpenses.items.internet.plánované || 0} actual={zsMonthlyFixedExpenses.items.internet.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('internet', 'plánované', v)} onActualChange={(v) => handleFixedChange('internet', 'skutečné', v)} />
            <ExpenseRow label="Pojistky" planned={zsMonthlyFixedExpenses.items.pojistky.plánované || 0} actual={zsMonthlyFixedExpenses.items.pojistky.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('pojistky', 'plánované', v)} onActualChange={(v) => handleFixedChange('pojistky', 'skutečné', v)} />
            <ExpenseRow label="Splátky" planned={zsMonthlyFixedExpenses.items.splátky.plánované || 0} actual={zsMonthlyFixedExpenses.items.splátky.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleFixedChange('splátky', 'plánované', v)} onActualChange={(v) => handleFixedChange('splátky', 'skutečné', v)} />
          </>
        )}
      </Card>

      {/* VARIABILNÍ VÝDAJE */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.gold, marginBottom: spacing.md, fontSize: '16px' }}>🟠 VARIABILNÍ VÝDAJE</h2>
        {zsMonthlyVariableExpenses && (
          <>
            <ExpenseRow label="Osobka" planned={zsMonthlyVariableExpenses.items.osobka.plánované || 0} actual={zsMonthlyVariableExpenses.items.osobka.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleVariableChange('osobka', 'plánované', v)} onActualChange={(v) => handleVariableChange('osobka', 'skutečné', v)} />
            <ExpenseRow label="Jídlo" planned={zsMonthlyVariableExpenses.items.jídlo.plánované || 0} actual={zsMonthlyVariableExpenses.items.jídlo.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleVariableChange('jídlo', 'plánované', v)} onActualChange={(v) => handleVariableChange('jídlo', 'skutečné', v)} />
            <ExpenseRow label="Doprava" planned={zsMonthlyVariableExpenses.items.doprava.plánované || 0} actual={zsMonthlyVariableExpenses.items.doprava.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleVariableChange('doprava', 'plánované', v)} onActualChange={(v) => handleVariableChange('doprava', 'skutečné', v)} />
            <ExpenseRow label="Škola" planned={zsMonthlyVariableExpenses.items.škola.plánované || 0} actual={zsMonthlyVariableExpenses.items.škola.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleVariableChange('škola', 'plánované', v)} onActualChange={(v) => handleVariableChange('škola', 'skutečné', v)} />
            <ExpenseRow label="Kroužky" planned={zsMonthlyVariableExpenses.items.kroužky.plánované || 0} actual={zsMonthlyVariableExpenses.items.kroužky.skutečné || 0} editable={editMode} onPlannedChange={(v) => handleVariableChange('kroužky', 'plánované', v)} onActualChange={(v) => handleVariableChange('kroužky', 'skutečné', v)} />
          </>
        )}
      </Card>

      {/* VÝSLEDEK */}
      <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.blackSurface }}>
        <h2 style={{ color: colors.gold, marginBottom: spacing.md }}>📊 VÝSLEDEK</h2>
        <div style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span>Plánovaný výsledek:</span>
            <span style={{ color: zsMonthlySummary && zsMonthlySummary.výsledekPlánovaný > 0 ? colors.greenSuccess : colors.redExpense }}>
              {(zsMonthlySummary?.výsledekPlánovaný || 0).toFixed(0)} Kč
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <span>Skutečný výsledek:</span>
            <span style={{ color: zsMonthlySummary && zsMonthlySummary.výsledekSkutečný > 0 ? colors.greenSuccess : colors.redExpense }}>
              {(zsMonthlySummary?.výsledekSkutečný || 0).toFixed(0)} Kč
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
            <span>Skutečně zbylo:</span>
            <span style={{ color: colors.gold }}>
              {(zsMonthlySummary?.skutečněZbylo || 0).toFixed(0)} Kč
            </span>
          </div>
        </div>
      </Card>

      {/* FIXNÍ TLAČÍTKO DOLE */}
      <div style={{ position: 'fixed', bottom: '70px', left: spacing.md, right: spacing.md, zIndex: 100 }}>
        <Button fullWidth onClick={handleToggleEdit}>
          {editMode ? '✅ Uložit' : '✏️ Upravit'}
        </Button>
      </div>
    </div>
  )
}

interface RowProps {
  label: string
  planned: number
  actual: number
  editable: boolean
  onPlannedChange: (value: number) => void
  onActualChange: (value: number) => void
}

const IncomeRow: React.FC<RowProps> = ({ label, planned, actual, editable, onPlannedChange, onActualChange }) => (
  <div style={{ marginBottom: spacing.md, paddingBottom: spacing.md, borderBottom: `1px solid ${colors.border}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
      <span>{label}</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
      {editable ? (
        <>
          <input
            type="number"
            value={planned === 0 ? '' : planned}
            onChange={(e) => onPlannedChange(e.target.value === '' ? 0 : Number(e.target.value))}
            placeholder="Plánované"
            style={{ padding: spacing.sm, backgroundColor: colors.blackCard, border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.textPrimary, width: '100%', boxSizing: 'border-box' }}
          />
          <input
            type="number"
            value={actual === 0 ? '' : actual}
            onChange={(e) => onActualChange(e.target.value === '' ? 0 : Number(e.target.value))}
            placeholder="Skutečné"
            style={{ padding: spacing.sm, backgroundColor: colors.blackCard, border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.textPrimary, width: '100%', boxSizing: 'border-box' }}
          />
        </>
      ) : (
        <>
          <div style={{ color: colors.textSecondary, fontSize: '12px' }}>Plán: {planned.toFixed(0)} Kč</div>
          <div style={{ color: colors.greenSuccess, fontSize: '12px' }}>Skut: {actual.toFixed(0)} Kč</div>
        </>
      )}
    </div>
  </div>
)

const ExpenseRow: React.FC<RowProps> = ({ label, planned, actual, editable, onPlannedChange, onActualChange }) => (
  <div style={{ marginBottom: spacing.md, paddingBottom: spacing.md, borderBottom: `1px solid ${colors.border}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
      <span>{label}</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
      {editable ? (
        <>
          <input
            type="number"
            value={planned === 0 ? '' : planned}
            onChange={(e) => onPlannedChange(e.target.value === '' ? 0 : Number(e.target.value))}
            placeholder="Plánované"
            style={{ padding: spacing.sm, backgroundColor: colors.blackCard, border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.textPrimary, width: '100%', boxSizing: 'border-box' }}
          />
          <input
            type="number"
            value={actual === 0 ? '' : actual}
            onChange={(e) => onActualChange(e.target.value === '' ? 0 : Number(e.target.value))}
            placeholder="Skutečné"
            style={{ padding: spacing.sm, backgroundColor: colors.blackCard, border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.textPrimary, width: '100%', boxSizing: 'border-box' }}
          />
        </>
      ) : (
        <>
          <div style={{ color: colors.textSecondary, fontSize: '12px' }}>Plán: {planned.toFixed(0)} Kč</div>
          <div style={{ color: colors.redExpense, fontSize: '12px' }}>Skut: {actual.toFixed(0)} Kč</div>
        </>
      )}
    </div>
  </div>
)
