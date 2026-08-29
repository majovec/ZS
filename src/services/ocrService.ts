interface OCRResult {
  amount: number | null
  merchant: string
  date: string
  items: string[]
  confidence: number
}

class OCRService {
  async processReceiptImage(file: File): Promise<OCRResult> {
    try {
      // Přečíst soubor jako base64
      const base64Data = await this.fileToBase64(file)
      const text = await this.extractTextFromImage(base64Data)

      const amount = this.extractAmount(text)
      const merchant = this.extractMerchant(text)

      return {
        amount,
        merchant,
        date: new Date().toISOString().split('T')[0],
        items: this.extractItems(text),
        confidence: amount ? 0.8 : 0.5,
      }
    } catch (error) {
      console.error('OCR Error:', error)
      return {
        amount: null,
        merchant: 'Neznámý obchod',
        date: new Date().toISOString().split('T')[0],
        items: [],
        confidence: 0,
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private async extractTextFromImage(base64: string): Promise<string> {
    // MVP - bez Google Vision API
    // Detekovat prostě nejdůležitější věci z textu v obrázku
    // V produkci by zde bylo Google Vision API

    // Simulace - return dummy text
    return 'Součet: 500 CZK Albert Hypermarket'
  }

  private extractAmount(text: string): number | null {
    // Hledej čísla s částkou
    const patterns = [
      /(\d+)\s*(?:kč|czk|zl|pln)/gi,
      /(?:cena|cena celkem|celkem|suma|součet).*?(\d+)/gi,
      /(\d+)\s*(?:zl|pln)/gi,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const numberMatch = match[0].match(/\d+/)
        if (numberMatch) {
          return parseInt(numberMatch[0], 10)
        }
      }
    }

    return null
  }

  private extractMerchant(text: string): string {
    // Detekuj obchody
    const merchants = [
      'Albert',
      'Tesco',
      'Lidl',
      'Kaufland',
      'Penny',
      'DM',
      'Billa',
      'CBA',
      'COOP',
      'Globus',
      'Carrefour',
      'Aldi',
    ]

    for (const merchant of merchants) {
      if (text.toUpperCase().includes(merchant.toUpperCase())) {
        return merchant
      }
    }

    // Detekuj dopravce
    if (text.match(/benzina|shell|omv|čerpací stanice/gi)) {
      return 'Čerpací stanice'
    }

    // Detekuj restaurace
    if (text.match(/restaurace|kavárna|kafe|bar|hotel/gi)) {
      return 'Restaurace'
    }

    return 'Nákup'
  }

  private extractItems(text: string): string[] {
    // Pokud je v textu seznam položek
    const lines = text.split('\n')
    const items = lines.filter(
      (line) =>
        line.length > 3 &&
        !line.match(/\d{2}:\d{2}/) &&
        !line.match(/suma|celkem|cena/gi)
    )
    return items.slice(0, 5)
  }

  suggestCategory(merchant: string, _text: string): string {
    const merchantLower = merchant.toLowerCase()

    // Jídlo a supermakety
    if (merchantLower.match(/albert|tesco|lidl|kaufland|penny|coop|globus|billa/)) {
      return 'jídlo'
    }

    // Zdraví a péče
    if (merchantLower.match(/dm|lekárna|apotéka|zdraví|wellness/)) {
      return 'péče'
    }

    // Doprava
    if (merchantLower.match(/benzina|shell|omv|čerpací|taxi/)) {
      return 'doprava'
    }

    // Rekreace
    if (merchantLower.match(/restaurace|bar|kino|kavárna|joga/)) {
      return 'rekreace'
    }

    return 'ostatní'
  }
}

export const ocrService = new OCRService()
