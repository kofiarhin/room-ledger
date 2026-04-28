import { useState } from 'react'
import { DEPARTMENTS } from '../../constants/booking.js'
import { apiErrorMessage } from '../../lib/api.js'
import { useUpdateBooking } from '../../hooks/mutations/useUpdateBooking.js'
import { Button } from '../common/Button.jsx'
import { InputField, SelectField, TextareaField } from '../common/FormFields.jsx'
import { ErrorMessage } from '../common/States.jsx'

export function EditBookingForm({ booking }) {
  const mutation = useUpdateBooking()
  const [form, setForm] = useState({
    requesterName: booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterPhone: booking.requesterPhone || '',
    department: booking.department,
    purpose: booking.purpose,
    date: booking.date,
    startTime: booking.startTime,
    durationHours: booking.durationHours,
  })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    mutation.mutate({ bookingId: booking.bookingId, payload: form })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <ErrorMessage message={mutation.error ? apiErrorMessage(mutation.error) : ''} />
      {mutation.isSuccess ? <p className="text-sm text-emerald-700">Booking updated.</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Name" value={form.requesterName} onChange={(event) => update('requesterName', event.target.value)} />
        <InputField label="Email" type="email" value={form.requesterEmail} onChange={(event) => update('requesterEmail', event.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Phone" value={form.requesterPhone} onChange={(event) => update('requesterPhone', event.target.value)} />
        <SelectField label="Department" value={form.department} onChange={(event) => update('department', event.target.value)}>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <InputField label="Date" type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
        <InputField label="Start time" type="time" step="3600" value={form.startTime} onChange={(event) => update('startTime', event.target.value)} />
        <SelectField label="Duration" value={form.durationHours} onChange={(event) => update('durationHours', Number(event.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((duration) => (
            <option key={duration} value={duration}>
              {duration} hour{duration > 1 ? 's' : ''}
            </option>
          ))}
        </SelectField>
      </div>
      <TextareaField label="Purpose" value={form.purpose} onChange={(event) => update('purpose', event.target.value)} />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
