interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Připraveno (Limit: 15 zpráv/den)'
  private readonly MAX_DAILY_MESSAGES = 15

  private get apiKey(): string {
    return import.meta.env.VITE_GEMINI_API_KEY || ''
  }

  async initialize(): Promise<void> {
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY není nastaven!')
      this.lastStatus = 'API klíč chybí'
    } else {
      this.lastStatus = 'Připraveno'
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

  async chat(userMessage: string): Promise<string> {
    try {
      if (!this.apiKey) {
        return '❌ API klíč není nastaven. Kontaktuj administrátora.'
      }

      if (userMessage.trim() === '/status') {
        const zbbyva = this.getRemainingMessages()
        return `📊 Stav AI: ${this.lastStatus} | Zbývá ti dnes zpráv: ${zbbyva}/${this.MAX_DAILY_MESSAGES}`
      }

      const limitCheck = this.checkAndIncrementLimit()
      if (!limitCheck.allowed) {
        return `🛑 Vyčerpal/a jsi svůj dnešní bezplatný limit ${this.MAX_DAILY_MESSAGES} zpráv. Pokračovat můžeš zase zítra! 💪`
      }

      const contents = this.conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      const promptWithPersona = `Jsi přátelský český finanční poradce pomáhající lidem s dluhy. Odpovídej věcně, stručně a lidsky. Uživatel píše: ${userMessage}`

      contents.push({
        role: 'user',
        parts: [{ text: promptWithPersona }],
      })

      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gemini API Error:', errorData)

        if (response.status === 429) {
          return '⏸️ Příliš mnoho požadavků. Počkej chvíli a zkus znovu.'
        }
        if (response.status === 401) {
          return '🔑 Chyba autentizace. API klíč je neplatný.'
        }

        throw new Error(`API Error (${response.status}): ${errorData?.error?.message || 'Neznámá chyba'}`)
      }

      const data = await response.json()
      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Omlouvám se, na tohle nedokážu odpovědět.'

      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const finalResponse = `${responseText}\n\n_(Zbývajících zpráv dnes: ${limitCheck.remaining})_`

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
    return !!this.apiKey
  }

  getLoadingStatus(): string {
    return this.lastStatus
  }
}

export const gemmaService = new GemmaService()
