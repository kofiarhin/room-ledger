export const DEPARTMENTS = [
  'HR',
  'Finance',
  'IT',
  'Operations',
  'Marketing',
  'Sales',
  'Management',
  'Other',
]

export const VALID_DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function nextWeekdayIso(date = new Date()) {
  const next = new Date(date)
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1)
  }
  return next.toISOString().slice(0, 10)
}
