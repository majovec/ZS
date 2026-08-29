interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  private pipe: any = null
  private isLoading = false
  private conversationHistory: GemmaMessage[] = []

  async initialize(): Promise<void> {
    if (this.pipe) return

    try {
      this.isLoading = true
      console.log('🤖 Inicializuji Gemmu přes CDN...')

      // @ts-ignore
      const { pipeline, env } = await import(
        'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.0'
      )

      env.allowLocalModels = true
      env.allowRemoteModels = true
      env.allowPatterns = ['.*']

      // Stáhni malý model - FLAN-T5-Small (~230MB)
      this.pipe = await pipeline(
        'text2text-generation',
        'google/flan-t5-small'
      )

      console.log('✅ Gemma je připravená!')
      this.isLoading = false
    } catch (error) {
      console.error('❌ Chyba při načítání Gemmy:', error)
      this.isLoading = false
      throw error
    }
  }

  async chat(userMessage: string): Promise<string> {
    try {
      if (!this.pipe) {
        await this.initialize()
      }

      // Přidej do history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      // Vytvoř prompt
      const prompt = this.buildPrompt(userMessage)

      console.log('🤔 Gemma přemýšlí...')

      // Vygeneruj odpověď
      const result = await this.pipe(prompt, {
        max_length: 200,
        temperature: 0.7,
        top_p: 0.9,
      })

      const response =
        result[0]?.generated_text ||
        'Omlouvám se, nemohl jsem generovat odpověď.'

      // Ulož do history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      })

      return response
    } catch (error) {
      console.error('Gemma Error:', error)
      throw error
    }
  }

  private buildPrompt(userMessage: string): string {
    const history = this.conversationHistory
      .slice(-4) // Poslední 4 zprávy
      .map((msg) => `${msg.role === 'user' ? 'Uživatel' : 'Asistent'}: ${msg.content}`)
      .join('\n')

    return `Jsi finanční poradce v české aplikaci pro správu osobních financí. Odpovídej v češtině, bud přátelský a motivující. Na konci vždy dodej: "Znovu silnější! 💪"

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
    if (this.isLoading) return 'Loading...'
    if (!this.pipe) return 'Not initialized'
    return 'Ready'
  }
}

export const gemmaService = new GemmaService()
