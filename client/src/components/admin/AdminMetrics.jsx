export function AdminMetrics({ bookings }) {
  const counts = {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    approved: bookings.filter((booking) => booking.status === 'approved').length,
    denied: bookings.filter((booking) => booking.status === 'denied').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
  }

  const items = [
    ['Total bookings', counts.total],
    ['Pending bookings', counts.pending],
    ['Approved bookings', counts.approved],
    ['Denied bookings', counts.denied],
    ['Cancelled bookings', counts.cancelled],
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-zinc-950">{value}</p>
        </div>
      ))}
    </div>
  )
}
