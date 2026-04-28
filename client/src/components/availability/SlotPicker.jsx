import { SelectField } from '../common/FormFields.jsx'

export function SlotPicker({ slots = [], startTime, durationHours, onStartChange, onDurationChange }) {
  const selectedSlot = slots.find((slot) => slot.startTime === startTime)
  const durations = selectedSlot?.durations || []

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label="Start time"
        value={startTime}
        onChange={(event) => onStartChange(event.target.value)}
      >
        <option value="">Select a time</option>
        {slots.map((slot) => (
          <option key={slot.startTime} value={slot.startTime} disabled={slot.durations.length === 0}>
            {slot.startTime}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="Duration"
        value={durationHours}
        onChange={(event) => onDurationChange(Number(event.target.value))}
        disabled={!startTime}
      >
        <option value="">Select duration</option>
        {durations.map((duration) => (
          <option key={duration} value={duration}>
            {duration} hour{duration > 1 ? 's' : ''}
          </option>
        ))}
      </SelectField>
    </div>
  )
}
