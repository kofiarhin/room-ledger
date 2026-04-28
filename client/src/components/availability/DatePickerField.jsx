import { InputField } from '../common/FormFields.jsx'

export function DatePickerField({ value, onChange }) {
  return (
    <InputField
      label="Booking date"
      helper="Weekdays only."
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
