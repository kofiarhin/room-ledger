import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useMemo, useState } from 'react'

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
const selectedDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDateKey(value) {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  const parsed = new Date(year, month - 1, day)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isSameMonth(date, monthDate) {
  return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear()
}

function isWeekday(date) {
  const day = date.getDay()
  return day >= 1 && day <= 5
}

function buildCalendarDays(monthDate) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const start = new Date(firstOfMonth)
  start.setDate(firstOfMonth.getDate() - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

export function DatePickerField({ value, onChange }) {
  const selectedDate = fromDateKey(value)
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(selectedDate || today)
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth])
  const selectedKey = selectedDate ? toDateKey(selectedDate) : ''

  function moveMonth(amount) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  function selectDate(date) {
    if (!isWeekday(date)) return
    onChange(toDateKey(date))
  }

  return (
    <section className="grid gap-3" aria-labelledby="booking-date-label">
      <div className="grid gap-1">
        <span id="booking-date-label" className="text-sm font-medium text-zinc-800">
          Booking date
        </span>
        <span className="text-xs text-zinc-500">Weekdays only.</span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 active:translate-y-px"
            onClick={() => moveMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </button>
          <p className="text-sm font-semibold text-zinc-950" aria-live="polite">
            {monthFormatter.format(visibleMonth)}
          </p>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 active:translate-y-px"
            onClick={() => moveMonth(1)}
            aria-label="Next month"
          >
            <ChevronRightIcon aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-500">
          {weekdayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {calendarDays.map((date) => {
            const dateKey = toDateKey(date)
            const selected = dateKey === selectedKey
            const disabled = !isSameMonth(date, visibleMonth) || !isWeekday(date)

            return (
              <button
                type="button"
                key={dateKey}
                className={`aspect-square min-h-10 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-700/20 ${
                  selected
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-800 hover:bg-emerald-50 hover:text-emerald-800'
                } ${disabled ? 'cursor-not-allowed text-zinc-300 hover:bg-transparent hover:text-zinc-300' : ''}`}
                onClick={() => selectDate(date)}
                disabled={disabled}
                aria-pressed={selected}
                aria-label={selectedDateFormatter.format(date)}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate ? (
        <p className="text-xs text-zinc-500">Selected: {selectedDateFormatter.format(selectedDate)}</p>
      ) : (
        <p className="text-xs text-zinc-500">Select a booking date.</p>
      )}
    </section>
  )
}
