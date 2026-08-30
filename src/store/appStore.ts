import { create } from 'zustand'
import { User, Category, Transaction, Goal, Investment, MonthSummary } from '@/models/types'
import { ZSMonthlyIncome, ZSMonthlyFixedExpenses, ZSMonthlyVariableExpenses, ZSMonthlyUnexpectedExpenses, ZSDailyExpense, ZSSavings, ZSInvestment, ZSMonthlySummary } from '@/models/types'

interface AppStore {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  // Data - Legacy
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

  // ===== ZNOVU SILNĚJŠÍ MODUL =====
  
  // Měsíční příjmy
  zsMonthlyIncome: ZSMonthlyIncome | null
  setZsMonthlyIncome: (income: ZSMonthlyIncome | null) => void

  // Měsíční fixní výdaje
  zsMonthlyFixedExpenses: ZSMonthlyFixedExpenses | null
  setZsMonthlyFixedExpenses: (expenses: ZSMonthlyFixedExpenses | null) => void

  // Měsíční variabilní výdaje
  zsMonthlyVariableExpenses: ZSMonthlyVariableExpenses | null
  setZsMonthlyVariableExpenses: (expenses: ZSMonthlyVariableExpenses | null) => void

  // Měsíční nečekané výdaje
  zsMonthlyUnexpectedExpenses: ZSMonthlyUnexpectedExpenses | null
  setZsMonthlyUnexpectedExpenses: (expenses: ZSMonthlyUnexpectedExpenses | null) => void

  // Denní výdaje
  zsDailyExpenses: ZSDailyExpense[]
  setZsDailyExpenses: (expenses: ZSDailyExpense[]) => void
  addZsDailyExpense: (expense: ZSDailyExpense) => void
  deleteZsDailyExpense: (id: string) => void

  // Spoření
  zsSavings: ZSSavings | null
  setZsSavings: (savings: ZSSavings | null) => void

  // Investice
  zsInvestments: ZSInvestment[]
  setZsInvestments: (investments: ZSInvestment[]) => void
  addZsInvestment: (investment: ZSInvestment) => void
  updateZsInvestment: (id: string, investment: ZSInvestment) => void
  deleteZsInvestment: (id: string) => void

  // Měsíční přehled
  zsMonthlySummary: ZSMonthlySummary | null
  setZsMonthlySummary: (summary: ZSMonthlySummary | null) => void
  calculateZsMonthlySummary: () => void

  // Aktuální měsíc pro ZS modul
  zsCurrentMonth: string
  setZsCurrentMonth: (month: string) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Data - Legacy
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

  // ===== ZNOVU SILNĚJŠÍ MODUL =====

  // Měsíční příjmy
  zsMonthlyIncome: null,
  setZsMonthlyIncome: (zsMonthlyIncome) => set({ zsMonthlyIncome }),

  // Měsíční fixní výdaje
  zsMonthlyFixedExpenses: null,
  setZsMonthlyFixedExpenses: (zsMonthlyFixedExpenses) => set({ zsMonthlyFixedExpenses }),

  // Měsíční variabilní výdaje
  zsMonthlyVariableExpenses: null,
  setZsMonthlyVariableExpenses: (zsMonthlyVariableExpenses) => set({ zsMonthlyVariableExpenses }),

  // Měsíční nečekané výdaje
  zsMonthlyUnexpectedExpenses: null,
  setZsMonthlyUnexpectedExpenses: (zsMonthlyUnexpectedExpenses) => set({ zsMonthlyUnexpectedExpenses }),

  // Denní výdaje
  zsDailyExpenses: [],
  setZsDailyExpenses: (zsDailyExpenses) => set({ zsDailyExpenses }),
  addZsDailyExpense: (expense) =>
    set((state) => ({
      zsDailyExpenses: [...state.zsDailyExpenses, expense],
    })),
  deleteZsDailyExpense: (id) =>
    set((state) => ({
      zsDailyExpenses: state.zsDailyExpenses.filter((e) => e.id !== id),
    })),

  // Spoření
  zsSavings: null,
  setZsSavings: (zsSavings) => set({ zsSavings }),

  // Investice
  zsInvestments: [],
  setZsInvestments: (zsInvestments) => set({ zsInvestments }),
  addZsInvestment: (investment) =>
    set((state) => ({
      zsInvestments: [...state.zsInvestments, investment],
    })),
  updateZsInvestment: (id, investment) =>
    set((state) => ({
      zsInvestments: state.zsInvestments.map((inv) =>
        inv.id === id ? investment : inv
      ),
    })),
  deleteZsInvestment: (id) =>
    set((state) => ({
      zsInvestments: state.zsInvestments.filter((inv) => inv.id !== id),
    })),

  // Měsíční přehled
  zsMonthlySummary: null,
  setZsMonthlySummary: (zsMonthlySummary) => set({ zsMonthlySummary }),

  // Výpočet měsíčního přehledu
  calculateZsMonthlySummary: () => {
    const state = get()
    const income = state.zsMonthlyIncome
    const fixed = state.zsMonthlyFixedExpenses
    const variable = state.zsMonthlyVariableExpenses
    const unexpected = state.zsMonthlyUnexpectedExpenses

    if (!income || !fixed || !variable) return

    const příjmyPlánované =
      (income.items.výplata.plánované || 0) +
      (income.items.brigáda.plánované || 0) +
      (income.items.dárek.plánované || 0) +
      (income.items.podnikání.plánované || 0)

    const příjmySkutečné =
      (income.items.výplata.skutečné || 0) +
      (income.items.brigáda.skutečné || 0) +
      (income.items.dárek.skutečné || 0) +
      (income.items.podnikání.skutečné || 0)

    // Fixní výdaje
    const fixedPlanned =
      (fixed.items.nájem.plánované || 0) +
      (fixed.items.energie.plánované || 0) +
      (fixed.items.telefon.plánované || 0) +
      (fixed.items.internet.plánované || 0) +
      (fixed.items.pojistky.plánované || 0) +
      (fixed.items.splátky.plánované || 0)

    const fixedActual =
      (fixed.items.nájem.skutečné || 0) +
      (fixed.items.energie.skutečné || 0) +
      (fixed.items.telefon.skutečné || 0) +
      (fixed.items.internet.skutečné || 0) +
      (fixed.items.pojistky.skutečné || 0) +
      (fixed.items.splátky.skutečné || 0)

    // Variabilní výdaje
    const variablePlanned =
      (variable.items.osobka.plánované || 0) +
      (variable.items.jídlo.plánované || 0) +
      (variable.items.doprava.plánované || 0) +
      (variable.items.škola.plánované || 0) +
      (variable.items.kroužky.plánované || 0)

    const variableActual =
      (variable.items.osobka.skutečné || 0) +
      (variable.items.jídlo.skutečné || 0) +
      (variable.items.doprava.skutečné || 0) +
      (variable.items.škola.skutečné || 0) +
      (variable.items.kroužky.skutečné || 0)

    // Nečekané výdaje
    const unexpectedPlanned = unexpected
      ? unexpected.items.reduce((sum, item) => sum + (item.plánované || 0), 0)
      : 0
    const unexpectedActual = unexpected
      ? unexpected.items.reduce((sum, item) => sum + (item.skutečné || 0), 0)
      : 0

    const výdajePlánované = fixedPlanned + variablePlanned + unexpectedPlanned
    const výdajeSkutečné = fixedActual + variableActual + unexpectedActual

    const výsledekPlánovaný = příjmyPlánované - výdajePlánované
    const výsledekSkutečný = příjmySkutečné - výdajeSkutečné

    const summary: ZSMonthlySummary = {
      měsíc: state.zsCurrentMonth,
      příjmyPlánované,
      příjmySkutečné,
      výdajePlánované,
      výdajeSkutečné,
      výsledekPlánovaný,
      výsledekSkutečný,
      skutečněZbylo: výsledekSkutečný,
    }

    set({ zsMonthlySummary: summary })
  },

  // Aktuální měsíc pro ZS modul
  zsCurrentMonth: new Date().toISOString().slice(0, 7),
  setZsCurrentMonth: (zsCurrentMonth) => set({ zsCurrentMonth }),
}))
