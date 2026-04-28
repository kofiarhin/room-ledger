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
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Check booking status</h1>
        <p className="mt-2 text-zinc-600">Enter the booking ID you received after submitting a request.</p>
      </div>
      <form
        className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault()
          setBookingId(input.trim().toUpperCase())
        }}
      >
        <InputField label="Booking ID" value={input} onChange={(event) => setInput(event.target.value)} placeholder="RL-20260504-ABCD" />
        <div className="flex items-end">
          <Button type="submit">Look up</Button>
        </div>
      </form>
      {bookingQuery.isLoading ? <SkeletonBlock className="h-48" /> : null}
      {bookingQuery.error ? <ErrorMessage message="Booking not found. Check the ID and try again." /> : null}
      {!bookingId ? <EmptyState title="No booking selected" message="Submit a booking ID to view details." /> : null}
      {bookingQuery.data ? <BookingStatusPanel booking={bookingQuery.data} /> : null}
    </div>
  )
}
