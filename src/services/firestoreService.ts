import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  Category,
  Transaction,
  Goal,
  Investment,
  MonthlyBudget,
  DEFAULT_CATEGORIES,
} from '@/models/types'

const USERS_COLLECTION = 'users'

// ===== KATEGORIE =====
export const categoriesService = {
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, USERS_COLLECTION, userId, 'categories')
      )
      if (querySnapshot.empty) {
        await categoriesService.initializeCategories(userId)
        return DEFAULT_CATEGORIES
      }
      return querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Category[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      return DEFAULT_CATEGORIES
    }
  },

  async initializeCategories(userId: string): Promise<void> {
    const batch: WriteBatch = writeBatch(db)
    DEFAULT_CATEGORIES.forEach((category) => {
      const docRef = doc(
        db,
        USERS_COLLECTION,
        userId,
        'categories',
        category.id
      )
      batch.set(docRef, category)
    })
    await batch.commit()
  },

  async addCategory(userId: string, category: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, USERS_COLLECTION, userId, 'categories'),
      category
    )
    return docRef.id
  },
}

// ===== TRANSAKCE =====
export const transactionsService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, USERS_COLLECTION, userId, 'transactions'),
          orderBy('date', 'desc')
        )
      )
      return querySnapshot.docs.map((document) => {
        const data = document.data()
        return {
          id: document.id,
          ...data,
          date: typeof data.date?.toDate === 'function' ? data.date.toDate() : new Date(data.date),
          createdAt: typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Transaction
      })
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  },

  async getTransactionsByMonth(userId: string, yearMonth: string): Promise<Transaction[]> {
    try {
      const [year, month] = yearMonth.split('-').map(Number)
      const start = new Date(year, month - 1, 1)
      const end = new Date(year, month, 1)
      const querySnapshot = await getDocs(
        query(
          collection(db, USERS_COLLECTION, userId, 'transactions'),
          where('date', '>=', Timestamp.fromDate(start)),
          where('date', '<', Timestamp.fromDate(end)),
          orderBy('date', 'desc')
        )
      )
      return querySnapshot.docs.map((document) => {
        const data = document.data()
        return {
          id: document.id,
          ...data,
          date: typeof data.date?.toDate === 'function' ? data.date.toDate() : new Date(data.date),
          createdAt: typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Transaction
      })
    } catch (error) {
      console.error('Error fetching transactions by month:', error)
      return []
    }
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, USERS_COLLECTION, userId, 'transactions'),
      {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)),
        createdAt: Timestamp.fromDate(new Date(transaction.createdAt)),
      }
    )
    return docRef.id
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    await deleteDoc(
      doc(db, USERS_COLLECTION, userId, 'transactions', transactionId)
    )
  },

  async updateTransaction(userId: string, transactionId: string, updates: Partial<Transaction>): Promise<void> {
    const firestoreUpdates: Record<string, unknown> = { ...updates }
    if (updates.date) firestoreUpdates.date = Timestamp.fromDate(new Date(updates.date))
    delete firestoreUpdates.id
    await updateDoc(
      doc(db, USERS_COLLECTION, userId, 'transactions', transactionId),
      firestoreUpdates
    )
  },
}

// ===== CÍLE =====
export const goalsService = {
  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, USERS_COLLECTION, userId, 'goals')
      )
      return querySnapshot.docs.map((document) => {
        const data = document.data()
        return {
          id: document.id,
          ...data,
          deadline: typeof data.deadline?.toDate === 'function' ? data.deadline.toDate() : data.deadline,
        } as Goal
      })
    } catch (error) {
      console.error('Error fetching goals:', error)
      return []
    }
  },

  async addGoal(userId: string, goal: Omit<Goal, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, USERS_COLLECTION, userId, 'goals'),
      {
        ...goal,
        deadline: goal.deadline ? Timestamp.fromDate(new Date(goal.deadline)) : null,
      }
    )
    return docRef.id
  },

  async updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Promise<void> {
    await updateDoc(
      doc(db, USERS_COLLECTION, userId, 'goals', goalId),
      {
        ...updates,
        deadline: updates.deadline ? Timestamp.fromDate(new Date(updates.deadline)) : undefined,
      }
    )
  },

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    await deleteDoc(doc(db, USERS_COLLECTION, userId, 'goals', goalId))
  },
}

// ===== INVESTICE =====
export const investmentsService = {
  async getInvestments(userId: string): Promise<Investment[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, USERS_COLLECTION, userId, 'investments')
      )
      return querySnapshot.docs.map((document) => {
        const data = document.data()
        return {
          id: document.id,
          ...data,
          date: typeof data.date?.toDate === 'function' ? data.date.toDate() : new Date(data.date),
        } as Investment
      })
    } catch (error) {
      console.error('Error fetching investments:', error)
      return []
    }
  },

  async addInvestment(userId: string, investment: Omit<Investment, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, USERS_COLLECTION, userId, 'investments'),
      {
        ...investment,
        date: Timestamp.fromDate(new Date(investment.date)),
      }
    )
    return docRef.id
  },

  async deleteInvestment(userId: string, investmentId: string): Promise<void> {
    await deleteDoc(
      doc(db, USERS_COLLECTION, userId, 'investments', investmentId)
    )
  },
}

// ===== MĚSÍČNÍ ROZPOČET =====
export const budgetService = {
  async getBudget(userId: string, yearMonth: string): Promise<MonthlyBudget[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, USERS_COLLECTION, userId, 'monthlyBudgets'),
          where('yearMonth', '==', yearMonth)
        )
      )
      return querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as MonthlyBudget[]
    } catch (error) {
      console.error('Error fetching budget:', error)
      return []
    }
  },

  async updateBudget(userId: string, budgetId: string, plannedAmount: number): Promise<void> {
    await updateDoc(
      doc(db, USERS_COLLECTION, userId, 'monthlyBudgets', budgetId),
      { plannedAmount }
    )
  },

  async addBudget(userId: string, budget: Omit<MonthlyBudget, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, USERS_COLLECTION, userId, 'monthlyBudgets'),
      budget
    )
    return docRef.id
  },
}
