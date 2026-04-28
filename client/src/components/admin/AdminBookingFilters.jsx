import { MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { InputField, SelectField } from '../common/FormFields.jsx'
import { Button } from '../common/Button.jsx'

export function AdminBookingFilters({ filters, setFilters, rooms }) {
  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function clearFilters() {
    setFilters({ status: '', roomId: '', date: '', q: '' })
  }

  const hasFilters = Boolean(filters.status || filters.roomId || filters.date || filters.q)

  return (
    <section className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_16px_36px_-32px_rgba(24,24,27,0.9)] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
            <MixerHorizontalIcon aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">Filter bookings</h2>
            <p className="text-sm text-zinc-500">Narrow the queue before opening a request.</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={clearFilters} disabled={!hasFilters}>
          Clear filters
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-[0.85fr_1fr_0.85fr_1.2fr]">
        <SelectField label="Status" value={filters.status} onChange={(event) => update('status', event.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="cancelled">Cancelled</option>
        </SelectField>
        <SelectField label="Room" value={filters.roomId} onChange={(event) => update('roomId', event.target.value)}>
          <option value="">All rooms</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </SelectField>
        <InputField label="Date" type="date" value={filters.date} onChange={(event) => update('date', event.target.value)} />
        <InputField
          label="Search"
          value={filters.q}
          onChange={(event) => update('q', event.target.value)}
          placeholder="ID, name, email"
          icon={<MagnifyingGlassIcon aria-hidden="true" />}
        />
      </div>
    </section>
  )
}
