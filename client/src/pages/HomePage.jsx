import { Link } from 'react-router-dom'
import { useRooms } from '../hooks/queries/useRooms.js'
import { RoomSelector } from '../components/rooms/RoomSelector.jsx'
import { EmptyState, ErrorMessage, SkeletonBlock } from '../components/common/States.jsx'

export function HomePage() {
  const roomsQuery = useRooms()

  return (
    <div className="grid gap-7 sm:gap-9">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 text-white shadow-[0_28px_70px_-48px_rgba(0,0,0,0.9)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid content-between gap-8 p-6 sm:p-8 lg:min-h-[30rem] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">RoomLedger</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">
                Reserve the right room in under a minute.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                Pick a room, choose an hourly weekday slot, and track every request with a booking ID.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
                href="#rooms"
              >
                Choose a room
              </a>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                to="/status"
              >
                Check booking status
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.03] p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="grid h-full content-between gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Booking window</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">08:00-17:00</p>
                </div>
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Weekdays
                </span>
              </div>

              <div className="grid gap-3">
                {[
                  ['08:00', 'Focus setup', 'bg-emerald-300'],
                  ['10:00', 'Team review', 'bg-white'],
                  ['13:00', 'Open block', 'bg-zinc-500'],
                  ['15:00', 'Planning', 'bg-emerald-300'],
                ].map(([time, label, color]) => (
                  <div key={time} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-zinc-400">{time}</span>
                    <span className="flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3 text-sm text-zinc-200">
                      <span className={`size-2 rounded-full ${color}`} />
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-zinc-300">
                <span className="rounded-full bg-white/[0.06] px-3 py-2">Hourly</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-2">1-9 hrs</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-2">Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {roomsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
        </div>
      ) : null}
      <ErrorMessage message={roomsQuery.error?.message} />
      {roomsQuery.data?.length ? (
        <section id="rooms" className="grid scroll-mt-28 gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Available rooms</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Select a space</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Requests are checked against pending and approved bookings before submission.
            </p>
          </div>
          <RoomSelector rooms={roomsQuery.data} />
        </section>
      ) : null}
      {roomsQuery.data?.length === 0 ? (
        <EmptyState title="No active rooms" message="Ask an admin to activate rooms before booking." />
      ) : null}
    </div>
  )
}
