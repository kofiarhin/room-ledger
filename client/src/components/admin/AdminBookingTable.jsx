import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon, ClockIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { StatusBadge } from '../common/StatusBadge.jsx'
import { AdminBookingActions } from './AdminBookingActions.jsx'
import { AdminBookingEditor } from './AdminBookingEditor.jsx'

const STATUS_BORDER = {
  pending:   'border-l-amber-400',
  approved:  'border-l-emerald-500',
  denied:    'border-l-rose-500',
  cancelled: 'border-l-zinc-300',
}

function Initials({ name }) {
  const parts = (name || '?').trim().split(' ')
  const letters = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0] || '?').slice(0, 2)
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold uppercase tracking-wide text-zinc-600">
      {letters.toUpperCase()}
    </span>
  )
}

const TABS = ['actions', 'edit']

export function AdminBookingTable({ bookings }) {
  const [expandedId, setExpandedId] = useState('')
  const [activeTab, setActiveTab] = useState({})

  function getTab(id) {
    return activeTab[id] || 'actions'
  }
  function setTab(id, tab) {
    setActiveTab((prev) => ({ ...prev, [id]: tab }))
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_18px_44px_-34px_rgba(24,24,27,0.85)]">
      <div className="hidden border-b border-zinc-200 bg-zinc-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 md:grid md:grid-cols-[2fr_1fr_1.1fr_auto] md:items-center md:gap-4">
        <span className="pl-12">Requester</span>
        <span>Room</span>
        <span>Schedule</span>
        <span>Status</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {bookings.map((booking) => (
          <article
            key={booking.id}
            className={`border-l-4 transition duration-150 hover:bg-zinc-50/60 ${STATUS_BORDER[booking.status] ?? 'border-l-zinc-200'}`}
          >
            <button
              type="button"
              className="grid w-full gap-4 px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700/20 active:scale-[0.999] sm:px-5 md:grid-cols-[2fr_1fr_1.1fr_auto] md:items-center md:gap-4"
              aria-expanded={expandedId === booking.id}
              onClick={() => setExpandedId((cur) => (cur === booking.id ? '' : booking.id))}
            >
              <div className="flex items-center gap-3">
                <Initials name={booking.requesterName} />
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-zinc-400">{booking.bookingId}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-zinc-900">{booking.requesterName}</p>
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-zinc-500">
                    <EnvelopeClosedIcon aria-hidden="true" className="size-3 shrink-0" />
                    <span className="truncate">{booking.requesterEmail}</span>
                  </span>
                </div>
              </div>

              <div className="text-sm font-medium text-zinc-700">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 md:hidden">Room · </span>
                {booking.room?.name}
              </div>

              <div className="grid gap-1 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon aria-hidden="true" className="size-3.5 shrink-0 text-zinc-400" />
                  {booking.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon aria-hidden="true" className="size-3.5 shrink-0 text-zinc-400" />
                  {booking.startTime}–{booking.endTime}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <StatusBadge status={booking.status} />
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`size-4 text-zinc-400 transition duration-300 ${expandedId === booking.id ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {expandedId === booking.id && (
              <div className="px-4 pb-5 sm:px-5">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/60">
                  <div className="flex border-b border-zinc-200 text-sm font-medium">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`px-5 py-3 capitalize transition focus:outline-none ${
                          getTab(booking.id) === tab
                            ? 'border-b-2 border-emerald-700 text-emerald-800'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                        onClick={() => setTab(booking.id, tab)}
                      >
                        {tab === 'actions' ? 'Actions' : 'Edit booking'}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {getTab(booking.id) === 'actions' ? (
                      <div className="grid gap-4">
                        {booking.purpose && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Purpose</p>
                            <p className="mt-1.5 text-sm leading-6 text-zinc-700">{booking.purpose}</p>
                          </div>
                        )}
                        <AdminBookingActions booking={booking} />
                      </div>
                    ) : (
                      <AdminBookingEditor booking={booking} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
