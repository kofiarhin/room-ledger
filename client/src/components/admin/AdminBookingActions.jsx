import { useState } from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import {
  useApproveAdminBooking,
  useDeleteAdminBooking,
  useDenyAdminBooking,
} from '../../hooks/mutations/useAdminBookingActions.js'
import { Button } from '../common/Button.jsx'
import { InputField } from '../common/FormFields.jsx'

export function AdminBookingActions({ booking }) {
  const [note, setNote] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const approve = useApproveAdminBooking()
  const deny = useDenyAdminBooking()
  const remove = useDeleteAdminBooking()

  const hasError = approve.error || deny.error || remove.error

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="gap-2"
          onClick={() => approve.mutate(booking.id)}
          disabled={approve.isPending}
        >
          <CheckIcon aria-hidden="true" />
          {approve.isPending ? 'Approving…' : 'Approve'}
        </Button>

        <Button
          variant="danger"
          onClick={() => deny.mutate({ id: booking.id, adminNote: note })}
          disabled={deny.isPending}
        >
          {deny.isPending ? 'Denying…' : 'Deny'}
        </Button>

        <div className="ml-auto">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Confirm delete?</span>
              <Button
                variant="danger"
                className="h-9 min-h-0 px-3 text-xs"
                onClick={() => { remove.mutate(booking.id); setConfirmDelete(false) }}
                disabled={remove.isPending}
              >
                Yes, delete
              </Button>
              <Button
                variant="ghost"
                className="h-9 min-h-0 px-3 text-xs"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(true)}
              disabled={remove.isPending}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <InputField
        label="Denial note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason shown to requester…"
      />

      {hasError && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          Action failed. Check for conflicts or an expired login session.
        </p>
      )}
    </div>
  )
}
