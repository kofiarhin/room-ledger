import { useState } from 'react'
import { DEPARTMENTS } from '../../constants/booking.js'
import { Button } from '../common/Button.jsx'
import { InputField, SelectField, TextareaField } from '../common/FormFields.jsx'
import { ErrorMessage } from '../common/States.jsx'
import { SlotPicker } from '../availability/SlotPicker.jsx'
import { apiErrorMessage } from '../../lib/api.js'

const initialForm = {
  requesterName: '',
  requesterEmail: '',
  requesterPhone: '',
  department: '',
  purpose: '',
  startTime: '',
  durationHours: '',
}

export function BookingForm({ room, date, slots, mutation, onSuccess, initialValues = {}, submitLabel = 'Request booking' }) {
  const [form, setForm] = useState({ ...initialForm, ...initialValues })
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.requesterName.trim()) nextErrors.requesterName = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.requesterEmail)) {
      nextErrors.requesterEmail = 'Valid email is required.'
    }
    if (!DEPARTMENTS.includes(form.department)) nextErrors.department = 'Select a department.'
    if (!form.purpose.trim()) nextErrors.purpose = 'Purpose is required.'
    if (!form.startTime) nextErrors.startTime = 'Select an hourly start time.'
    if (!Number(form.durationHours)) nextErrors.durationHours = 'Select a duration.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    mutation.mutate(
      {
        room: room.id,
        date,
        ...form,
        durationHours: Number(form.durationHours),
      },
      { onSuccess },
    )
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <ErrorMessage message={mutation.error ? apiErrorMessage(mutation.error) : ''} />
      <section className="grid gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Step 2</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">Choose a slot</h3>
        </div>
        <SlotPicker
          slots={slots}
          startTime={form.startTime}
          durationHours={form.durationHours}
          onStartChange={(value) => {
            updateField('startTime', value)
            updateField('durationHours', '')
          }}
          onDurationChange={(value) => updateField('durationHours', value)}
        />
        {errors.startTime ? <p className="text-xs text-rose-700">{errors.startTime}</p> : null}
        {errors.durationHours ? <p className="text-xs text-rose-700">{errors.durationHours}</p> : null}
      </section>
      <section className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Step 3</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">Requester details</h3>
        </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Requester name"
          value={form.requesterName}
          error={errors.requesterName}
          onChange={(event) => updateField('requesterName', event.target.value)}
        />
        <InputField
          label="Requester email"
          type="email"
          value={form.requesterEmail}
          error={errors.requesterEmail}
          onChange={(event) => updateField('requesterEmail', event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Phone"
          helper="Optional."
          value={form.requesterPhone}
          onChange={(event) => updateField('requesterPhone', event.target.value)}
        />
        <SelectField
          label="Department"
          value={form.department}
          error={errors.department}
          onChange={(event) => updateField('department', event.target.value)}
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </SelectField>
      </div>
      <TextareaField
        label="Purpose"
        value={form.purpose}
        error={errors.purpose}
        onChange={(event) => updateField('purpose', event.target.value)}
      />
      </section>
      <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto sm:justify-self-start">
        {mutation.isPending ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  )
}
