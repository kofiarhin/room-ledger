import { Link } from 'react-router-dom'
import { useRooms } from '../hooks/queries/useRooms.js'
import { RoomSelector } from '../components/rooms/RoomSelector.jsx'
import { EmptyState, ErrorMessage, SkeletonBlock } from '../components/common/States.jsx'

export function HomePage() {
  const roomsQuery = useRooms()

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Conference room booking</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
            RoomLedger
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            Smart scheduling. Zero conflicts.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-950">Already booked?</h2>
          <p className="mt-2 text-sm text-zinc-600">Use your booking ID to check status, edit a pending request, or cancel a pending request.</p>
          <Link className="mt-4 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white" to="/status">
            Check booking status
          </Link>
        </div>
      </section>

      {roomsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
        </div>
      ) : null}
      <ErrorMessage message={roomsQuery.error?.message} />
      {roomsQuery.data?.length ? <RoomSelector rooms={roomsQuery.data} /> : null}
      {roomsQuery.data?.length === 0 ? (
        <EmptyState title="No active rooms" message="Ask an admin to activate rooms before booking." />
      ) : null}
    </div>
  )
}
