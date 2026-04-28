import { useState } from 'react'
import { BookingStatusPanel } from '../components/bookings/BookingStatusPanel.jsx'
import { Button } from '../components/common/Button.jsx'
import { InputField } from '../components/common/FormFields.jsx'
import { EmptyState, ErrorMessage, SkeletonBlock } from '../components/common/States.jsx'
import { useBookingStatus } from '../hooks/queries/useBookingStatus.js'

export function StatusPage() {
  const [input, setInput] = useState('')
  const [bookingId, setBookingId] = useState('')
  const bookingQuery = useBookingStatus(bookingId)

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_-42px_rgba(0,0,0,0.85)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Booking lookup</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">Check booking status</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
          Enter the booking ID you received after submitting a request. Pending bookings can still be edited or cancelled.
        </p>
      </div>
      <form
        className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:p-5"
        onSubmit={(event) => {
          event.preventDefault()
          setBookingId(input.trim().toUpperCase())
        }}
      >
        <InputField label="Booking ID" value={input} onChange={(event) => setInput(event.target.value)} placeholder="RL-20260504-ABCD" />
        <div className="flex items-end">
          <Button type="submit" className="w-full sm:w-auto">Look up</Button>
        </div>
      </form>
      {bookingQuery.isLoading ? <SkeletonBlock className="h-48" /> : null}
      {bookingQuery.error ? <ErrorMessage message="Booking not found. Check the ID and try again." /> : null}
      {!bookingId ? <EmptyState title="No booking selected" message="Submit a booking ID to view details." /> : null}
      {bookingQuery.data ? <BookingStatusPanel booking={bookingQuery.data} /> : null}
    </div>
  )
}
