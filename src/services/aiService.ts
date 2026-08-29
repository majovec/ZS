import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import { Transaction, Category, Goal } from '@/models/types'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

class AIEngine {
  private conversationHistory: AIMessage[] = []
  private modelLoaded = false

  // Systemová instrukce - jak se má AI chovat
  private SYSTEM_PROMPT = `
    Jsi finanční poradce v české aplikaci pro správu osobních financí.
    Odpovídej stručně, prakticky a v češtině.
    Vycházej pouze z dat, která uživatel poskytl (jeho transakce, rozpočet, cíle).
    Nikdy si nevymýšlej čísla, která uživatel neposkytl.
    Když se uživatel zeptá na něco mimo finance, řekni mu, že se zabýváš jen jeho financemi.
    Slova: Znovu silnější, Držíš to, Máš to pod kontrolou.
  `

  async initialize(): Promise<void> {
    try {
      // Nastavit backend
      await tf.setBackend('webgl')
      await tf.ready()
      this.modelLoaded = true
      console.log('TensorFlow.js loaded')
    } catch (error) {
      console.warn('WebGL not available, falling back to CPU', error)
      await tf.setBackend('cpu')
      this.modelLoaded = true
    }
  }

  async chat(
    userMessage: string,
    userContext: {
      transactions: Transaction[]
      categories: Category[]
      goals: Goal[]
      monthlyIncome: number
      monthlyExpense: number
    }
  ): Promise<string> {
    if (!this.modelLoaded) {
      await this.initialize()
    }

    // Přidat uživatelskou zprávu do historie
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    })

    // Preparace kontextu
    const context = this.prepareContext(userContext)
    const prompt = this.buildPrompt(userMessage, context)

    // Pro MVP - používáme jednoduchou logiku
    // V produkci by zde běžel lokální Gemma model přes TensorFlow Lite Web
    const response = await this.generateResponse(prompt, userMessage)

    // Přidat odpověď do historie
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
    })

    return response
  }

  private buildPrompt(userMessage: string, context: string): string {
    return `
${this.SYSTEM_PROMPT}

=== KONTEXT UŽIVATELE ===
${context}

=== HISTORIE KONVERZACE ===
${this.conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

Nová otázka uživatele: ${userMessage}

Odpověď:
    `
  }

  private prepareContext(userContext: {
    transactions: Transaction[]
    categories: Category[]
    goals: Goal[]
    monthlyIncome: number
    monthlyExpense: number
  }): string {
    const categoryMap = new Map(userContext.categories.map((c) => [c.id, c]))
    const topExpenses = this.getTopExpenses(userContext.transactions, categoryMap)
    const activeGoals = userContext.goals.filter((g) => g.isActive)

    return `
Měsíční příjmy: ${userContext.monthlyIncome} Kč
Měsíční výdaje: ${userContext.monthlyExpense} Kč
Zbývá: ${userContext.monthlyIncome - userContext.monthlyExpense} Kč

Top výdaje:
${topExpenses.map((item) => `- ${item.name}: ${item.amount} Kč`).join('\n')}

Aktivní cíle:
${activeGoals.map((g) => `- ${g.title}: ${g.currentAmount}/${g.targetAmount} Kč (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`).join('\n')}
    `.trim()
  }

  private getTopExpenses(
    transactions: Transaction[],
    categoryMap: Map<string, Category>
  ): Array<{ name: string; amount: number }> {
    const expenses = new Map<string, number>()

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const category = categoryMap.get(tx.categoryId)
        const categoryName = category?.name || 'Ostatní'
        expenses.set(categoryName, (expenses.get(categoryName) || 0) + tx.amount)
      }
    })

    return Array.from(expenses.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  private async generateResponse(prompt: string, userMessage: string): Promise<string> {
    // MVP: Rule-based odpovědi (později se nahradí lokálním Gemma modelem)
    return this.generateRuleBasedResponse(userMessage)
  }

  private generateRuleBasedResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()

    // Úspora
    if (lowerMessage.includes('ušetř') || lowerMessage.includes('spor')) {
      return 'Abys ušetřil, zkus si sepsat všechny měsíční výdaje a vyhledej ty zbytečné. Často se dá ušetřit na jídle - nakupuj v levnějších obchodech nebo si raději vař doma. Znovu silnější! 💪'
    }

    // Dluhy
    if (lowerMessage.includes('dluh') || lowerMessage.includes('splat')) {
      return 'Dluhy se řeší systematicky. Nejdřív nastav pevný plán splácení - kolik měsíčně můžeš věnovat. Pak se snaž minimalizovat ostatní výdaje. Držíš to! 💪'
    }

    // Rozpočet
    if (lowerMessage.includes('rozpočet') || lowerMessage.includes('plán')) {
      return 'Dobrý rozpočet je základem. Nastav si měsíční limit pro každou kategorii a drž se ho. Pravidelně si kontroluj, co jsi utratil. Máš to pod kontrolou!'
    }

    // Investice
    if (lowerMessage.includes('investic') || lowerMessage.includes('vklad')) {
      return 'Investování je dlouhodobá strategie. Nejdřív vytvoř rezervu na neočekávané výdaje (3-6 měsíců příjmů), pak můžeš začít investovat. Začni opatrně!'
    }

    // Obecná finanční motivace
    return 'Díky, že si střeží svými financemi! Každá koruna ušetřená je koruna pro tvou budoucnost. Pokud máš konkrétní otázku na konkrétní kategorii, rád bych ti pomohl! Znovu silnější! 💪'
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getHistory(): AIMessage[] {
    return [...this.conversationHistory]
  }
}

export const aiEngine = new AIEngine()
