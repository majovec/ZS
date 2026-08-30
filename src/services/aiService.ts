import { Transaction, Category, Goal } from '@/models/types'
import { gemmaService } from './gemmaService'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

class AIEngine {
  private conversationHistory: AIMessage[] = []
  private gemmaReady = false
  private gemmaInitialized = false

  
  async initialize(): Promise<void> {
    if (this.gemmaInitialized) return

    try {
      console.log('🤖 Inicializuji AI...')
      await gemmaService.initialize()
      this.gemmaReady = gemmaService.isReady()
      this.gemmaInitialized = true
      console.log(this.gemmaReady ? '✅ AI server je připravený!' : 'ℹ️ AI server není nastaven, používám základní režim.')
    } catch (error) {
      console.warn('⚠️ Gemma se nepodařila, používám fallback', error)
      this.gemmaReady = false
      this.gemmaInitialized = true
    }
  }

  async chat(
    userMessage: string,
    _userContext?: {
      transactions: Transaction[]
      categories: Category[]
      goals: Goal[]
      monthlyIncome: number
      monthlyExpense: number
    }
  ): Promise<string> {
    if (!this.gemmaInitialized) {
      await this.initialize()
    }

    try {
      // Pokud je Gemma připravená, použij ji
      if (this.gemmaReady) {
        console.log('🤖 Používám Gemmu...')
        const response = await gemmaService.chat(userMessage)

        this.conversationHistory.push({
          role: 'user',
          content: userMessage,
        })
        this.conversationHistory.push({
          role: 'assistant',
          content: response,
        })

        return response
      }
    } catch (error) {
      console.warn('Gemma error, používám fallback:', error)
    }

    // Fallback - pokud Gemma selhá
    return this.generateRuleBasedResponse(userMessage)
  }

  private generateRuleBasedResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()

    // POZDRAVY
    if (lowerMessage.match(/ahoj|hello|hi|zdravím|dobr|čau|hey/i)) {
      const responses = [
        'Ahoj! 👋 Jsem tvůj finanční asistent. Jak se máš? Co tě zajímá?',
        'Zdravím! Glad, že jsi tu. Co by tě dneska zajímalo?',
        'Čau! Tady jsem pro tebe. Máš nějakou otázku? 💚',
        'Hej! Jak se ti vede? Chceš si pohrát se svými financemi? 😊',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // ÚSPORY
    if (lowerMessage.match(/ušetř|spor|jak ušetř|peníze|jak naspo/i)) {
      const responses = [
        'Úspory jsou super! 💪 Začni tím, že si sepíšeš všechny výdaje a vyhledáš zbytečné. Často se dá ušetřit na jídle - nakupuj levněji nebo vař doma. Znovu silnější!',
        'Chceš ušetřit? Skvělá myšlenka! Tip: vypni zbytečná předplatná, nakupuj v levnějších obchodech a vař si jídlo doma. Tři věci = obrovské úspory! 💰',
        'Úspory nejsou těžké! Nastav si měsíční limit na každou kategorii a drž se ho. Měsíc za měsícem vidíš jak roste tvá rezerva. Máš to pod kontrolou! 💪',
        'Nejjednoduší tip: každý měsíc ulož něco - i když je to jen 100 Kč. Rok = 1200 Kč! Malé krůčky = velké výsledky! 🚀',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // DLUH
    if (lowerMessage.match(/dluh|splátk|půjčk|kreditn|úvěr|dluž/i)) {
      const responses = [
        'Dluhy se řeší systematicky. 💪 Nejdřív nastav pevný plán - kolik měsíčně můžeš věnovat na splácení. Pak minimalizuj ostatní výdaje. Držíš to, bude to!',
        'Splácení dluhu je maraton, ne sprint! Klíč je konzistence. Měsíc co měsíc stejná částka = brzy budeš bez dluhu! Věř si! 💪',
        'Máš dluh? Vytvoř si seznam všech dluhů a prioritizuj! Nejdřív splať ty s nejvyšší úrokem. Pak se ti bude lépe dýchat! 😌',
        'Každá splátka tě blíž k svobodě! Může to být těžké, ale pokrok je vidět. Budeš bez dluhu, věř si! Znovu silnější! 💪',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // ROZPOČET
    if (lowerMessage.match(/rozpočt|plán|jak si vést|kategori|limit/i)) {
      const responses = [
        'Rozpočet je základ! 📊 Zkus pravidlo 50/30/20: 50% fixní výdaje, 30% variabilní, 20% úspory. Jednoduchý ale efektivní!',
        'Rozpočetovat není těžké! Prostě si sepíšeš co utratíš a porovnáš s limitem. Měsíc za měsícem vidíš pokrok. Máš to! 💪',
        'Dobrý rozpočet = dobrý spánek! 😴 Nastav si měsíční limit pro každou kategorii a pravidelně si kontroluj pokrok. Občas si sáhni na aplikaci!',
        'Chceš rozpočet? Najdi si jednu kategorii kterou chceš lépe ovládat. Začni tam. Pak postupně přidej další. Jednoduchost vítězí! 🎯',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // INVESTICE
    if (lowerMessage.match(/investic|vklad|fond|akci|jak investov|kde vložit/i)) {
      const responses = [
        'Investování je dlouhodobá hra! 🚀 Nejdřív si vytvoř rezervu (3-6 měsíců příjmů), pak můžeš začít investovat. Začni opatrně!',
        'Chceš investovat? Skvělě! Ale bez rezervy ne. Vytvoř si podušku na neočekávané věci. Pak můžeš koupit akcie, fondy nebo ETF! 💰',
        'Tajemství investování: koupit levně, držet dlouho, prodát draho! Nebo koupit fond a zapomenout. Dlouhodobě se to vyplácí! 📈',
        'Investice nejsou jen pro bohaté! I s malými částkami můžeš začít. Důležité je ZAČÍT. Čím dřív, tím lépe vyrůstají tvoje peníze! 🌱',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // CÍLE
    if (lowerMessage.match(/cíl|cíle|chci si|chceš|budoucnost|plán na/i)) {
      const responses = [
        'Cíle jsou super! 🎯 Malá tajemství: dělej je konkrétní (ne "ušetřit peníze", ale "ušetřit 50k do roku"). Pak je sleduj v aplikaci!',
        'Máš nějaký cíl? Skvělé! Teď si ho nastav tady v aplikaci a sleduj pokrok. Měsíc za měsícem vidíš jak se blížíš! 💪',
        'Finanční cíle mění životy! 💚 Když víš kam jdeš, všechno je jednodušší. Jaký je tvůj cíl? Splácení dluhu? Dovolená? Byt?',
        'Bez cíle se peníze ztrácejí. S cílem rostou! 📈 Nastav si cíl v aplikaci a věnuj se mu každý měsíc. Brzy to bude realita!',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // MOTIVACE
    if (lowerMessage.match(/nemám síl|je to těžké|nezvládam|nemůž|jak to vydrž|musím|motivace/i)) {
      const responses = [
        'Ouha! Cítím, že je to těžké. 💔 Ale poslouchej - každý forint co ušetříš tě blíž k cíli. Stačí malý krok! Znovu silnější! 💪',
        'Je to normální cítit se skrušeně. Ale pamatuj: všichni se cítili stejně. Všichni to překonali. TY TAKY MŮŽEŠ! 💪',
        'Nejsilnější motiv: představ si jak budeš bez dluhu, bez stresu, se svými cíli. Všichni to zvládli. Zvládneš i ty! 🚀',
        'Finance nejsou zábava, ale STOJÍ ZA TO! Každý měsíc když se podíváš na aplikaci a vidíš pokrok... to je úžasné! Drž to! 💪',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // JAK POUŽÍVAT APLIKACI
    if (lowerMessage.match(/jak to funguje|jak se používá|jak tady|kde je|jak přidat|jak skenovat/i)) {
      const responses = [
        '📱 Aplikace je super jednoduchá! Dashboard ti ukazuje přehled, Nový zápis přidáš transakci, OCR skenuje účtenky, Grafy ti ukazují analýzu. Zkus to!',
        'Kam máš první kroky? 1️⃣ Přidej si prvních pár transakcí 2️⃣ Podívej se na grafy 3️⃣ Nastav si cíl 4️⃣ Sleduj pokrok! Jednoduché! 🎯',
        'Nejrychlejší tip: přidávej všechny výdaje co udělíš. I ty malé! Pak až se podíváš na grafy, zjistíš kde se peníze ztrácejí. Probuď se! 💡',
        'Skenování účtenek? Klikni na fotoaparát ikonu a skenuj! Aplikace ti sama detekuje částku. Nemusíš psát nic! Geniální, ne? 📷',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // POČASÍ, VTIPY, RANDOM OTÁZKY
    if (lowerMessage.match(/počasí|jak se máš|co děláš|vtipm|smích|baví/i)) {
      const responses = [
        'Počasí? 🌤️ To nevím, ale vím že dobré počasí = méně peněz v obchodech! Zůstaň doma a ušetři! 😄',
        'Jak se mám? Skvělě! A ty? Hlavně že si hlídáš svoje finance! To je nejlepší pocit! 💚',
        'Vtipy nejsou můj styl, ale vím jeden: Kolik stojí bankéř? Všechno co má! 😄 Ty si chraň svoje peníze líp!',
        'Baví tě to? Mě taky! Nic není lepší než vidět jak se člověk zvedá finančně. Pokračuj! 🚀',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // VZDĚLÁNÍ, PRÁCE, KARIÉRA
    if (lowerMessage.match(/vzdělání|práce|kariér|职業|zaměstnání|plat|výplata|mzda/i)) {
      const responses = [
        'Práce je základ! 💼 Ale pamatuj - nejdůležitější je kolik z toho ulož, ne kolik vydělaj. Malý plat + dobrý rozpočet = bohatství! 📊',
        'Kariéra se zdá důležitá (je!), ale peníze jsou o disciplíně. Zvyšuješ si plat? Skvělé! Teď ještě lépe hlídej svoje výdaje! 💪',
        'Vzdělání se vyplací! Ale víš co se vyplácí víc? Rozumné hospodaření s penízi! Teď máš obojí - vzdělání + aplikaci! 🎓💰',
        'Zaměstnání by mělo být nástrojem k dosažení tvých cílů, ne pánem. Zafixuj si kolik můžeš utratit, zbytek ulož. Frajer! 😎',
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // DEFAULT - KDYŽ NEUMÍ KATEGORIZOVAT
    const defaultResponses = [
      'Zajímavá otázka! 🤔 Co má společného s tvými financemi? Nebo jen tak chatujeme? Obojí je OK! 😊',
      'Zajímavé! Ale víš co by tě mělo zajímat víc? Tvoje finance! 💰 Jak jsi na tom?',
      'Haha, zajímavé! Ale pojďme se vrátit k tvým penězům - jak se máš finančně? Něco se zlepšilo? 📊',
      'Jsou to zajímavé věci, ale nejdůležitější je TVOJE budoucnost! Jak probíhají tvoje finanční cíle? 🚀',
      'Slyšel/a jsem tě! Teď si ale povíme - máš pocit, že máš peníze pod kontrolou? Pokud ne, já jsem tu! 💪',
    ]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  isCloudAvailable(): boolean {
    return this.gemmaReady
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getHistory(): AIMessage[] {
    return [...this.conversationHistory]
  }
}

export const aiEngine = new AIEngine()
