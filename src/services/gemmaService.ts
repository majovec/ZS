interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  private pipe: any = null
  private isLoading = false
  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Zatím nespuštěno'

  async initialize(): Promise<void> {
    if (this.pipe) return

    try {
      this.isLoading = true
      this.lastStatus = 'Stahuji AI model z CDN (může to chvíli trvat)...'
      console.log('🤖 ' + this.lastStatus)

      const transformers = await (new Function("url_str", "return import(url_str)"))(
        'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.0'
      )
      const { pipeline, env } = transformers

      env.allowLocalModels = true
      env.allowRemoteModels = true
      env.allowPatterns = ['.*']

      this.lastStatus = 'Inicializuji model v paměti...'
      
      this.pipe = await pipeline(
        'text2text-generation',
        'Xenova/LaMini-Flan-T5-248M'
      )

      this.lastStatus = 'AI je plně připravená!'
      console.log('✅ ' + this.lastStatus)
      this.isLoading = false
    } catch (error: any) {
      this.lastStatus = 'Chyba: ' + (error?.message || error)
      console.error('❌ ' + this.lastStatus, error)
      this.isLoading = false
      throw error
    }
  }

  async chat(userMessage: string): Promise<string> {
    try {
      // Speciální příkaz pro zjištění stavu přímo z chatu
      if (userMessage.trim() === '/status') {
        return `📊 Stav AI: ${this.lastStatus} | Připraveno: ${!!this.pipe}`
      }

      if (!this.pipe) {
        await this.initialize()
      }

      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const prompt = this.buildPrompt(userMessage)

      const result = await this.pipe(prompt, {
        max_length: 150,
        temperature: 0.7,
        top_p: 0.9,
      })

      const response =
        result[0]?.generated_text ||
        'Omlouvám se, na tohle nedokázám odpovědět.'

      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      })

      return response
    } catch (error: any) {
      return `⚠️ Chyba při běhu AI: ${error?.message || error}`
    }
  }

  private buildPrompt(userMessage: string): string {
    const history = this.conversationHistory
      .slice(-4)
      .map((msg) => `${msg.role === 'user' ? 'Uživatel' : 'Asistent'}: ${msg.content}`)
      .join('\n')

    return `Jsi přátelský finanční poradce. Pomáháš lidem dostat se z dluhů. Odpovídej v češtině, stručně a motivující.

${history}

Uživatel: ${userMessage}

Asistent:`
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getHistory(): GemmaMessage[] {
    return [...this.conversationHistory]
  }

  isReady(): boolean {
    return !!this.pipe && !this.isLoading
  }

  getLoadingStatus(): string {
    return this.lastStatus
  }
}

export const gemmaService = new GemmaService()
