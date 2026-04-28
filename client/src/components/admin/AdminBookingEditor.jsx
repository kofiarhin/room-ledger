import { useState } from 'react'
import { DEPARTMENTS } from '../../constants/booking.js'
import { useUpdateAdminBooking } from '../../hooks/mutations/useAdminBookingActions.js'
import { Button } from '../common/Button.jsx'
import { InputField, SelectField, TextareaField } from '../common/FormFields.jsx'

export function AdminBookingEditor({ booking }) {
  const mutation = useUpdateAdminBooking()
  const [form, setForm] = useState({
    requesterName: booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterPhone: booking.requesterPhone || '',
    department: booking.department,
    purpose: booking.purpose,
    date: booking.date,
    startTime: booking.startTime,
    durationHours: booking.durationHours,
    status: booking.status,
    adminNote: booking.adminNote || '',
  })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <form
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate({ id: booking.id, payload: form })
      }}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <InputField label="Name" value={form.requesterName} onChange={(event) => update('requesterName', event.target.value)} />
        <InputField label="Email" value={form.requesterEmail} onChange={(event) => update('requesterEmail', event.target.value)} />
        <InputField label="Phone" value={form.requesterPhone} onChange={(event) => update('requesterPhone', event.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <SelectField label="Department" value={form.department} onChange={(event) => update('department', event.target.value)}>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </SelectField>
        <InputField label="Date" type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
        <InputField label="Start" type="time" step="3600" value={form.startTime} onChange={(event) => update('startTime', event.target.value)} />
        <SelectField label="Duration" value={form.durationHours} onChange={(event) => update('durationHours', Number(event.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((duration) => <option key={duration} value={duration}>{duration}h</option>)}
        </SelectField>
        <SelectField label="Status" value={form.status} onChange={(event) => update('status', event.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="cancelled">Cancelled</option>
        </SelectField>
      </div>
      <TextareaField label="Purpose" value={form.purpose} onChange={(event) => update('purpose', event.target.value)} />
      <InputField label="Admin note" value={form.adminNote} onChange={(event) => update('adminNote', event.target.value)} />
      <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto sm:justify-self-start">
        {mutation.isPending ? 'Saving...' : 'Save admin edits'}
      </Button>
      {mutation.error ? <p className="text-sm text-rose-700">Save failed. Check booking conflicts and required fields.</p> : null}
    </form>
  )
}
