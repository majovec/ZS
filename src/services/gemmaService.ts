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

  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Připraveno (Limit: 15 zpráv/den)'
  private readonly MAX_DAILY_MESSAGES = 15

  async initialize(): Promise<void> {
    this.lastStatus = 'Připraveno'
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
      if (userMessage.trim() === '/status') {
        const hasKey = !!this.part2
        const zbbyva = this.getRemainingMessages()
        return `📊 Stav AI: ${this.lastStatus} | Zbývá ti dnes zpráv: ${zbbyva}/${this.MAX_DAILY_MESSAGES} | API klíč: ${hasKey ? 'OK ✅' : 'Chybí ❌'}`
      }

      const limitCheck = this.checkAndIncrementLimit()
      if (!limitCheck.allowed) {
        return `🛑 Vyčerpal/a jsi svůj dnešní bezplatný limit ${this.MAX_DAILY_MESSAGES} zpráv. Pokračovat můžeš zase zítra! 💪`
      }

      // Sestavíme historii zpráv pro REST API
      const contents = this.conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))

      // Přidáme aktuální zprávu s personou finančního poradce
      const promptWithPersona = `Jsi přátelský český finanční poradce pomáhající lidem s dluhy. Odpovídej věcně, stručně a lidsky. Uživatel píše: ${userMessage}`
      
      contents.push({
        role: 'user',
        parts: [{ text: promptWithPersona }]
      })

      // Přímý endpoint pro Gemini 1.5 Flash na v1beta
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Chyba serveru (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Omlouvám se, na tohle nedokázám odpovědět.'

      // Uložíme do historie
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const finalResponse = `${responseText}\n\n_(Dnešní zbývající limit: ${limitCheck.remaining} zpráv)_`

      this.conversationHistory.push({
        role: 'assistant',
        content: finalResponse,
      })

      return finalResponse
    } catch (error: any) {
      console.error('Gemini REST Error:', error)
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
    return true
  }

  getLoadingStatus(): string {
    return this.lastStatus
  }
}

export const gemmaService = new GemmaService()
