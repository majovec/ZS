export interface AIContext {
  transactions: any[]
  categories: any[]
  goals: any[]
  monthlyIncome: number
  monthlyExpense: number
}

const SYSTEM_PROMPT = `Jsi osobní finanční poradce a asistent aplikace "Finance pod kontrolou". 
Tvé odpovědi jsou stručné, věcné, empatické a konstrukcionistické. 
Vždy se snažíš pomoci uživateli ušetřit nebo dodržet rozpočet.`

export class AIEngine {
  async initialize(): Promise<void> {
    console.log('AI Engine initialized with prompt template')
    return Promise.resolve()
  }

  async generateResponse(prompt: string, context?: AIContext | string): Promise<string> {
    const contextString = typeof context === 'string' ? context : JSON.stringify(context || {})
    console.log(`[${SYSTEM_PROMPT.slice(0, 20)}...] Context length: ${contextString.length}`)
    return `AI Asistent: Rozumím vašemu dotazu "${prompt}". Na základě vašich finančních dat doporučuji sledovat vaše pravidelné výdaje.`
  }
}

export const aiEngine = new AIEngine()
