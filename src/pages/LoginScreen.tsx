import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '@/services/firebase'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { colors, spacing, typography } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setUser = useAppStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        if (password !== passwordConfirm) {
          throw new Error('Hesla se neshodují')
        }
        if (password.length < 6) {
          throw new Error('Heslo musí mít aspoň 6 znaků')
        }
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      // Uživatel je přihlášen
      if (auth.currentUser) {
        setUser({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || '',
          createdAt: new Date(),
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při ověření')
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
        backgroundColor: colors.blackDeep,
        padding: spacing.md,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 32px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.gold,
          }}
        >
          <img src={`${import.meta.env.BASE_URL}android_192x192.png`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h1
          style={{
            color: colors.textPrimary,
            marginBottom: spacing.sm,
            ...typography.h2,
          }}
        >
          Finance pod kontrolou
        </h1>

        <p
          style={{
            color: colors.textSecondary,
            marginBottom: spacing.lg,
          }}
        >
          {isRegister ? 'Vytvoř si účet' : 'Přihlas se'}
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="E-mail"
            placeholder="tvoje@email.cz"
            value={email}
            onChange={setEmail}
          />

          <Input
            type="password"
            label="Heslo"
            placeholder="Aspoň 6 znaků"
            value={password}
            onChange={setPassword}
          />

          {isRegister && (
            <Input
              type="password"
              label="Potvrdi heslo"
              placeholder="Zopakuj heslo"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
          )}

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

          <Button
            type="submit"
            fullWidth
            loading={loading}
            style={{ marginBottom: spacing.md }}
          >
            {isRegister ? 'Zaregistrovat se' : 'Přihlásit se'}
          </Button>
        </form>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            setIsRegister(!isRegister)
            setError('')
          }}
        >
          {isRegister ? 'Už mám účet' : 'Nemám účet'}
        </Button>
      </div>
    </div>
  )
}
