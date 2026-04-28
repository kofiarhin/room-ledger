import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Admin dashboard</h1>
          <p className="mt-2 text-zinc-600">Review, approve, deny, edit, and delete booking requests.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/admin/login') })}
        >
          Sign out
        </Button>
      </div>
      <AdminMetrics bookings={bookings} />
      <AdminBookingFilters filters={filters} setFilters={setFilters} rooms={roomsQuery.data || []} />
      {bookingsQuery.isLoading ? <SkeletonBlock className="h-64" /> : null}
      <ErrorMessage message={bookingsQuery.error ? 'Bookings could not be loaded.' : ''} />
      {bookings.length ? <AdminBookingTable bookings={bookings} /> : null}
      {!bookingsQuery.isLoading && bookings.length === 0 ? (
        <EmptyState title="No bookings found" message="Adjust filters or wait for new booking requests." />
      ) : null}
    </div>
  )
}
