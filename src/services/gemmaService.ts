interface GemmaMessage {
  role: 'user' | 'assistant'
  content: string
}

class GemmaService {
  private conversationHistory: GemmaMessage[] = []
  private lastStatus = 'Aktivní a připravena'

  async initialize(): Promise<void> {
    this.lastStatus = 'Připraveno'
    console.log('✅ AI Service připravena')
  }

  async chat(userMessage: string): Promise<string> {
    try {
      if (userMessage.trim() === '/status') {
        return `📊 Stav AI: ${this.lastStatus}`
      }

      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const response = await fetch(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `[INST] Jsi český finanční poradce specializující se na pomoc lidem v dluzích. Odpověz na otázku uživatele věcně, užitečně a v češtině. Žádné vyhýbavé fráze.\n\nUživatel: ${userMessage} [/INST]`,
            parameters: {
              max_new_length: 250,
              temperature: 0.5,
              return_full_text: false,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Chyba komunikace se serverem.')
      }

      const data = await response.json()
      
      let aiResponse = ''
      if (Array.isArray(data) && data[0]?.generated_text) {
        aiResponse = data[0].generated_text
      } else if (data?.generated_text) {
        aiResponse = data.generated_text
      }

      aiResponse = aiResponse.replace(/\[\/INST\]/g, '').trim()

      if (!aiResponse) {
        aiResponse = 'Zkus mi položit konkrétnější otázku ohledně tvých výdajů nebo dluhů, abych ti mohl spočítat plán.'
      }

      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse,
      })

      return aiResponse
    } catch (error: any) {
      return 'Omlouvám se, spojení s AI se na chvíli přerušilo. Zkus to za chvíli zopakovat.'
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
