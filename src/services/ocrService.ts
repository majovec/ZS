interface OCRResult {
  amount: number | null
  merchant: string
  date: string
  items: string[]
  confidence: number
  suggestedCategory: string
}

class OCRService {
  extractAmount(text: string): number | null {
    const normalized = text.replace(/\u00a0/g, ' ')
    const totalLine = normalized.match(/(?:celkem|total|k úhradě|částka k úhradě)[^\d]*(\d{1,7}(?:[ .]\d{3})*(?:[.,]\d{1,2})?)/i)
    const patterns = totalLine ? [totalLine] : [
      normalized.match(/(\d{1,7}(?:[ .]\d{3})*[.,]\d{2})\s*(?:Kč|CZK)/i),
      normalized.match(/(\d{1,7}(?:[ .]\d{3})*)\s*(?:Kč|CZK)/i),
      normalized.match(/\b(\d{1,7}[.,]\d{2})\b/),
    ]

    for (const match of patterns) {
      if (!match) continue
      const amount = Number(match[1].replace(/ /g, '').replace(',', '.'))
      if (Number.isFinite(amount)) return amount
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
        date: this.extractDate(text) || new Date().toISOString().split('T')[0],
        items: this.extractItems(text),
        confidence: amount ? 0.8 : 0.5,
        suggestedCategory: this.suggestCategory(merchant, text),
      }
    } catch (error) {
      console.error('OCR Error:', error)

      return {
        amount: null,
        merchant: 'Neznámý obchod',
        date: new Date().toISOString().split('T')[0],
        items: [],
        confidence: 0,
        suggestedCategory: 'var-food',
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
    base64: string
  ): Promise<string> {
    // OCR runs locally in the browser; no receipt image is sent to our server.
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('ces+eng')
    try {
      const result = await worker.recognize(`data:image/jpeg;base64,${base64}`)
      return result.data.text || ''
    } finally {
      await worker.terminate()
    }
  }

  private extractDate(text: string): string | null {
    const match = text.match(/\b(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2,4})\b/)
    if (!match) return null
    const year = match[3].length === 2 ? `20${match[3]}` : match[3]
    const month = match[2].padStart(2, '0')
    const day = match[1].padStart(2, '0')
    const iso = `${year}-${month}-${day}`
    const date = new Date(`${iso}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : iso
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