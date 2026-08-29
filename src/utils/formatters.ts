// Formátování peněz
export const formatCurrency = (value: number, currency: string = 'Kč'): string => {
  return `${value.toLocaleString('cs-CZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} ${currency}`
}

// Formátování data
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Formátování času
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Formátování jako měsíc
export const formatMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })
}

// Procenta
export const formatPercent = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

// Relativní čas (např. "před 2 dny")
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return 'Právě teď'
  if (diffMinutes < 60) return `Před ${diffMinutes} minutou`
  if (diffHours < 24) return `Před ${diffHours} hodinami`
  if (diffDays < 7) return `Před ${diffDays} dnem`
  if (diffDays < 30) return `Před ${Math.floor(diffDays / 7)} týdnem`
  return formatDate(d)
}
