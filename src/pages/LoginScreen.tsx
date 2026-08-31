import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import { useAppStore } from '@/store/appStore'
import { DEFAULT_CATEGORIES } from '@/models/types'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { colors, spacing } from '@/theme/colors'

export const LoginScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setUser = useAppStore((state) => state.setUser)
  const setCategories = useAppStore((state) => state.setCategories)

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      setError('Vyplň všechna pole')
      return
    }

    setLoading(true)
    setError('')

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user

      // Ulož uživatele do Firestore
      await addDoc(collection(db, 'users'), {
        uid: newUser.uid,
        email: newUser.email,
        displayName: displayName,
        createdAt: new Date(),
      })

      // Inicializuj DEFAULT_CATEGORIES
      const categoriesRef = collection(db, 'users', newUser.uid, 'categories')
      await Promise.all(
        DEFAULT_CATEGORIES.map((cat) =>
          addDoc(categoriesRef, {
            name: cat.name,
            type: cat.type,
            colorHex: cat.colorHex,
            icon: cat.icon,
            isDefault: cat.isDefault,
          })
        )
      )

      // Ulož do store
      setUser({
        uid: newUser.uid,
        email: newUser.email || '',
        displayName: displayName,
        createdAt: new Date(),
      })

      setCategories(DEFAULT_CATEGORIES)

      // Resetuj formulář
      setEmail('')
      setPassword('')
      setDisplayName('')
      setIsSignUp(false)
    } catch (err: any) {
      setError(err.message || 'Chyba při registraci')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Vyplň všechna pole')
      return
    }

    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const authUser = userCredential.user

      // Načti uživatele z Firestore
      const usersQuery = query(
        collection(db, 'users'),
        where('uid', '==', authUser.uid)
      )
      const querySnapshot = await getDocs(usersQuery)
      const userData = querySnapshot.docs[0]?.data()

      // Načti kategorie
      const categoriesQuery = await getDocs(
        collection(db, 'users', authUser.uid, 'categories')
      )
      const categories = categoriesQuery.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        colorHex: doc.data().colorHex,
        icon: doc.data().icon,
        isDefault: doc.data().isDefault,
      }))

      setUser({
        uid: authUser.uid,
        email: authUser.email || '',
        displayName: userData?.displayName || '',
        createdAt: new Date(),
      })

      setCategories(categories)

      // Resetuj formulář
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.message || 'Chyba při přihlášení')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: spacing.md,
        backgroundColor: colors.blackDeep,
      }}
    >
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <h1 style={{ color: colors.gold, marginBottom: spacing.sm }}>💰 Finance</h1>
          <p style={{ color: colors.textSecondary }}>Znovu Silnější</p>
        </div>

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

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tvůj@email.com"
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
            Heslo
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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

        {isSignUp && (
          <div style={{ marginBottom: spacing.md }}>
            <label style={{ display: 'block', marginBottom: spacing.sm, fontSize: '12px' }}>
              Jméno
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tvoje jméno"
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
        )}

        <Button
          fullWidth
          onClick={isSignUp ? handleSignUp : handleSignIn}
          disabled={loading}
          style={{ marginBottom: spacing.md }}
        >
          {loading ? '⏳ Čekej...' : isSignUp ? '📝 Registrovat' : '🔓 Přihlásit'}
        </Button>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
          style={{
            background: 'none',
            border: 'none',
            color: colors.gold,
            cursor: 'pointer',
            fontSize: '14px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {isSignUp ? '👤 Máš účet? Přihlaš se' : '📝 Nemáš účet? Zaregistruj se'}
        </button>
      </Card>
    </div>
  )
}
