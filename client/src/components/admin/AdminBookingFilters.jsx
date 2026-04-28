import { InputField, SelectField } from '../common/FormFields.jsx'

export function AdminBookingFilters({ filters, setFilters, rooms }) {
  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-4">
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
      <InputField label="Search" value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="ID, name, email" />
    </div>
  )
}
