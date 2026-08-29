import { useState, useEffect } from 'react'
import { auth } from '@/services/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { colors, spacing } from '@/theme/colors'
import { useAppStore } from '@/store/appStore'
import { LoginScreen } from '@/pages/LoginScreen'
import { Dashboard } from '@/pages/Dashboard'
import AddTransaction from '@/pages/AddTransaction'
import { ChatScreen } from '@/pages/ChatScreen'
import { HistoryScreen } from '@/pages/HistoryScreen'
import ChartsScreen from '@/pages/ChartsScreen'
import { GoalsScreen } from '@/pages/GoalsScreen'
import { InvestmentsScreen } from '@/pages/InvestmentsScreen'
import { SettingsScreen } from '@/pages/SettingsScreen'

type Page =
  | 'login'
  | 'dashboard'
  | 'add-transaction'
  | 'chat'
  | 'history'
  | 'charts'
  | 'goals'
  | 'investments'
  | 'settings'

interface NavItem {
  id: Page
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'history', icon: '📋', label: 'Historie' },
  { id: 'charts', icon: '📈', label: 'Grafy' },
  { id: 'goals', icon: '🎯', label: 'Cíle' },
  { id: 'investments', icon: '💰', label: 'Spoření' },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')
  const [isLoading, setIsLoading] = useState(true)

  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Uživatel',
        })
        setCurrentPage('dashboard')
      } else {
        setUser(null)
        setCurrentPage('login')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setUser])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentPage('login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigateHandler = (page: string) => {
    setCurrentPage(page as Page)
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: colors.gold,
            fontSize: '20px',
          }}
        >
          ⏳ Načítání...
        </div>
      )
    }

    if (!user) {
      return <LoginScreen />
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateHandler} />
      case 'add-transaction':
        return <AddTransaction onNavigate={navigateHandler} />
      case 'chat':
        return <ChatScreen onNavigate={navigateHandler} />
      case 'history':
        return <HistoryScreen onNavigate={navigateHandler} />
      case 'charts':
        return <ChartsScreen onNavigate={navigateHandler} />
      case 'goals':
        return <GoalsScreen onNavigate={navigateHandler} />
      case 'investments':
        return <InvestmentsScreen onNavigate={navigateHandler} />
      case 'settings':
        return <SettingsScreen onNavigate={navigateHandler} onLogout={handleLogout} />
      default:
        return <Dashboard onNavigate={navigateHandler} />
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.blackDeep,
        color: colors.textPrimary,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Main content */}
      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      {!['add-transaction', 'chat'].includes(currentPage) && user && (
        <nav
          style={{
            backgroundColor: colors.blackCard,
            borderTop: `1px solid ${colors.border}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            padding: `${spacing.sm} 0`,
            position: 'sticky',
            bottom: 0,
            zIndex: 100,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                backgroundColor: currentPage === item.id ? colors.gold + '20' : 'transparent',
                border: 'none',
                color: currentPage === item.id ? colors.gold : colors.textSecondary,
                cursor: 'pointer',
                padding: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
                fontSize: '12px',
                fontWeight: currentPage === item.id ? '600' : '400',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.color = colors.gold
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.color = colors.textSecondary
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
