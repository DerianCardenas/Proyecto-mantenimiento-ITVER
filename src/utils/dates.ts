export type DateFormatOptions = Intl.DateTimeFormatOptions

export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const parsed = new Date(year, month - 1, day)

  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null
  }

  return parsed
}

export function toDateOnly(value: Date | null): string | null {
  if (!value || Number.isNaN(value.getTime())) return null

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateOnly(value: string | null | undefined, options: DateFormatOptions): string {
  const date = parseDateOnly(value)
  return date ? date.toLocaleDateString('es-MX', options) : 'Sin programar'
}

export function formatDateTime(value: string | null | undefined, options: DateFormatOptions): string {
  if (!value) return 'Sin programar'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Sin programar' : date.toLocaleDateString('es-MX', options)
}
