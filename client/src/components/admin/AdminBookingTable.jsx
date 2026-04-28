import { useState } from 'react'
import { StatusBadge } from '../common/StatusBadge.jsx'
import { AdminBookingActions } from './AdminBookingActions.jsx'
import { AdminBookingEditor } from './AdminBookingEditor.jsx'

export function AdminBookingTable({ bookings }) {
  const [expandedId, setExpandedId] = useState('')

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm">
      <div className="divide-y divide-zinc-200">
        {bookings.map((booking) => (
          <article key={booking.id} className="grid gap-4 p-4 sm:p-5">
            <button
              type="button"
              className="grid gap-3 rounded-2xl text-left transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-center"
              onClick={() => setExpandedId((current) => (current === booking.id ? '' : booking.id))}
            >
              <div>
                <p className="font-mono text-sm font-semibold text-zinc-950">{booking.bookingId}</p>
                <p className="text-sm text-zinc-600">{booking.requesterName}</p>
              </div>
              <div className="text-sm text-zinc-700">{booking.room?.name}</div>
              <div className="text-sm text-zinc-700">
                {booking.date} {booking.startTime}-{booking.endTime}
              </div>
              <StatusBadge status={booking.status} />
            </button>
            {expandedId === booking.id ? (
              <div className="grid gap-5 border-t border-zinc-200 pt-4">
                <p className="text-sm text-zinc-700">{booking.purpose}</p>
                <AdminBookingActions booking={booking} />
                <AdminBookingEditor booking={booking} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
