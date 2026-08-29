import React, { useState } from 'react'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { transactionsService } from '@/services/firestoreService'
import { ocrService } from '@/services/ocrService'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { TransactionType, TransactionSource } from '@/models/types'

interface AddTransactionProps {
  onNavigate: (page: string) => void
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onNavigate }) => {
  const user = useAppStore((state) => state.user)
  const categories = useAppStore((state) => state.categories)
  const [type, setType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddTransaction = async () => {
    if (!user || !categoryId || !amount) {
      alert('Vyplň všechna pole')
      return
    }

    setLoading(true)
    try {
      await transactionsService.addTransaction(user.uid, {
        type,
        categoryId,
        amount: parseFloat(amount),
        note,
        date: new Date(),
        source: TransactionSource.MANUAL,
      })
      setAmount('')
      setNote('')
      setCategoryId('')
      onNavigate('history')
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Chyba při přidání transakce')
    } finally {
      setLoading(false)
    }
  }

  const handleScanReceipt = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        setLoading(true)
        try {
          const result = await ocrService.processReceiptImage(file)
          setAmount(result.amount?.toString() || '')
        } catch (error) {
          console.error('OCR Error:', error)
        } finally {
          setLoading(false)
        }
      }

      input.click()
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  return (
    <div style={{ padding: spacing.md, paddingBottom: 80 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <h1 style={{ margin: 0, color: colors.gold }}>Nová transakce</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: colors.gold,
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <Card>
        <div style={{ marginBottom: spacing.md }}>
          <label style={{ color: colors.textSecondary, display: 'block', marginBottom: spacing.sm }}>
            Typ
          </label>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <Button
              variant={type === 'income' ? 'primary' : 'secondary'}
              onClick={() => setType('income' as TransactionType)}
              fullWidth
            >
              Příjem 💰
            </Button>
            <Button
              variant={type === 'expense' ? 'primary' : 'secondary'}
              onClick={() => setType('expense' as TransactionType)}
              fullWidth
            >
              Výdaj 💸
            </Button>
          </div>
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ color: colors.textSecondary, display: 'block', marginBottom: spacing.sm }}>
            Kategorie
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              width: '100%',
              padding: spacing.md,
              backgroundColor: colors.blackSurface,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.textPrimary,
            }}
          >
            <option value="">Vyber kategorii</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Částka (Kč)"
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="0"
        />

        <Input
          label="Poznámka (optional)"
          value={note}
          onChange={setNote}
          placeholder="Popis transakce"
        />

        <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.lg }}>
          <Button onClick={handleAddTransaction} loading={loading} fullWidth>
            Přidat
          </Button>
          <Button variant="secondary" onClick={handleScanReceipt} fullWidth>
            📷 Skenovat
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AddTransaction
