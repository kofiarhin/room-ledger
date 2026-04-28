import { CheckCircledIcon, ClockIcon, CrossCircledIcon, ReaderIcon, StopIcon } from '@radix-ui/react-icons'

export function AdminMetrics({ bookings }) {
  const counts = {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    approved: bookings.filter((booking) => booking.status === 'approved').length,
    denied: bookings.filter((booking) => booking.status === 'denied').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
  }

  const items = [
    { label: 'Total bookings', value: counts.total, icon: ReaderIcon, tone: 'text-zinc-700 bg-zinc-100' },
    { label: 'Pending bookings', value: counts.pending, icon: ClockIcon, tone: 'text-amber-800 bg-amber-50' },
    { label: 'Approved bookings', value: counts.approved, icon: CheckCircledIcon, tone: 'text-emerald-800 bg-emerald-50' },
    { label: 'Denied bookings', value: counts.denied, icon: CrossCircledIcon, tone: 'text-rose-800 bg-rose-50' },
    { label: 'Cancelled bookings', value: counts.cancelled, icon: StopIcon, tone: 'text-zinc-600 bg-zinc-100' },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="group grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_16px_36px_-30px_rgba(24,24,27,0.85)] transition duration-300 hover:-translate-y-0.5 hover:border-zinc-300"
        >
          <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
            <Icon aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold leading-none text-zinc-950">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
