import React, { useState, useEffect } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { CategoryType } from '@/models/types'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'

export const MonthlyScreen: React.FC = () => {
  const categories = useAppStore((state) => state.categories)
  const zsMonthlyIncome = useAppStore((state) => state.zsMonthlyIncome)
  const setZsMonthlyIncome = useAppStore((state) => state.setZsMonthlyIncome)
  const zsMonthlyFixedExpenses = useAppStore((state) => state.zsMonthlyFixedExpenses)
  const setZsMonthlyFixedExpenses = useAppStore((state) => state.setZsMonthlyFixedExpenses)
  const zsMonthlyVariableExpenses = useAppStore((state) => state.zsMonthlyVariableExpenses)
  const setZsMonthlyVariableExpenses = useAppStore((state) => state.setZsMonthlyVariableExpenses)
  const zsMonthlySummary = useAppStore((state) => state.zsMonthlySummary)
  const calculateZsMonthlySummary = useAppStore((state) => state.calculateZsMonthlySummary)

  const [editMode, setEditMode] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const incomeCategories = categories.filter((c) => c.type === CategoryType.INCOME)

  useEffect(() => {
    calculateZsMonthlySummary()
  }, [zsMonthlyIncome, zsMonthlyFixedExpenses, zsMonthlyVariableExpenses, calculateZsMonthlySummary])

  const handleIncomeChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyIncome) return
    const updated = { ...zsMonthlyIncome }
    ;(updated.items as any)[key][type] = value
    setZsMonthlyIncome(updated)
  }

  const handleFixedChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyFixedExpenses) return
    const updated = { ...zsMonthlyFixedExpenses }
    ;(updated.items as any)[key][type] = value
    setZsMonthlyFixedExpenses(updated)
  }

  const handleVariableChange = (key: string, type: 'plánované' | 'skutečné', value: number) => {
    if (!zsMonthlyVariableExpenses) return
    const updated = { ...zsMonthlyVariableExpenses }
    ;(updated.items as any)[key][type] = value
    setZsMonthlyVariableExpenses(updated)
  }

  const handleAddCategory = () => {
    if (!newCategoryName) return
    // TODO: Implementuj přidání kategorie do Firebase
    setShowCategoryModal(false)
    setNewCategoryName('')
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
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ marginBottom: spacing.sm }}>📊 Znovu Silnější</h1>
        <p style={{ color: colors.textSecondary, margin: 0 }}>Měsíční přehled</p>
      </div>

      {/* PŘÍJMY */}
      <Card style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <h2 style={{ color: colors.gold, margin: 0, fontSize: '16px' }}>💰 PŘÍJMY</h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            style={{
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.gold,
              color: colors.blackDeep,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            ➕ Kat.
          </button>
        </div>

        {zsMonthlyIncome && (
          <>
            {incomeCategories.map((cat) => (
              <IncomeRow
                key={cat.id}
                label={cat.name}
                planned={
                  (zsMonthlyIncome.items as any)[cat.name.toLowerCase()]?.plánované || 0
                }
                actual={
                  (zsMonthlyIncome.items as any)[cat.name.toLowerCase()]?.skutečné || 0
                }
                editable={editMode}
                onPlannedChange={(v) =>
                  handleIncomeChange(cat.name.toLowerCase(), 'plánované', v)
                }
                onActualChange={(v) =>
                  handleIncomeChange(cat.name.toLowerCase(), 'skutečné', v)
                }
              />
            ))}

            {/* Standard položky */}
            <IncomeRow
              label="Výplata"
              planned={zsMonthlyIncome.items.výplata.plánované || 0}
              actual={zsMonthlyIncome.items.výplata.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleIncomeChange('výplata', 'plánované', v)}
              onActualChange={(v) => handleIncomeChange('výplata', 'skutečné', v)}
            />
            <IncomeRow
              label="Brigáda"
              planned={zsMonthlyIncome.items.brigáda.plánované || 0}
              actual={zsMonthlyIncome.items.brigáda.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleIncomeChange('brigáda', 'plánované', v)}
              onActualChange={(v) => handleIncomeChange('brigáda', 'skutečné', v)}
            />
            <IncomeRow
              label="Dárek"
              planned={zsMonthlyIncome.items.dárek.plánované || 0}
              actual={zsMonthlyIncome.items.dárek.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleIncomeChange('dárek', 'plánované', v)}
              onActualChange={(v) => handleIncomeChange('dárek', 'skutečné', v)}
            />
            <IncomeRow
              label="Podnikání"
              planned={zsMonthlyIncome.items.podnikání.plánované || 0}
              actual={zsMonthlyIncome.items.podnikání.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleIncomeChange('podnikání', 'plánované', v)}
              onActualChange={(v) => handleIncomeChange('podnikání', 'skutečné', v)}
            />

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
            <ExpenseRow
              label="Nájem"
              planned={zsMonthlyFixedExpenses.items.nájem.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.nájem.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('nájem', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('nájem', 'skutečné', v)}
            />
            <ExpenseRow
              label="Energie"
              planned={zsMonthlyFixedExpenses.items.energie.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.energie.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('energie', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('energie', 'skutečné', v)}
            />
            <ExpenseRow
              label="Telefon"
              planned={zsMonthlyFixedExpenses.items.telefon.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.telefon.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('telefon', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('telefon', 'skutečné', v)}
            />
            <ExpenseRow
              label="Internet"
              planned={zsMonthlyFixedExpenses.items.internet.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.internet.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('internet', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('internet', 'skutečné', v)}
            />
            <ExpenseRow
              label="Pojistky"
              planned={zsMonthlyFixedExpenses.items.pojistky.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.pojistky.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('pojistky', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('pojistky', 'skutečné', v)}
            />
            <ExpenseRow
              label="Splátky"
              planned={zsMonthlyFixedExpenses.items.splátky.plánované || 0}
              actual={zsMonthlyFixedExpenses.items.splátky.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleFixedChange('splátky', 'plánované', v)}
              onActualChange={(v) => handleFixedChange('splátky', 'skutečné', v)}
            />
          </>
        )}
      </Card>

      {/* VARIABILNÍ VÝDAJE */}
      <Card style={{ marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.gold, marginBottom: spacing.md, fontSize: '16px' }}>🟠 VARIABILNÍ VÝDAJE</h2>

        {zsMonthlyVariableExpenses && (
          <>
            <ExpenseRow
              label="Osobka"
              planned={zsMonthlyVariableExpenses.items.osobka.plánované || 0}
              actual={zsMonthlyVariableExpenses.items.osobka.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleVariableChange('osobka', 'plánované', v)}
              onActualChange={(v) => handleVariableChange('osobka', 'skutečné', v)}
            />
            <ExpenseRow
              label="Jídlo"
              planned={zsMonthlyVariableExpenses.items.jídlo.plánované || 0}
              actual={zsMonthlyVariableExpenses.items.jídlo.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleVariableChange('jídlo', 'plánované', v)}
              onActualChange={(v) => handleVariableChange('jídlo', 'skutečné', v)}
            />
            <ExpenseRow
              label="Doprava"
              planned={zsMonthlyVariableExpenses.items.doprava.plánované || 0}
              actual={zsMonthlyVariableExpenses.items.doprava.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleVariableChange('doprava', 'plánované', v)}
              onActualChange={(v) => handleVariableChange('doprava', 'skutečné', v)}
            />
            <ExpenseRow
              label="Škola"
              planned={zsMonthlyVariableExpenses.items.škola.plánované || 0}
              actual={zsMonthlyVariableExpenses.items.škola.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleVariableChange('škola', 'plánované', v)}
              onActualChange={(v) => handleVariableChange('škola', 'skutečné', v)}
            />
            <ExpenseRow
              label="Kroužky"
              planned={zsMonthlyVariableExpenses.items.kroužky.plánované || 0}
              actual={zsMonthlyVariableExpenses.items.kroužky.skutečné || 0}
              editable={editMode}
              onPlannedChange={(v) => handleVariableChange('kroužky', 'plánované', v)}
              onActualChange={(v) => handleVariableChange('kroužky', 'skutečné', v)}
            />
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

      {/* ACTION BUTTONS */}
      <Button fullWidth onClick={() => setEditMode(!editMode)} style={{ marginBottom: spacing.md }}>
        {editMode ? '✅ Uložit' : '✏️ Upravit'}
      </Button>

      {/* MODAL PRO KATEGORIE */}
      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
        <h2 style={{ marginBottom: spacing.md, color: colors.gold }}>➕ Přidat kategorii</h2>

        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Název kategorie"
          style={{
            width: '100%',
            padding: spacing.sm,
            backgroundColor: colors.blackCard,
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            color: colors.textPrimary,
            marginBottom: spacing.md,
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
          <Button onClick={handleAddCategory}>Přidat</Button>
          <Button onClick={() => setShowCategoryModal(false)}>Zrušit</Button>
        </div>
      </Modal>
    </div>
  )
}

// Helper komponenty
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
            value={planned}
            onChange={(e) => onPlannedChange(Number(e.target.value))}
            placeholder="Plánované"
            style={{
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
            }}
          />
          <input
            type="number"
            value={actual}
            onChange={(e) => onActualChange(Number(e.target.value))}
            placeholder="Skutečné"
            style={{
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
            }}
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
            value={planned}
            onChange={(e) => onPlannedChange(Number(e.target.value))}
            placeholder="Plánované"
            style={{
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
            }}
          />
          <input
            type="number"
            value={actual}
            onChange={(e) => onActualChange(Number(e.target.value))}
            placeholder="Skutečné"
            style={{
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
            }}
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
