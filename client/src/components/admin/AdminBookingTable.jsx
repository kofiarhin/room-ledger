import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon, ClockIcon, EnvelopeClosedIcon, PersonIcon } from '@radix-ui/react-icons'
import { StatusBadge } from '../common/StatusBadge.jsx'
import { AdminBookingActions } from './AdminBookingActions.jsx'
import { AdminBookingEditor } from './AdminBookingEditor.jsx'

export function AdminBookingTable({ bookings }) {
  const [expandedId, setExpandedId] = useState('')

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white shadow-[0_18px_44px_-34px_rgba(24,24,27,0.85)]">
      <div className="hidden border-b border-zinc-200 bg-zinc-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 md:grid md:grid-cols-[1.15fr_0.9fr_1fr_auto] md:items-center">
        <span>Requester</span>
        <span>Room</span>
        <span>Schedule</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-zinc-200">
        {bookings.map((booking) => (
          <article key={booking.id} className="grid gap-4 p-4 transition duration-300 hover:bg-zinc-50/60 sm:p-5">
            <button
              type="button"
              className="grid w-full gap-4 rounded-2xl text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-700/20 active:scale-[0.995] md:grid-cols-[1.15fr_0.9fr_1fr_auto] md:items-center"
              aria-expanded={expandedId === booking.id}
              onClick={() => setExpandedId((current) => (current === booking.id ? '' : booking.id))}
            >
              <div className="grid gap-2">
                <p className="font-mono text-sm font-semibold text-zinc-950">{booking.bookingId}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <PersonIcon aria-hidden="true" />
                  {booking.requesterName}
                </span>
                <span className="inline-flex min-w-0 items-center gap-2 text-sm text-zinc-500">
                  <EnvelopeClosedIcon aria-hidden="true" className="shrink-0" />
                  <span className="truncate">{booking.requesterEmail}</span>
                </span>
              </div>
              <div className="grid gap-1 text-sm text-zinc-700">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500 md:hidden">Room</span>
                <span>{booking.room?.name}</span>
              </div>
              <div className="grid gap-2 text-sm text-zinc-700">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon aria-hidden="true" />
                  {booking.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ClockIcon aria-hidden="true" />
                  {booking.startTime}-{booking.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <StatusBadge status={booking.status} />
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`size-5 text-zinc-400 transition duration-300 ${expandedId === booking.id ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            {expandedId === booking.id ? (
              <div className="grid gap-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Purpose</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{booking.purpose}</p>
                </div>
                <AdminBookingActions booking={booking} />
                <AdminBookingEditor booking={booking} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
