import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  ZSDailyExpense,
  ZSInvestment,
  ZSMonthlyFixedExpenses,
  ZSMonthlyIncome,
  ZSMonthlyUnexpectedExpenses,
  ZSMonthlyVariableExpenses,
  ZSSavings,
} from '@/models/types'

const USERS = 'users'
const ZS = 'zs'

const monthDoc = (userId: string, type: string, month: string) =>
  doc(db, USERS, userId, ZS, type, month)

const toDate = (value: any): Date => {
  if (value?.toDate) return value.toDate()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

const serialize = (value: any): any => {
  if (value instanceof Date) return Timestamp.fromDate(value)
  if (Array.isArray(value)) return value.map(serialize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v)]))
  }
  return value
}

const deserializeDates = (value: any): any => {
  if (Array.isArray(value)) return value.map(deserializeDates)
  if (value?.toDate) return value.toDate()
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deserializeDates(v)]))
  }
  return value
}

async function getMonth<T>(userId: string, type: string, month: string): Promise<T | null> {
  const snapshot = await getDoc(monthDoc(userId, type, month))
  return snapshot.exists() ? (deserializeDates({ id: snapshot.id, ...snapshot.data() }) as T) : null
}

async function saveMonth(userId: string, type: string, month: string, value: any): Promise<void> {
  await setDoc(monthDoc(userId, type, month), serialize(value), { merge: true })
}

export const zsFirestoreService = {
  async loadMonth(userId: string, month: string) {
    try {
      const [income, fixed, variable, unexpected, savings] = await Promise.all([
      getMonth<ZSMonthlyIncome>(userId, 'monthlyIncome', month),
      getMonth<ZSMonthlyFixedExpenses>(userId, 'monthlyFixedExpenses', month),
      getMonth<ZSMonthlyVariableExpenses>(userId, 'monthlyVariableExpenses', month),
      getMonth<ZSMonthlyUnexpectedExpenses>(userId, 'monthlyUnexpectedExpenses', month),
      getMonth<ZSSavings>(userId, 'savings', month),
      ])
      return { income, fixed, variable, unexpected, savings }
    } catch (error) {
      console.error('ZS: načtení měsíce selhalo:', error)
      return { income: null, fixed: null, variable: null, unexpected: null, savings: null }
    }
  },

  saveIncome: (userId: string, value: ZSMonthlyIncome) =>
    saveMonth(userId, 'monthlyIncome', value.month, { ...value, userId }),
  saveFixed: (userId: string, value: ZSMonthlyFixedExpenses) =>
    saveMonth(userId, 'monthlyFixedExpenses', value.month, { ...value, userId }),
  saveVariable: (userId: string, value: ZSMonthlyVariableExpenses) =>
    saveMonth(userId, 'monthlyVariableExpenses', value.month, { ...value, userId }),
  saveUnexpected: (userId: string, value: ZSMonthlyUnexpectedExpenses) =>
    saveMonth(userId, 'monthlyUnexpectedExpenses', value.month, { ...value, userId }),
  saveSavings: (userId: string, value: ZSSavings) =>
    saveMonth(userId, 'savings', value.month, { ...value, userId }),

  async getDailyExpenses(userId: string): Promise<ZSDailyExpense[]> {
    try {
      const snapshot = await getDocs(collection(db, USERS, userId, ZS, 'dailyExpenses'))
      return snapshot.docs
      .map((item) => deserializeDates({ id: item.id, ...item.data() }) as ZSDailyExpense)
        .sort((a, b) => b.datum.getTime() - a.datum.getTime())
    } catch (error) {
      console.error('ZS: načtení denních výdajů selhalo:', error)
      return []
    }
  },

  async saveDailyExpense(userId: string, value: ZSDailyExpense): Promise<void> {
    await setDoc(doc(db, USERS, userId, ZS, 'dailyExpenses', value.id), serialize({ ...value, userId }))
  },

  async deleteDailyExpense(userId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, USERS, userId, ZS, 'dailyExpenses', id))
  },

  async getInvestments(userId: string): Promise<ZSInvestment[]> {
    try {
      const snapshot = await getDocs(collection(db, USERS, userId, ZS, 'investments'))
      return snapshot.docs.map((item) => deserializeDates({ id: item.id, ...item.data() }) as ZSInvestment)
    } catch (error) {
      console.error('ZS: načtení investic selhalo:', error)
      return []
    }
  },

  async saveInvestment(userId: string, value: ZSInvestment): Promise<void> {
    await setDoc(doc(db, USERS, userId, ZS, 'investments', value.id), serialize({ ...value, userId }))
  },

  async deleteInvestment(userId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, USERS, userId, ZS, 'investments', id))
  },
}
