import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { goalsService } from '@/services/firestoreService'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Goal, GoalType } from '@/models/types'

export const GoalsScreen: React.FC = () => {
  const user = useAppStore((state) => state.user)
  const goals = useAppStore((state) => state.goals)
  const setGoals = useAppStore((state) => state.setGoals)

  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<GoalType>(GoalType.DEBT_PAYOFF)
  const [targetAmount, setTargetAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title || !targetAmount) return

    setLoading(true)
    try {
      const newGoal: Omit<Goal, 'id'> = {
        title,
        type,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        isActive: true,
      }
      await goalsService.addGoal(user.uid, newGoal)
      const updatedGoals = await goalsService.getGoals(user.uid)
      setGoals(updatedGoals)
      setTitle('')
      setTargetAmount('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding goal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return
    try {
      await goalsService.deleteGoal(user.uid, goalId)
      const updatedGoals = await goalsService.getGoals(user.uid)
      setGoals(updatedGoals)
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const activeGoals = goals.filter((g) => g.isActive)

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>🎯 Cíle</h1>

      {!showAddForm && (
        <Button
          fullWidth
          onClick={() => setShowAddForm(true)}
          style={{ marginBottom: spacing.lg }}
        >
          ➕ Nový cíl
        </Button>
      )}

      {showAddForm && (
        <Card style={{ marginBottom: spacing.lg, padding: spacing.lg }}>
          <form onSubmit={handleAddGoal}>
            <Input
              label="Název cíle"
              placeholder="Splácení dluhu..."
              value={title}
              onChange={setTitle}
            />

            <label
              style={{
                display: 'block',
                marginBottom: spacing.md,
                color: colors.textSecondary,
              }}
            >
              Typ cíle
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GoalType)}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: spacing.sm,
                  padding: `${spacing.sm} ${spacing.md}`,
                  backgroundColor: colors.blackSurface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  color: colors.textPrimary,
                }}
              >
                <option value={GoalType.DEBT_PAYOFF}>Splácení dluhu</option>
                <option value={GoalType.RESERVE}>Rezerva</option>
                <option value={GoalType.OTHER}>Jiné</option>
              </select>
            </label>

            <Input
              type="number"
              label="Cílová částka (Kč)"
              placeholder="0"
              value={targetAmount}
              onChange={setTargetAmount}
            />

            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button type="submit" fullWidth loading={loading}>
                Vytvořit
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

      {activeGoals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: spacing.lg }}>
          <p style={{ color: colors.textSecondary }}>Nemáš zatím žádné cíle</p>
        </Card>
      ) : (
        activeGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          return (
            <Card key={goal.id} style={{ marginBottom: spacing.md, padding: spacing.md }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <h3 style={{ margin: 0 }}>{goal.title}</h3>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
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

              <div
                style={{
                  backgroundColor: colors.blackSurface,
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: spacing.sm,
                }}
              >
                <div
                  style={{
                    backgroundColor: colors.gold,
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <p style={{ margin: 0, color: colors.textSecondary, fontSize: '12px' }}>
                {goal.currentAmount.toFixed(0)} / {goal.targetAmount.toFixed(0)} Kč ({Math.round(progress)}%)
              </p>
            </Card>
          )
        })
      )}
    </div>
  )
}
