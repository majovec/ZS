interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  // Never ship provider secrets in the browser bundle. Configure an authenticated
  // backend proxy through VITE_AI_ENDPOINT instead.
  private get endpoint(): string {
    return (import.meta.env.VITE_AI_ENDPOINT || '').replace(/\/$/, '')
  }

  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Připraveno (Limit: 15 zpráv/den)'
  private readonly MAX_DAILY_MESSAGES = 15

  async initialize(): Promise<void> {
    if (!this.endpoint) {
      this.lastStatus = 'Základní režim (AI server není nastaven)'
      return
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

  async chat(userMessage: string, appData?: any): Promise<string> {
    try {
      if (!this.endpoint) {
        throw new Error('AI server není nakonfigurován')
      }

      if (userMessage.trim() === '/status') {
        const zbbyva = this.getRemainingMessages()
        return `📊 Stav AI: ${this.lastStatus} | Zbývá ti dnes zpráv: ${zbbyva}/${this.MAX_DAILY_MESSAGES}`
      }

      const limitCheck = this.checkAndIncrementLimit()
      if (!limitCheck.allowed) {
        return `🛑 Vyčerpal/a jsi svůj dnešní bezplatný limit ${this.MAX_DAILY_MESSAGES} zpráv. Pokračovat můžeš zase zítra! 💪`
      }

      // Do historie ukládáme čistou zprávu uživatele
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const contents = this.conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      let contextString = ''
      if (appData) {
        contextString = `\n\nAktuální data uživatele z aplikace:\n${JSON.stringify(appData, null, 2)}`
      }

      // Přidáme systémový kontext jako poslední instrukci, aniž bychom tím špinili trvalou historii
      const fullContents = [
        ...contents.slice(0, -1),
        {
          role: 'user',
          parts: [{ text: `Jsi přátelský český finanční poradce pomáhající lidem s dluhy a financemi. Odpovídej věcně, stručně a lidsky. Máш k dispozici data uživatele z aplikace.${contextString}\n\nUživatel píše: ${userMessage}` }]
        }
      ]

      // Použijeme lehčí, rychlý a stabilní lite model
      const url = this.endpoint

      let response: Response | null = null
      let attempts = 0
      const maxAttempts = 3

      while (attempts < maxAttempts) {
        attempts++
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contents: fullContents }),
        })

        if (response.status === 503 && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          continue
        }
        break
      }

      if (!response || !response.ok) {
        const errorData = response ? await response.json().catch(() => ({})) : {}
        console.error('Gemini API Error:', errorData)

        if (response?.status === 429) {
          return '⏸️ Příliš mnoho požadavků. Počkej chvíli a zkus znovu.'
        }
        if (response?.status === 503) {
          return '🔄 Server je momentálně vytížený. Zkus prosím odeslat zprávu za chvíli znovu.'
        }
        if (response?.status === 401) {
          return '🔑 Chyba autentizace. API klíč je neplatný.'
        }

        throw new Error(`API Error (${response?.status || 'Neznámá'}): ${errorData?.error?.message || 'Neznámá chyba'}`)
      }

      const data = await response.json()
      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Omlouvám se, na tohle nedokážu odpovědět.'

      // Do historie asistenta uložíme čistou odpověď AI (bez počitadla, aby se to řetězením nekazilo)
      this.conversationHistory.push({
        role: 'assistant',
        content: responseText,
      })

      const finalResponse = `${responseText}\n\n_(Zbývajících zpráv dnes: ${limitCheck.remaining})_`

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
    return !!this.endpoint
  }

  getLoadingStatus(): string {
    return this.lastStatus
  }
}

export const gemmaService = new GemmaService()
