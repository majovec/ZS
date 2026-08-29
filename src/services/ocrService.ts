interface OCRResult {
  amount: number | null
  merchant: string
  date: string
  items: string[]
  confidence: number
}

class OCRService {
  extractAmount(text: string): number | null {
    const patterns = [
      /(\d+[.,]\d{2})\s*Kč/,
      /(\d+)\s*Kč/,
      /\b(\d+[.,]\d{2})\b/,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)

      if (match) {
        const amountStr = match[1].replace(',', '.')
        return parseFloat(amountStr)
      }
    }

    return null
  }

  extractMerchant(text: string): string {
    const merchants = [
      'Albert',
      'Tesco',
      'Lidl',
      'Kaufland',
      'AEON',
      'Billa',
      'Penny',
      'Coop',
      'DM',
      'Notino',
      'Alza',
      'CZC',
      'eMag',
      'IKEA',
      'Bauhaus',
      'Dedeman',
      'Hornbach',
      'Mountfield',
      'Hagebau',
      'Peugeot',
      'Hyundai',
      'Škoda',
      'BMW',
      'Mercedes',
      'Benzina',
      'Shell',
      'OMV',
      'Orlen',
      'MOL',
      'Restaurace',
      'Kavárna',
      'Pizzerie',
      'Bistro',
    ]

    for (const merchant of merchants) {
      if (
        text.toUpperCase().includes(merchant.toUpperCase())
      ) {
        return merchant
      }
    }

    const words = text.split('\n')[0].split(' ')
    return words[0] || 'Ostatní'
  }

  suggestCategory(
    merchant: string,
    text: string
  ): string {
    const lowerText = text.toLowerCase()
    const lowerMerchant = merchant.toLowerCase()

    if (
      [
        'albert',
        'tesco',
        'lidl',
        'kaufland',
        'billa',
        'penny',
        'aeon',
        'coop',
        'potraviny',
        'supermarket',
        'obchod s potravinami',
      ].some((w) => lowerMerchant.includes(w)) ||
      lowerText.includes('jídlo') ||
      lowerText.includes('nákup potravin')
    ) {
      return 'var-food'
    }

    if (
      [
        'benzina',
        'shell',
        'omv',
        'mol',
        'orlen',
        'čerpací stanice',
      ].some((w) => lowerMerchant.includes(w)) ||
      lowerText.includes('benzín')
    ) {
      return 'var-transport'
    }

    if (
      ['dm', 'lékárna', 'zdravotnické'].some((w) =>
        lowerMerchant.includes(w)
      ) ||
      lowerText.includes('zdraví')
    ) {
      return 'var-personal'
    }

    if (
      [
        'restaurace',
        'kavárna',
        'pizzerie',
        'bistro',
        'café',
      ].some((w) => lowerMerchant.includes(w))
    ) {
      return 'var-food'
    }

    if (
      [
        'alza',
        'czc',
        'emag',
        'ikea',
        'bauhaus',
        'hornbach',
        'mountfield',
      ].some((w) => lowerMerchant.includes(w))
    ) {
      return 'unexp-shopping'
    }

    return 'var-food'
  }

  async processReceiptImage(
    file: File
  ): Promise<OCRResult> {
    try {
      const base64 = await this.fileToBase64(file)
      const text = await this.extractTextFromImage(base64)

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

  private async fileToBase64(
    file: File
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1] || '')
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private async extractTextFromImage(
    _base64: string
  ): Promise<string> {
    return `
    Obchod: Neznámý
    Datum: ${new Date().toLocaleDateString('cs-CZ')}
    Položky:
    - Položka 1: 50 Kč
    - Položka 2: 150 Kč
    CELKEM: 200 Kč
    `
  }

  private extractItems(text: string): string[] {
    const lines = text.split('\n')
    const items: string[] = []

    lines.forEach((line) => {
      if (
        line.includes('-') &&
        !line.toLowerCase().includes('celkem')
      ) {
        items.push(line.trim())
      }
    })

    return items.slice(0, 10)
  }
}

export const ocrService = new OCRService()