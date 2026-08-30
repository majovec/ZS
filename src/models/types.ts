// Models - TypeScript verze Android modelů

export enum CategoryType {
  INCOME = 'income',
  FIXED = 'fixed',
  VARIABLE = 'variable',
  UNEXPECTED = 'unexpected',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionSource {
  MANUAL = 'manual',
  RECEIPT_OCR = 'receiptOcr',
}

export enum GoalType {
  DEBT_PAYOFF = 'debtPayoff',
  RESERVE = 'reserve',
  OTHER = 'other',
}

export interface Category {
  id: string
  name: string
  type: CategoryType
  colorHex: string
  icon: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  categoryId: string
  type: TransactionType
  amount: number
  note: string
  date: Date
  source: TransactionSource
  createdAt: Date
}

export interface MonthlyBudget {
  id: string
  categoryId: string
  yearMonth: string
  plannedAmount: number
}

export interface Investment {
  id: string
  name: string
  amount: number
  date: Date
  isSavings: boolean
}

export interface Goal {
  id: string
  title: string
  type: GoalType
  targetAmount: number
  currentAmount: number
  deadline?: Date
  isActive: boolean
}

export interface User {
  uid: string
  email: string
  displayName: string
  createdAt: Date
}

export interface MonthSummary {
  plannedIncome: number
  actualIncome: number
  plannedExpense: number
  actualExpense: number
  categoryActuals: Record<string, number>
}

// ===== ZNOVU SILNĚJŠÍ MODUL =====

// Měsíční příjmy
export interface ZSMonthlyIncome {
  id: string
  userId: string
  month: string // "2025-02" formát
  items: {
    výplata: { plánované: number; skutečné: number }
    brigáda: { plánované: number; skutečné: number }
    dárek: { plánované: number; skutečné: number }
    podnikání: { plánované: number; skutečné: number }
  }
  createdAt: Date
  updatedAt: Date
}

// Měsíční fixní výdaje
export interface ZSMonthlyFixedExpenses {
  id: string
  userId: string
  month: string
  items: {
    nájem: { plánované: number; skutečné: number }
    energie: { plánované: number; skutečné: number }
    telefon: { plánované: number; skutečné: number }
    internet: { plánované: number; skutečné: number }
    pojistky: { plánované: number; skutečné: number }
    splátky: { plánované: number; skutečné: number }
  }
  createdAt: Date
  updatedAt: Date
}

// Měsíční variabilní výdaje
export interface ZSMonthlyVariableExpenses {
  id: string
  userId: string
  month: string
  items: {
    osobka: { plánované: number; skutečné: number }
    jídlo: { plánované: number; skutečné: number }
    doprava: { plánované: number; skutečné: number }
    škola: { plánované: number; skutečné: number }
    kroužky: { plánované: number; skutečné: number }
  }
  createdAt: Date
  updatedAt: Date
}

// Měsíční nečekané výdaje
export interface ZSMonthlyUnexpectedExpenses {
  id: string
  userId: string
  month: string
  items: Array<{
    id: string
    název: string
    plánované: number
    skutečné: number
  }>
  createdAt: Date
  updatedAt: Date
}

// Denní výdaje
export interface ZSDailyExpense {
  id: string
  userId: string
  datum: Date
  kategorie: 'jídlo' | 'osobka' | 'doprava' | 'nečekané'
  částka: number
  poznámka: string
  createdAt: Date
}

// Spoření
export interface ZSSavings {
  id: string
  userId: string
  month: string
  plánované: number
  skutečné: number
  zůstatek: number
  createdAt: Date
  updatedAt: Date
}

// Investice
export interface ZSInvestment {
  id: string
  userId: string
  název: string
  počátek: number // Počáteční suma
  investováno: number // Kolik bylo investováno
  bank: number // Aktuální zůstatek
  měsíc: string
  položky: Array<{
    datum: Date
    částka: number
    popis: string
  }>
  createdAt: Date
  updatedAt: Date
}

// Měsíční přehled (SHRNUTÍ)
export interface ZSMonthlySummary {
  měsíc: string
  příjmyPlánované: number
  příjmySkutečné: number
  výdajePlánované: number
  výdajeSkutečné: number
  výsledekPlánovaný: number
  výsledekSkutečný: number
  skutečněZbylo: number
}

export const DEFAULT_CATEGORIES: Category[] = [
  // Příjmy
  { id: 'income-salary', name: 'Výplata', type: CategoryType.INCOME, colorHex: '#4CAF50', icon: 'briefcase', isDefault: true },
  { id: 'income-gig', name: 'Brigáda', type: CategoryType.INCOME, colorHex: '#4CAF50', icon: 'star', isDefault: true },
  { id: 'income-gift', name: 'Dárek', type: CategoryType.INCOME, colorHex: '#4CAF50', icon: 'gift', isDefault: true },
  { id: 'income-business', name: 'Podnikání', type: CategoryType.INCOME, colorHex: '#4CAF50', icon: 'trending', isDefault: true },

  // Fixní výdaje
  { id: 'fixed-rent', name: 'Nájem', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'home', isDefault: true },
  { id: 'fixed-energy', name: 'Energie', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'zap', isDefault: true },
  { id: 'fixed-phone', name: 'Telefon', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'phone', isDefault: true },
  { id: 'fixed-internet', name: 'Internet', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'wifi', isDefault: true },
  { id: 'fixed-insurance', name: 'Pojistky', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'shield', isDefault: true },
  { id: 'fixed-installment', name: 'Splátky', type: CategoryType.FIXED, colorHex: '#FF6B6B', icon: 'credit', isDefault: true },

  // Variabilní výdaje
  { id: 'var-food', name: 'Jídlo', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'utensils', isDefault: true },
  { id: 'var-personal', name: 'Osobka', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'heart', isDefault: true },
  { id: 'var-transport', name: 'Doprava', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'car', isDefault: true },
  { id: 'var-education', name: 'Škola', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'book', isDefault: true },
  { id: 'var-hobby', name: 'Kroužky', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'activity', isDefault: true },

  // Nečekané výdaje
  { id: 'unexp-repair', name: 'Oprava', type: CategoryType.UNEXPECTED, colorHex: '#9C27B0', icon: 'wrench', isDefault: true },
  { id: 'unexp-shopping', name: 'Nákupy', type: CategoryType.UNEXPECTED, colorHex: '#9C27B0', icon: 'shopping-cart', isDefault: true },
]
