import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { useAppStore } from '@/store/appStore'
import { Category, Transaction, TransactionType, TransactionSource, CategoryType } from '@/models/types'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { colors, spacing } from '@/theme/colors'

// Generuj ID bez extern závislostí
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

interface AddTransactionProps {
  onComplete: () => void
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ onComplete }) => {
  const user = useAppStore((state) => state.user)
  const categories = useAppStore((state) => state.categories)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const transactions = useAppStore((state) => state.transactions)
  const setCategories = useAppStore((state) => state.setCategories)

  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Modal pro novou kategorii
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>(CategoryType.VARIABLE)

  const filteredCategories = categories.filter((cat) => {
    if (type === TransactionType.INCOME) return cat.type === CategoryType.INCOME
    if (type === TransactionType.EXPENSE) {
      return (
        cat.type === CategoryType.FIXED ||
        cat.type === CategoryType.VARIABLE ||
        cat.type === CategoryType.UNEXPECTED
      )
    }
    return false
  })

  const handleCreateCategory = async () => {
    if (!newCategoryName || !user) {
      setError('Vyplň název kategorie')
      return
    }

    setLoading(true)

    try {
      const newCategory: Category = {
        id: generateId(),
        name: newCategoryName,
        type: newCategoryType,
        colorHex: colors.gold,
        icon: 'tag',
        isDefault: false,
      }

      // Ulož do Firestore
      await addDoc(
        collection(db, 'users', user.uid, 'categories'),
        newCategory
      )

      // Přidej do store
      setCategories([...categories, newCategory])
      setSelectedCategoryId(newCategory.id)

      // Zavři modal
      setShowCategoryModal(false)
      setNewCategoryName('')
      setNewCategoryType(CategoryType.VARIABLE)
    } catch (err: any) {
      setError(err.message || 'Chyba při vytvoření kategorie')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async () => {
    if (!selectedCategoryId || !amount || !user) {
      setError('Vyplň všechna pole')
      return
    }

    setLoading(true)
    setError('')

    try {
      const newTransaction: Transaction = {
        id: generateId(),
        categoryId: selectedCategoryId,
        type,
        amount: Number(amount),
        note,
        date: new Date(),
        source: TransactionSource.MANUAL,
        createdAt: new Date(),
      }

      // Ulož do Firestore
      await addDoc(
        collection(db, 'users', user.uid, 'transactions'),
        {
          ...newTransaction,
          date: newTransaction.date.toISOString(),
          createdAt: newTransaction.createdAt.toISOString(),
        }
      )

      // Přidej do store
      setTransactions([...transactions, newTransaction])

      // Resetuj a zavři
      setSelectedCategoryId('')
      setAmount('')
      setNote('')
      onComplete()
    } catch (err: any) {
      setError(err.message || 'Chyba při přidání transakce')
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
        color: colors.textPrimary,
      }}
    >
      <div style={{ marginBottom: spacing.lg }}>
        <h1 style={{ marginBottom: spacing.md }}>➕ Nový zápis</h1>

        {/* TYPE SELECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
          <button
            onClick={() => {
              setType(TransactionType.INCOME)
              setSelectedCategoryId('')
            }}
            style={{
              padding: spacing.md,
              backgroundColor: type === TransactionType.INCOME ? colors.gold : colors.blackCard,
              color: type === TransactionType.INCOME ? colors.blackDeep : colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            💰 Příjem
          </button>
          <button
            onClick={() => {
              setType(TransactionType.EXPENSE)
              setSelectedCategoryId('')
            }}
            style={{
              padding: spacing.md,
              backgroundColor: type === TransactionType.EXPENSE ? colors.gold : colors.blackCard,
              color: type === TransactionType.EXPENSE ? colors.blackDeep : colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            💸 Výdaj
          </button>
        </div>
      </div>

      <Card style={{ marginBottom: spacing.lg }}>
        {error && (
          <div
            style={{
              backgroundColor: colors.redExpense,
              color: 'white',
              padding: spacing.md,
              borderRadius: '4px',
              marginBottom: spacing.md,
            }}
          >
            {error}
          </div>
        )}

        {/* KATEGORIE */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Kategorie
          </label>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              style={{
                flex: 1,
                padding: spacing.sm,
                backgroundColor: colors.blackCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                color: colors.textPrimary,
              }}
            >
              <option value="">-- Vyber kategorii --</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowCategoryModal(true)}
              style={{
                padding: spacing.sm,
                backgroundColor: colors.gold,
                color: colors.blackDeep,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              ➕
            </button>
          </div>
        </div>

        {/* ČÁSTKA */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Částka (Kč)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: spacing.sm,
              backgroundColor: colors.blackCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.textPrimary,
              boxSizing: 'border-box',
              fontSize: '16px',
            }}
          />
        </div>

        {/* POZNÁMKA */}
        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Poznámka
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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

        {/* AKCE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
          <Button onClick={handleAddTransaction} disabled={loading}>
            {loading ? '⏳ Ukládám...' : '💾 Přidat'}
          </Button>
          <Button onClick={onComplete} disabled={loading}>
            ✕ Zrušit
          </Button>
        </div>
      </Card>

      {/* MODAL PRO NOVOU KATEGORII */}
      <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)}>
        <h2 style={{ marginBottom: spacing.md, color: colors.gold }}>➕ Nová kategorie</h2>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Název
          </label>
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
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Typ
          </label>
          <select
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value as CategoryType)}
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
            <option value={CategoryType.INCOME}>💰 Příjem</option>
            <option value={CategoryType.FIXED}>🔴 Fixní výdaj</option>
            <option value={CategoryType.VARIABLE}>🟠 Variabilní výdaj</option>
            <option value={CategoryType.UNEXPECTED}>🟣 Nečekaný výdaj</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
          <Button onClick={handleCreateCategory} disabled={loading}>
            {loading ? '⏳ Vytvářím...' : '✅ Vytvořit'}
          </Button>
          <Button onClick={() => setShowCategoryModal(false)} disabled={loading}>
            ✕ Zrušit
          </Button>
        </div>
      </Modal>
    </div>
  )
}
