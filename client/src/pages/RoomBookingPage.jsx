import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DatePickerField } from '../components/availability/DatePickerField.jsx'
import { BookingForm } from '../components/bookings/BookingForm.jsx'
import { BookingSummary } from '../components/bookings/BookingSummary.jsx'
import { Button } from '../components/common/Button.jsx'
import { EmptyState, ErrorMessage, SkeletonBlock } from '../components/common/States.jsx'
import { nextWeekdayIso } from '../constants/booking.js'
import { useCreateBooking } from '../hooks/mutations/useCreateBooking.js'
import { useAvailability } from '../hooks/queries/useAvailability.js'
import { useRoom } from '../hooks/queries/useRoom.js'

export function RoomBookingPage() {
  const { roomSlug } = useParams()
  const [date, setDate] = useState(nextWeekdayIso())
  const [createdBooking, setCreatedBooking] = useState(null)
  const roomQuery = useRoom(roomSlug)
  const availabilityQuery = useAvailability({ roomId: roomQuery.data?.id, date })
  const createMutation = useCreateBooking()

  if (roomQuery.isLoading) return <SkeletonBlock className="h-64" />
  if (roomQuery.error) return <ErrorMessage message="Room could not be loaded." />

  const room = roomQuery.data
  const slots = availabilityQuery.data?.slots || []

  return (
    <div className="grid gap-8">
      <div>
        <Link className="text-sm font-medium text-emerald-800" to="/">Back to rooms</Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{room.name}</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Choose an hourly slot between 08:00 and 17:00, Monday through Friday.</p>
      </div>

      {createdBooking ? (
        <section className="grid gap-5 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div>
            <h2 className="text-xl font-semibold text-emerald-950">Booking request received</h2>
            <p className="mt-2 text-sm text-emerald-900">Save this booking ID to check status later.</p>
          </div>
          <BookingSummary booking={createdBooking} />
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white" to="/status">
              Check status
            </Link>
            <Button variant="secondary" onClick={() => setCreatedBooking(null)}>
              Create another booking
            </Button>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="grid content-start gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <DatePickerField value={date} onChange={setDate} />
            {availabilityQuery.isLoading ? <SkeletonBlock className="h-36" /> : null}
            <ErrorMessage message={availabilityQuery.error ? 'Availability could not be loaded for that date.' : ''} />
            {availabilityQuery.data ? (
              <div className="grid gap-3">
                <h2 className="text-sm font-semibold text-zinc-950">Blocked intervals</h2>
                {availabilityQuery.data.blockedIntervals.length ? (
                  <ul className="grid gap-2 text-sm text-zinc-700">
                    {availabilityQuery.data.blockedIntervals.map((interval) => (
                      <li key={interval.bookingId} className="rounded-md bg-zinc-100 px-3 py-2">
                        {interval.startTime}-{interval.endTime} ({interval.status})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="Fully open" message="No pending or approved bookings block this date." />
                )}
              </div>
            ) : null}
          </aside>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">Request this room</h2>
            <p className="mb-5 mt-2 text-sm text-zinc-600">Requests stay pending until an admin reviews them.</p>
            <BookingForm
              room={room}
              date={date}
              slots={slots}
              mutation={createMutation}
              onSuccess={setCreatedBooking}
            />
          </div>
        </section>
      )}
    </div>
  )
}
