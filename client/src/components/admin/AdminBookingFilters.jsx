import { Cross2Icon, MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '../common/Button.jsx'
import { InputField, SelectField } from '../common/FormFields.jsx'

export function AdminBookingFilters({ filters, setFilters, rooms }) {
  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function clearFilters() {
    setFilters({ status: '', roomId: '', date: '', q: '' })
  }

  const hasFilters = Boolean(filters.status || filters.roomId || filters.date || filters.q)

  const activeChips = [
    filters.status  && { key: 'status',  label: `Status: ${filters.status}` },
    filters.roomId  && { key: 'roomId',  label: `Room: ${rooms.find((r) => r.id === filters.roomId)?.name ?? filters.roomId}` },
    filters.date    && { key: 'date',    label: `Date: ${filters.date}` },
    filters.q       && { key: 'q',       label: `"${filters.q}"` },
  ].filter(Boolean)

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-200">
            <MixerHorizontalIcon aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-zinc-100">Filter bookings</h2>
        </div>
        <Button
          variant="ghost"
          className="h-8 min-h-0 px-3 text-xs"
          onClick={clearFilters}
          disabled={!hasFilters}
        >
          Clear all
        </Button>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-[0.85fr_1fr_0.85fr_1.2fr] sm:p-6">
        <SelectField label="Status" value={filters.status} onChange={(e) => update('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="cancelled">Cancelled</option>
        </SelectField>
        <SelectField label="Room" value={filters.roomId} onChange={(e) => update('roomId', e.target.value)}>
          <option value="">All rooms</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </SelectField>
        <InputField
          label="Date"
          type="date"
          value={filters.date}
          onChange={(e) => update('date', e.target.value)}
        />
        <InputField
          label="Search"
          value={filters.q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="ID, name, email…"
          icon={<MagnifyingGlassIcon aria-hidden="true" />}
        />
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-3 sm:px-6">
          {activeChips.map(({ key, label }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200"
            >
              {label}
              <button
                type="button"
                className="rounded-full transition hover:text-emerald-100 focus:outline-none"
                onClick={() => update(key, '')}
                aria-label={`Remove ${label} filter`}
              >
                <Cross2Icon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
