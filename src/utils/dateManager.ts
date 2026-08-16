export type ViewMode = 'day' | 'week' | 'month'

// Modifier au format YYYY-MM-DD attendu par <input type="date">
export function dateToString(dateObj: Date): string {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getWeekDates(date: string): string[] {
  // find the Monday of the week for the given date
  const monday = new Date(date)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return dateToString(day)
  })
}

export function getMonthGrid(date: string): string[][] {
  const d = new Date(date)
  const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1)
  const firstWeekStart = getWeekDates(dateToString(firstOfMonth))[0]

  const lastOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const lastWeekDates = getWeekDates(dateToString(lastOfMonth))
  const lastWeekEnd = lastWeekDates[6]

  const weeks: string[][] = []
  const cursor = new Date(firstWeekStart!)
  const end = new Date(lastWeekEnd!)

  while (cursor <= end) {
    weeks.push(getWeekDates(dateToString(cursor)))
    cursor.setDate(cursor.getDate() + 7)
  }
  return weeks
}

export function shiftDateByMode(date: string, mode: ViewMode, direction: 1 | -1): string {
  const d = new Date(date)
  if (mode === 'day') d.setDate(d.getDate() + direction)
  else if (mode === 'week') d.setDate(d.getDate() + 7 * direction)
  else if (mode === 'month') d.setMonth(d.getMonth() + direction)
  return dateToString(d)
}

export function formatDayLabel(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
}

export function formatMonthLabel(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}
