import { Category, Goal, Transaction } from '@/models/types'

export interface AIContext {
  transactions: Transaction[]
  categories: Category[]
  goals: Goal[]
  monthlyIncome: number
  monthlyExpense: number
}

const SYSTEM_PROMPT = `Jsi osobní finanční poradce a asistent aplikace "Finance pod kontrolou". 
Tvé odpovědi jsou stručné, věcné, empatické a konstrukcionistické.`

export class AIEngine {
  async initialize(): Promise<void> {
    console.log('AI Engine initialized')
    return Promise.resolve()
  }

  async generateResponse(prompt: string, context?: AIContext | string): Promise<string> {
    const contextString = typeof context === 'string' ? context : JSON.stringify(context || {})
    console.log(`[${SYSTEM_PROMPT.slice(0, 15)}...] Context len: ${contextString.length}`)
    return `AI Asistent: Rozumím vašemu dotazu "${prompt}". Na základě vašich finančních dat doporučuji sledovat vaše rozpočty.`
  }

  async chat(prompt: string, context?: AIContext | string): Promise<string> {
    return this.generateResponse(prompt, context)
  }
}

export const aiEngine = new AIEngine()
