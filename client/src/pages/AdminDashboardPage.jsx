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
  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length
  const approvedCount = bookings.filter((booking) => booking.status === 'approved').length
  const visibleStatus = filters.status || 'all'

  return (
    <div className="grid gap-5 sm:gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white shadow-[0_24px_60px_-42px_rgba(24,24,27,0.65)]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Admin dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Review requests, resolve pending bookings, and keep room schedules accurate across teams.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 lg:justify-items-end">
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <div className="border-r border-zinc-200 px-4 py-3">
                <p className="text-xs font-medium text-zinc-500">Pending</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-zinc-950">{pendingCount}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-medium text-zinc-500">Approved</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-zinc-950">{approvedCount}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full gap-2 sm:w-auto"
              onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/admin/login') })}
            >
              <ExitIcon aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
        <div className="grid gap-3 border-t border-zinc-200 bg-zinc-50/80 px-5 py-4 text-sm text-zinc-600 sm:grid-cols-3 sm:px-7 lg:px-8">
          <span>
            Showing <strong className="font-semibold text-zinc-950">{bookings.length}</strong> {visibleStatus} bookings
          </span>
          <span className="sm:text-center">Rooms loaded: {roomsQuery.data?.length || 0}</span>
          <span className="sm:text-right">Last refreshed by filters</span>
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
