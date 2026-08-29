import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { useAppStore } from '@/store/appStore'
import { categoriesService, transactionsService, goalsService, investmentsService } from '@/services/firestoreService'
import { LoginScreen } from '@/pages/LoginScreen'
import { Dashboard } from '@/pages/Dashboard'
import { AddTransaction } from '@/pages/AddTransaction'
import { ChatScreen } from '@/pages/ChatScreen'
import { SettingsScreen } from '@/pages/SettingsScreen'
import { GoalsScreen } from '@/pages/GoalsScreen'
import { InvestmentsScreen } from '@/pages/InvestmentsScreen'
import { HistoryScreen } from '@/pages/HistoryScreen'
import { ChartsScreen } from '@/pages/ChartsScreen'
import { colors, spacing } from '@/theme/colors'

type Page = 'dashboard' | 'add-transaction' | 'chat' | 'settings' | 'goals' | 'investments' | 'history' | 'charts'

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [loading, setLoading] = useState(true)

  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const setCategories = useAppStore((state) => state.setCategories)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const setGoals = useAppStore((state) => state.setGoals)
  const setInvestments = useAppStore((state) => state.setInvestments)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || '',
          createdAt: new Date(),
        })

        try {
          const [categories, transactions, goals, investments] = await Promise.all([
            categoriesService.getCategories(authUser.uid),
            transactionsService.getTransactions(authUser.uid),
            goalsService.getGoals(authUser.uid),
            investmentsService.getInvestments(authUser.uid),
          ])

          setCategories(categories)
          setTransactions(transactions)
          setGoals(goals)
          setInvestments(investments)
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [setUser, setCategories, setTransactions, setGoals, setInvestments])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: colors.blackDeep,
          color: colors.textPrimary,
        }}
      >
        <p>Nahrávám aplikaci...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  const handleNavigate = (page: string) => {
    if (
      page === 'dashboard' ||
      page === 'add-transaction' ||
      page === 'chat' ||
      page === 'settings' ||
      page === 'goals' ||
      page === 'investments' ||
      page === 'history' ||
      page === 'charts'
    ) {
      setCurrentPage(page)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'add-transaction':
        return (
          <AddTransaction
            onComplete={() => {
              setCurrentPage('dashboard')
            }}
          />
        )
      case 'chat':
        return <ChatScreen />
      case 'settings':
        return <SettingsScreen />
      case 'goals':
        return <GoalsScreen />
      case 'investments':
        return <InvestmentsScreen />
      case 'history':
        return <HistoryScreen />
      case 'charts':
        return <ChartsScreen />
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.blackDeep,
      }}
    >
      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>

      {currentPage !== 'add-transaction' && currentPage !== 'chat' && (
        <nav
          style={{
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.blackSurface,
            padding: `${spacing.sm} 0`,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: spacing.sm,
          }}
        >
          <NavButton
            icon="📊"
            label="Přehled"
            active={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
          />

          <NavButton
            icon="📈"
            label="Grafy"
            active={currentPage === 'charts'}
            onClick={() => setCurrentPage('charts')}
          />

          <NavButton
            icon="➕"
            label="Nový"
            active={false}
            onClick={() => setCurrentPage('add-transaction')}
          />

          <NavButton
            icon="🎯"
            label="Cíle"
            active={currentPage === 'goals'}
            onClick={() => setCurrentPage('goals')}
          />

          <NavButton
            icon="⚙️"
            label="Více"
            active={false}
            onClick={() => setCurrentPage('settings')}
          />
        </nav>
      )}
    </div>
  )
}

interface NavButtonProps {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      color: active ? colors.gold : colors.textSecondary,
      cursor: 'pointer',
      padding: spacing.md,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
      fontSize: '24px',
      transition: 'color 0.3s ease',
    }}
  >
    <span>{icon}</span>
    <span style={{ fontSize: '11px' }}>{label}</span>
  </button>
)