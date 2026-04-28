import { useState } from 'react'
import {
  useApproveAdminBooking,
  useDeleteAdminBooking,
  useDenyAdminBooking,
} from '../../hooks/mutations/useAdminBookingActions.js'
import { Button } from '../common/Button.jsx'
import { InputField } from '../common/FormFields.jsx'

export function AdminBookingActions({ booking }) {
  const [note, setNote] = useState('')
  const approve = useApproveAdminBooking()
  const deny = useDenyAdminBooking()
  const remove = useDeleteAdminBooking()

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => approve.mutate(booking.id)} disabled={approve.isPending}>
          Approve
        </Button>
        <Button variant="danger" onClick={() => deny.mutate({ id: booking.id, adminNote: note })} disabled={deny.isPending}>
          Deny
        </Button>
        <Button variant="secondary" onClick={() => remove.mutate(booking.id)} disabled={remove.isPending}>
          Delete
        </Button>
      </div>
      <InputField label="Admin note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional denial note" />
      {approve.error || deny.error || remove.error ? (
        <p className="text-sm text-rose-700">Action failed. Check for conflicts or expired login.</p>
      ) : null}
    </div>
  )
}
