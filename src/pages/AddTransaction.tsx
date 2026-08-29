import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { transactionsService } from '@/services/firestoreService'
import { ocrService } from '@/services/ocrService'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { TransactionType, TransactionSource } from '@/models/types'

export const AddTransaction: React.FC<{
  onComplete: () => void
}> = ({ onComplete }) => {
  const user = useAppStore((state) => state.user)
  const categories = useAppStore((state) => state.categories)
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ocrResult, setOcrResult] = useState<any>(null)
  const [showOcrResult, setShowOcrResult] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) throw new Error('Uživatel není přihlášen')
      if (!categoryId) throw new Error('Vyber kategorii')
      if (!amount) throw new Error('Vyplň částku')

      await transactionsService.addTransaction(user.uid, {
        categoryId,
        type,
        amount: parseFloat(amount),
        note,
        date: new Date(),
        source: TransactionSource.MANUAL,
        createdAt: new Date(),
      })

      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba')
    } finally {
      setLoading(false)
    }
  }

  const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const result = await ocrService.processReceiptImage(file)
      setOcrResult(result)
      setShowOcrResult(true)
    } catch (err) {
      setError('Chyba při zpracování obrázku')
    } finally {
      setLoading(false)
    }
  }

  const applyOcrResult = () => {
    if (ocrResult) {
      if (ocrResult.amount) setAmount(ocrResult.amount.toString())
      setNote(ocrResult.merchant || '')
      if (ocrResult.category) setCategoryId(ocrResult.category)
      setShowOcrResult(false)
    }
  }

  const filteredCategories =
    type === TransactionType.INCOME
      ? categories.filter((c) => c.type === 'income')
      : categories.filter((c) => c.type !== 'income')

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        minHeight: '100vh',
        padding: spacing.md,
        color: colors.textPrimary,
      }}
    >
      <h1 style={{ marginBottom: spacing.lg }}>Nový zápis</h1>

      <div
        style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.lg,
        }}
      >
        <Button
          variant={type === TransactionType.INCOME ? 'primary' : 'secondary'}
          onClick={() => setType(TransactionType.INCOME)}
          fullWidth
        >
          Příjem
        </Button>
        <Button
          variant={type === TransactionType.EXPENSE ? 'primary' : 'secondary'}
          onClick={() => setType(TransactionType.EXPENSE)}
          fullWidth
        >
          Výdaj
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: 'block',
            marginBottom: spacing.sm,
            color: colors.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Kategorie
        </label>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{
            width: '100%',
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.blackSurface,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            color: colors.textPrimary,
            marginBottom: spacing.md,
            fontFamily: 'inherit',
          }}
        >
          <option value="">Vyber kategorii</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Input
          type="number"
          label="Částka (Kč)"
          placeholder="0"
          value={amount}
          onChange={setAmount}
        />

        <Input
          type="text"
          label="Poznámka"
          placeholder="Náklady na..."
          value={note}
          onChange={setNote}
        />

        <label
          style={{
            display: 'block',
            marginBottom: spacing.md,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleOCR}
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => {
              const input = document.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement
              input?.click()
            }}
          >
            📷 Naskenovat účtenku
          </Button>
        </label>

        {error && (
          <div
            style={{
              marginBottom: spacing.md,
              padding: spacing.md,
              backgroundColor: colors.redExpense,
              borderRadius: '8px',
              color: colors.textPrimary,
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Přidat
        </Button>
      </form>

      {showOcrResult && ocrResult && (
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
        >
          <Card
            style={{
              maxWidth: '300px',
              padding: spacing.lg,
            }}
          >
            <h2 style={{ marginBottom: spacing.md }}>Výsledek skenování</h2>

            <p>
              <strong>Obchod:</strong> {ocrResult.merchant}
            </p>

            <p>
              <strong>Částka:</strong> {ocrResult.amount} Kč
            </p>

            <p style={{ fontSize: '12px', color: colors.textSecondary }}>
              Důvěra: {Math.round(ocrResult.confidence * 100)}%
            </p>

            <div
              style={{
                display: 'flex',
                gap: spacing.sm,
                marginTop: spacing.lg,
              }}
            >
              <Button fullWidth onClick={applyOcrResult}>
                Použít
              </Button>

              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowOcrResult(false)}
              >
                Storno
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}