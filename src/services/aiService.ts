import { Transaction, Category } from '@/models/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

class AIEngine {
  private conversationHistory: Message[] = []

  private readonly SYSTEM_PROMPT = `
    Jsi finanční poradce pro aplikaci "Finance pod Kontrolou".
    Pomáháš lidem spravovat jejich osobní finance.
    
    Pravidla:
    - Odpovídej pouze na otázky o financích
    - Bud přátelský a podporující
    - Dávej praktické rady
    - Reaguj na češtinu a vyměňuj se v češtině
    - Používej emojis když to dává smysl
    - Na konci dodej motivační slova: "Znovu silnější! 💪"
  `

  async chat(userMessage: string, context: string = ''): Promise<string> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      const response = await this.generateResponse('', userMessage)

      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      })

      return response
    } catch (error) {
      console.error('AI Chat Error:', error)
      return this.generateRuleBasedResponse(userMessage)
    }
  }

  private async generateResponse(_prompt: string, userMessage: string): Promise<string> {
    // Pro MVP - používáme jednoduchou logiku
    // V produkci by zde běžel lokální Gemma model přes TensorFlow Lite Web
    const response = await this.generateRuleBasedResponse(userMessage)
    return response
  }

  private async generateRuleBasedResponse(userMessage: string): Promise<string> {
    const lowerMsg = userMessage.toLowerCase()

    // Úspory
    if (lowerMsg.includes('ušetř') || lowerMsg.includes('kolik')) {
      return `Aby jsi ušetřil/a, zkus:
1. Sepsat všechny výdaje na měsíc
2. Najít zbytečné výdaje (kdejaké předplatné)
3. Nakupovat levněji nebo v levnějších obchodech
4. Odkládat něco každý měsíc

Znovu silnější! 💪`
    }

    // Dluh
    if (lowerMsg.includes('dluh') || lowerMsg.includes('splát')) {
      return `Strategie na splácení dluhu:
1. Urči si cíl - kolik měsíců ti bude trvat
2. Nastav si si limit - kolik měsíčně přidáš na dluh
3. Sleduj progress - budeš vidět pokrok
4. Buď trpělivý - každý krok se počítá

Znovu silnější! 💪`
    }

    // Rozpočet
    if (lowerMsg.includes('rozpočt') || lowerMsg.includes('kategori')) {
      return `Jak nastavit rozpočet:
1. Fixní výdaje - nájem, energie, pojistka (měl by být ~50% příjmu)
2. Variabilní výdaje - jídlo, dopravu (30% příjmu)
3. Nečekané - opravy, překvapení (10% příjmu)
4. Úspory - co zbyde (10% příjmu)

Znovu silnější! 💪`
    }

    // Investice
    if (lowerMsg.includes('investic') || lowerMsg.includes('spoř')) {
      return `Základy spoření a investování:
1. Nejdřív rozpočet - věď si, kolik máš
2. Pak nouzová rezerva - 3-6 měsíců výdajů
3. Pak můžeš investovat - spořící účet, indexy
4. Dlouhodobě mysli na budoucnost

Znovu silnější! 💪`
    }

    // Default
    return `Jsem tu, abych ti pomohl/a se financemi! 

Můžeš se mě zeptat na:
- Jak ušetřit peníze
- Jak splácet dluh
- Jak nastavit rozpočet
- Jak investovat
- Jakékoliv finanční otázky

Jaká je tvoje otázka?

Znovu silnější! 💪`
  }

  clearHistory(): void {
    this.conversationHistory = []
  }
}

export const aiEngine = new AIEngine()
