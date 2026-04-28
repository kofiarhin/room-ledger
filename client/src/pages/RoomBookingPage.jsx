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
  const availableStartCount = slots.filter((slot) => slot.durations.length > 0).length

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/82 text-white shadow-[0_28px_70px_-48px_rgba(0,0,0,0.9)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-9">
          <div>
            <Link className="text-sm font-semibold text-emerald-300 hover:text-emerald-200" to="/">Back to rooms</Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-400">Conference room</p>
            <h1 className="mt-3 text-4xl font-semibold leading-none tracking-tight sm:text-5xl">{room.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
              Pick a weekday, choose one of the available hourly starts, then send the request for review.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-zinc-300 sm:min-w-96">
            <span className="rounded-full bg-white/[0.06] px-3 py-2">08:00-17:00</span>
            <span className="rounded-full bg-white/[0.06] px-3 py-2">1-9 hrs</span>
            <span className="rounded-full bg-white/[0.06] px-3 py-2">{availableStartCount || 0} starts</span>
          </div>
        </div>
      </div>

      {createdBooking ? (
        <section className="grid gap-5 rounded-[2rem] border border-emerald-300/25 bg-emerald-400/10 p-5 shadow-[0_24px_60px_-42px_rgba(52,211,153,0.55)] sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-emerald-100">Booking request received</h2>
            <p className="mt-2 text-sm text-emerald-200/80">Save this booking ID to check status later.</p>
          </div>
          <BookingSummary booking={createdBooking} />
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300" to="/status">
              Check status
            </Link>
            <Button variant="secondary" onClick={() => setCreatedBooking(null)}>
              Create another booking
            </Button>
          </div>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="grid content-start gap-4 lg:sticky lg:top-28">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-sm sm:p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Step 1</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">Pick a date</h2>
              </div>
              <DatePickerField value={date} onChange={setDate} />
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Availability</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">Day summary</h2>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-xs font-semibold text-zinc-400">
                  {date}
                </span>
              </div>
              {availabilityQuery.isLoading ? <SkeletonBlock className="mt-4 h-36" /> : null}
              <ErrorMessage message={availabilityQuery.error ? 'Availability could not be loaded for that date.' : ''} />
              {availabilityQuery.data ? (
                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Available starts</p>
                      <p className="mt-2 font-mono text-3xl font-semibold text-emerald-100">{availableStartCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Blocked</p>
                      <p className="mt-2 font-mono text-3xl font-semibold text-zinc-100">
                        {availabilityQuery.data.blockedIntervals.length}
                      </p>
                    </div>
                  </div>
                  {availabilityQuery.data.blockedIntervals.length ? (
                    <ul className="grid gap-2 text-sm text-zinc-400">
                      {availabilityQuery.data.blockedIntervals.map((interval) => (
                        <li key={interval.bookingId} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.06] px-3 py-2">
                          <span className="font-mono text-xs font-semibold text-zinc-100">
                            {interval.startTime}-{interval.endTime}
                          </span>
                          <span className="text-xs capitalize text-zinc-500">{interval.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState title="Fully open" message="No pending or approved bookings block this date." />
                  )}
                </div>
              ) : null}
            </div>
          </aside>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_48px_-38px_rgba(0,0,0,0.85)] sm:p-6">
            <div className="mb-5 border-b border-white/10 pb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Booking request</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Request this room</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Requests stay pending until an admin reviews them.</p>
            </div>
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
