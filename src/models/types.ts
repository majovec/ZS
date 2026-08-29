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
  { id: 'var-personal', name: 'Osobní péče', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'heart', isDefault: true },
  { id: 'var-transport', name: 'Doprava', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'car', isDefault: true },
  { id: 'var-education', name: 'Vzdělání', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'book', isDefault: true },
  { id: 'var-hobby', name: 'Kroužky', type: CategoryType.VARIABLE, colorHex: '#FFA500', icon: 'activity', isDefault: true },

  // Nečekané výdaje
  { id: 'unexp-repair', name: 'Oprava', type: CategoryType.UNEXPECTED, colorHex: '#9C27B0', icon: 'wrench', isDefault: true },
  { id: 'unexp-shopping', name: 'Nákupy', type: CategoryType.UNEXPECTED, colorHex: '#9C27B0', icon: 'shopping-cart', isDefault: true },
]
