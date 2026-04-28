import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExitIcon } from '@radix-ui/react-icons'
import { AdminBookingFilters } from '../components/admin/AdminBookingFilters.jsx'
import { AdminBookingTable } from '../components/admin/AdminBookingTable.jsx'
import { AdminMetrics } from '../components/admin/AdminMetrics.jsx'
import { Button } from '../components/common/Button.jsx'
import { EmptyState, ErrorMessage, SkeletonBlock } from '../components/common/States.jsx'
import { useAdminLogout } from '../hooks/mutations/useAdminAuth.js'
import { useAdminBookings } from '../hooks/queries/useAdminBookings.js'
import { useRooms } from '../hooks/queries/useRooms.js'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ status: '', roomId: '', date: '', q: '' })
  const bookingsQuery = useAdminBookings(filters)
  const roomsQuery = useRooms()
  const logout = useAdminLogout()
  const bookings = bookingsQuery.data || []
  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const approvedCount = bookings.filter((b) => b.status === 'approved').length
  const visibleStatus = filters.status || 'all'

  return (
    <div className="grid gap-5 sm:gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950/82 shadow-[0_28px_64px_-24px_rgba(0,0,0,0.72)]">
        <div className="h-1 bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400" />
        <div className="grid gap-6 px-6 pt-6 pb-5 sm:px-8 sm:pt-7 sm:pb-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Operations · RoomLedger</p>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Review requests, resolve pending bookings, and keep room schedules accurate across teams.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              <div className="min-w-19 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-center">
                <p className="text-xs font-medium text-amber-400/80">Pending</p>
                <p className="mt-0.5 font-mono text-2xl font-bold leading-none text-amber-300">{pendingCount}</p>
              </div>
              <div className="min-w-19 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-center">
                <p className="text-xs font-medium text-emerald-400/80">Approved</p>
                <p className="mt-0.5 font-mono text-2xl font-bold leading-none text-emerald-300">{approvedCount}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/admin/login') })}
            >
              <ExitIcon aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-zinc-800 bg-zinc-900/40 px-6 py-3 text-xs text-zinc-500 sm:px-8">
          <span>
            Showing{' '}
            <span className="font-semibold text-zinc-300">{bookings.length}</span>{' '}
            {visibleStatus} bookings
          </span>
          <span>
            Rooms loaded:{' '}
            <span className="text-zinc-300">{roomsQuery.data?.length ?? 0}</span>
          </span>
        </div>
      </section>

      <AdminMetrics bookings={bookings} />
      <AdminBookingFilters filters={filters} setFilters={setFilters} rooms={roomsQuery.data || []} />

      {bookingsQuery.isLoading ? <SkeletonBlock className="h-80" /> : null}
      <ErrorMessage message={bookingsQuery.error ? 'Bookings could not be loaded.' : ''} />
      {bookings.length ? <AdminBookingTable bookings={bookings} /> : null}
      {!bookingsQuery.isLoading && bookings.length === 0 ? (
        <EmptyState title="No bookings found" message="Adjust filters or wait for new booking requests." />
      ) : null}
    </div>
  )
}
