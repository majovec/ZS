import React, { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { AboutSecretScreen } from './AboutSecretScreen'

export const SettingsScreen: React.FC = () => {
  const setUser = useAppStore((state) => state.setUser)
  const [showSecret, setShowSecret] = useState(false)
  const [longPressStartTime, setLongPressStartTime] = useState(0)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLongPressStart = () => {
    setLongPressStartTime(Date.now())
  }

  const handleLongPressEnd = () => {
    const pressDuration = Date.now() - longPressStartTime
    if (pressDuration > 500) {
      // Long press detected (more than 500ms)
      setShowSecret(true)
    }
  }

  if (showSecret) {
    return <AboutSecretScreen onClose={() => setShowSecret(false)} />
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
      <h1 style={{ marginBottom: spacing.lg }}>⚙️ Nastavení</h1>

      {/* AI Section */}
      <Card
        style={{
          marginBottom: spacing.lg,
          padding: spacing.md,
        }}
      >
        <h2 style={{ marginBottom: spacing.md, fontSize: '18px' }}>
          🤖 Lokální AI Rádce
        </h2>
        <p style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
          AI model Gemma běží přímo v tvém prohlížeči offline.
        </p>
        <Button fullWidth variant="secondary">
          Stav: Připraveno ✅
        </Button>
      </Card>

      {/* Notifications Section */}
      <Card
        style={{
          marginBottom: spacing.lg,
          padding: spacing.md,
        }}
      >
        <h2 style={{ marginBottom: spacing.md, fontSize: '18px' }}>
          🔔 Notifikace
        </h2>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            cursor: 'pointer',
          }}
        >
          <input type="checkbox" defaultChecked />
          <span>Denní připomínka na zápis výdajů</span>
        </label>
      </Card>

      {/* Account Section - Easter Egg */}
      <Card
        style={{
          marginBottom: spacing.lg,
          padding: spacing.md,
        }}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        <h2 style={{ marginBottom: spacing.md, fontSize: '18px' }}>
          👤 Účet
        </h2>
        <p style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
          Tvůj přihlášený účet a možnosti.
        </p>
        <Button
          fullWidth
          variant="danger"
          onClick={handleLogout}
          style={{ marginBottom: spacing.md }}
        >
          Odhlásit se
        </Button>
      </Card>

      {/* About Section */}
      <Card
        style={{
          padding: spacing.md,
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
          Finance pod kontrolou © 2026
        </p>
        <p style={{ margin: `${spacing.sm} 0 0`, fontSize: '12px', color: colors.textSecondary }}>
          Projekt @znovusilnejsi
        </p>
      </Card>
    </div>
  )
}
