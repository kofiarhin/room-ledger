import { useState } from 'react'
import { DEPARTMENTS } from '../../constants/booking.js'
import { useUpdateAdminBooking } from '../../hooks/mutations/useAdminBookingActions.js'
import { Button } from '../common/Button.jsx'
import { InputField, SelectField, TextareaField } from '../common/FormFields.jsx'

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{children}</p>
  )
}

export function AdminBookingEditor({ booking }) {
  const mutation = useUpdateAdminBooking()
  const [form, setForm] = useState({
    requesterName:  booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterPhone: booking.requesterPhone || '',
    department:     booking.department,
    purpose:        booking.purpose,
    date:           booking.date,
    startTime:      booking.startTime,
    durationHours:  booking.durationHours,
    status:         booking.status,
    adminNote:      booking.adminNote || '',
  })

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => { e.preventDefault(); mutation.mutate({ id: booking.id, payload: form }) }}
    >
      <div>
        <SectionLabel>Requester</SectionLabel>
        <div className="grid gap-3 md:grid-cols-3">
          <InputField
            label="Name"
            value={form.requesterName}
            onChange={(e) => update('requesterName', e.target.value)}
          />
          <InputField
            label="Email"
            value={form.requesterEmail}
            onChange={(e) => update('requesterEmail', e.target.value)}
          />
          <InputField
            label="Phone"
            value={form.requesterPhone}
            onChange={(e) => update('requesterPhone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <SectionLabel>Schedule</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <SelectField
            label="Department"
            value={form.department}
            onChange={(e) => update('department', e.target.value)}
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </SelectField>
          <InputField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
          <InputField
            label="Start time"
            type="time"
            step="3600"
            value={form.startTime}
            onChange={(e) => update('startTime', e.target.value)}
          />
          <SelectField
            label="Duration"
            value={form.durationHours}
            onChange={(e) => update('durationHours', Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <option key={d} value={d}>{d}h</option>
            ))}
          </SelectField>
        </div>
      </div>

      <div>
        <SectionLabel>Details</SectionLabel>
        <div className="grid gap-3">
          <TextareaField
            label="Purpose"
            value={form.purpose}
            onChange={(e) => update('purpose', e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="cancelled">Cancelled</option>
            </SelectField>
            <InputField
              label="Admin note"
              value={form.adminNote}
              onChange={(e) => update('adminNote', e.target.value)}
              placeholder="Internal note…"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
        {mutation.isSuccess && (
          <span className="text-sm font-medium text-emerald-200">Saved successfully.</span>
        )}
      </div>

      {mutation.error && (
        <p className="rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200">
          Save failed. Check booking conflicts and required fields.
        </p>
      )}
    </form>
  )
}
