import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
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
import { MonthlyScreen } from '@/pages/MonthlyScreen'
import { DailyExpensesScreen } from '@/pages/DailyExpensesScreen'
import { SavingsInvestmentScreen } from '@/pages/SavingsInvestmentScreen'
import { colors, spacing } from '@/theme/colors'

type Page = 'dashboard' | 'add-transaction' | 'chat' | 'settings' | 'goals' | 'investments' | 'history' | 'charts' | 'monthly' | 'daily' | 'savings'

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [loading, setLoading] = useState(true)

  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const setCategories = useAppStore((state) => state.setCategories)
  const setTransactions = useAppStore((state) => state.setTransactions)
  const setGoals = useAppStore((state) => state.setGoals)
  const setInvestments = useAppStore((state) => state.setInvestments)

  // BEZPEČNOSTNÍ CHECK - Detekuj nové okno/incognito
  useEffect(() => {
    const sessionKey = 'app_session_id'
    const storedSessionId = sessionStorage.getItem(sessionKey)

    if (!storedSessionId) {
      // Toto je nové okno nebo incognito mode
      // Vymaž veškerou auth
      console.log('🔒 Detekováno nové okno/incognito - logout')
      
      // Vymaž localStorage auth
      localStorage.removeItem('firebase_auth')
      localStorage.removeItem('firebase_auth_user')
      
      // Vymaž sessionStorage
      sessionStorage.clear()
      
      // Odhlásit z Firebase
      signOut(auth).catch(() => {
        console.log('Already logged out')
      })
      
      // Vytvoř nové session ID
      const newSessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem(sessionKey, newSessionId)
      
      setUser(null)
      setLoading(false)
      return
    }

    // Je to stejné okno - pokračuj normálně
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      clearTimeout(timeout)
      
      if (authUser) {
        // Zkontroluj jestli je session stále validní
        const currentSessionId = sessionStorage.getItem(sessionKey)
        
        if (!currentSessionId) {
          // Session se vymazala - logout
          console.log('🔒 Session vymazána - logout')
          await signOut(auth)
          setUser(null)
          setLoading(false)
          return
        }

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

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [setUser, setCategories, setTransactions, setGoals, setInvestments])

  // DETEKUJ zavření okna - vymaž session
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Když se zavře okno, nevymazuj session (chceme aby příště fungovalo)
      // Jen při novém incognito okně se detekuje že sesssionStorage je prázdný
    }

    const handleVisibilityChange = () => {
      // Když se přepne na jiné okno a pak zpátky
      const sessionKey = 'app_session_id'
      const sessionId = sessionStorage.getItem(sessionKey)
      
      if (!sessionId && user) {
        // Session zmizela ale uživatel je přihlášený = logout
        console.log('🔒 Session zmizela - logout')
        signOut(auth)
        setUser(null)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, setUser])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: colors.blackDeep,
          color: colors.textPrimary,
          gap: spacing.md,
        }}
      >
        <p>Nahrávám aplikaci...</p>
        <button
          onClick={() => setLoading(false)}
          style={{
            background: colors.gold,
            color: colors.blackDeep,
            border: 'none',
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Přeskočit načítání
        </button>
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
      page === 'charts' ||
      page === 'monthly' ||
      page === 'daily' ||
      page === 'savings'
    ) {
      setCurrentPage(page as Page)
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
      case 'monthly':
        return <MonthlyScreen />
      case 'daily':
        return <DailyExpensesScreen />
      case 'savings':
        return <SavingsInvestmentScreen />
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  const showNav = currentPage !== 'add-transaction' && currentPage !== 'chat'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        backgroundColor: colors.blackDeep,
        paddingBottom: showNav ? '80px' : '0',
      }}
    >
      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>

      {showNav && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.blackSurface,
            paddingTop: spacing.sm,
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: spacing.sm,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
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
            icon="📅"
            label="ZS"
            active={currentPage === 'monthly' || currentPage === 'daily' || currentPage === 'savings'}
            onClick={() => setCurrentPage('monthly')}
          />

          <NavButton
            icon="⚙️"
            label="Více"
            active={currentPage === 'settings'}
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
      padding: spacing.xs,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      fontSize: '22px',
      transition: 'color 0.3s ease',
    }}
  >
    <span>{icon}</span>
    <span style={{ fontSize: '11px' }}>{label}</span>
  </button>
)
