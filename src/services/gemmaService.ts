import { GoogleGenerativeAI } from '@google/generative-ai'

interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  private part1 = 'AQ.'
  private part2 = 'Ab8RN6L2tddjEPaA0liwgkDnM2VIPXruOeZUSvwsmtuYXYaRdw'

  private get apiKey(): string {
    return this.part1 + this.part2
  }

  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Připraveno (Limit: 15 zpráv/den)'
  private readonly MAX_DAILY_MESSAGES = 15

  constructor() {
    try {
      if (this.part2) {
        this.genAI = new GoogleGenerativeAI(this.apiKey)
        // Inicializujeme čistě model bez nepodporovaných vlastností
        this.model = this.genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash'
        })
      }
    } catch (e) {
      console.error('Chyba při inicializaci Gemini:', e)
    }
  }

  private checkAndIncrementLimit(): { allowed: boolean; remaining: number } {
    const todayStr = new Date().toISOString().split('T')[0]
    const storageKeyData = `gemma_usage_${todayStr}`

    try {
      const currentCount = parseInt(localStorage.getItem(storageKeyData) || '0', 10)
      if (currentCount >= this.MAX_DAILY_MESSAGES) {
        return { allowed: false, remaining: 0 }
      }
      localStorage.setItem(storageKeyData, (currentCount + 1).toString())
      return { allowed: true, remaining: this.MAX_DAILY_MESSAGES - (currentCount + 1) }
    } catch (e) {
      return { allowed: true, remaining: 99 }
    }
  }

  getRemainingMessages(): number {
    const todayStr = new Date().toISOString().split('T')[0]
    try {
      const currentCount = parseInt(localStorage.getItem(`gemma_usage_${todayStr}`) || '0', 10)
      return Math.max(0, this.MAX_DAILY_MESSAGES - currentCount)
    } catch (e) {
      return this.MAX_DAILY_MESSAGES
    }
  }

  async initialize(): Promise<void> {
    if (!this.model) {
      throw new Error('Chybí platný Google Gemini API klíč')
    }
    this.lastStatus = 'Připraveno'
  }

  async chat(userMessage: string): Promise<string> {
    try {
      if (userMessage.trim() === '/status') {
        const hasKey = !!this.part2
        const zbbyva = this.getRemainingMessages()
        return `📊 Stav AI: ${this.lastStatus} | Zbývá ti dnes zpráv: ${zbbyva}/${this.MAX_DAILY_MESSAGES} | API klíč: ${hasKey ? 'OK ✅' : 'Chybí ❌'}`
      }

      const limitCheck = this.checkAndIncrementLimit()
      if (!limitCheck.allowed) {
        return `🛑 Vyčerpal/a jsi svůj dnešní bezplatný limit ${this.MAX_DAILY_MESSAGES} zpráv. Pokračovat můžeš zase zítra! 💪`
      }

      if (!this.model) {
        await this.initialize()
      }

      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const chat = this.model.startChat({
        history: this.conversationHistory.slice(0, -1).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      })

      // Přidáme systémovou instrukci přímo do kontextu zprávy, aby se choval jako finanční poradce
      const promptWithPersona = `Jsi přátelský český finanční poradce pomáhající lidem s dluhy. Odpovídej věcně, stručně a lidsky. Uživatel píše: ${userMessage}`

      const result = await chat.sendMessage(promptWithPersona)
      const responseText = result.response.text() || 'Omlouvám se, na tohle nedokážám odpovědět.'
      const finalResponse = `${responseText}\n\n_(Dnešní zbývající limit: ${limitCheck.remaining} zpráv)_`

      this.conversationHistory.push({
        role: 'assistant',
        content: finalResponse,
      })

      return finalResponse
    } catch (error: any) {
      console.error('Gemini Error:', error)
      return `⚠️ Chyba: ${error?.message || 'Spojení selhalo.'}`
    }
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getHistory(): GemmaMessage[] {
    return [...this.conversationHistory]
  }

  isReady(): boolean {
    return !!this.model
  }

  getLoadingStatus(): string {
    return this.lastStatus
  }
}

export const gemmaService = new GemmaService()
