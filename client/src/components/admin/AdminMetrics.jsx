import { CheckCircledIcon, ClockIcon, CrossCircledIcon, ReaderIcon, StopIcon } from '@radix-ui/react-icons'

const ITEMS = [
  { key: 'total',     label: 'Total',     Icon: ReaderIcon,       bar: 'bg-zinc-400',    tone: 'bg-zinc-100 text-zinc-600' },
  { key: 'pending',   label: 'Pending',   Icon: ClockIcon,        bar: 'bg-amber-400',   tone: 'bg-amber-50 text-amber-700' },
  { key: 'approved',  label: 'Approved',  Icon: CheckCircledIcon, bar: 'bg-emerald-500', tone: 'bg-emerald-50 text-emerald-800' },
  { key: 'denied',    label: 'Denied',    Icon: CrossCircledIcon, bar: 'bg-rose-500',    tone: 'bg-rose-50 text-rose-700' },
  { key: 'cancelled', label: 'Cancelled', Icon: StopIcon,         bar: 'bg-zinc-300',    tone: 'bg-zinc-100 text-zinc-500' },
]

export function AdminMetrics({ bookings }) {
  const counts = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    approved:  bookings.filter((b) => b.status === 'approved').length,
    denied:    bookings.filter((b) => b.status === 'denied').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {ITEMS.map(({ key, label, Icon, bar, tone }) => (
        <div
          key={key}
          className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className={`h-1 ${bar}`} />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
              <span className={`grid size-8 place-items-center rounded-lg ${tone}`}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-mono text-4xl font-bold leading-none text-zinc-950">{counts[key]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
