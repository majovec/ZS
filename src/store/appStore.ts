import { create } from 'zustand'
import { User } from '@/models/types'
import { Category, Transaction, Goal, Investment, MonthSummary } from '@/models/types'

interface AppStore {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  // Data
  categories: Category[]
  setCategories: (categories: Category[]) => void

  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void

  goals: Goal[]
  setGoals: (goals: Goal[]) => void

  investments: Investment[]
  setInvestments: (investments: Investment[]) => void

  // UI State
  currentMonth: string
  setCurrentMonth: (month: string) => void

  monthSummary: MonthSummary | null
  setMonthSummary: (summary: MonthSummary) => void

  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void

  // Navigation
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void

  showAddTransactionModal: boolean
  setShowAddTransactionModal: (show: boolean) => void

  showSecretScreen: boolean
  setShowSecretScreen: (show: boolean) => void

  logoTapCount: number
  setLogoTapCount: (count: number) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Data
  categories: [],
  setCategories: (categories) => set({ categories }),

  transactions: [],
  setTransactions: (transactions) => set({ transactions }),

  goals: [],
  setGoals: (goals) => set({ goals }),

  investments: [],
  setInvestments: (investments) => set({ investments }),

  // UI State
  currentMonth: new Date().toISOString().slice(0, 7),
  setCurrentMonth: (currentMonth) => set({ currentMonth }),

  monthSummary: null,
  setMonthSummary: (monthSummary) => set({ monthSummary }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  // Navigation
  showLoginModal: false,
  setShowLoginModal: (showLoginModal) => set({ showLoginModal }),

  showAddTransactionModal: false,
  setShowAddTransactionModal: (showAddTransactionModal) => set({ showAddTransactionModal }),

  showSecretScreen: false,
  setShowSecretScreen: (showSecretScreen) => set({ showSecretScreen }),

  logoTapCount: 0,
  setLogoTapCount: (logoTapCount) => set({ logoTapCount }),
}))
