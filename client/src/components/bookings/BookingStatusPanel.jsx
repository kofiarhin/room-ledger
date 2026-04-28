import { useState } from 'react'
import { useCancelBooking } from '../../hooks/mutations/useCancelBooking.js'
import { apiErrorMessage } from '../../lib/api.js'
import { Button } from '../common/Button.jsx'
import { ConfirmDialog } from '../common/ConfirmDialog.jsx'
import { ErrorMessage } from '../common/States.jsx'
import { BookingSummary } from './BookingSummary.jsx'
import { EditBookingForm } from './EditBookingForm.jsx'

export function BookingStatusPanel({ booking }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)
  const cancelMutation = useCancelBooking()
  const isReadOnly = booking.status !== 'pending'

  return (
    <div className="grid gap-6 rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_20px_48px_-38px_rgba(24,24,27,0.55)] sm:p-6">
      <BookingSummary booking={booking} />
      <ErrorMessage message={cancelMutation.error ? apiErrorMessage(cancelMutation.error) : ''} />
      {isReadOnly ? (
        <p className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
          This booking is read-only because its status is {booking.status}.
        </p>
      ) : (
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <Button variant="secondary" onClick={() => setIsEditing((value) => !value)}>
            {isEditing ? 'Close editor' : 'Edit pending booking'}
          </Button>
          <Button variant="danger" onClick={() => setIsConfirmingCancel(true)}>
            Cancel pending booking
          </Button>
        </div>
      )}
      {isEditing && !isReadOnly ? <EditBookingForm booking={booking} /> : null}
      {isConfirmingCancel ? (
        <ConfirmDialog
          title="Cancel this booking?"
          message="This changes the request to cancelled and releases the room slot."
          confirmLabel="Cancel booking"
          isLoading={cancelMutation.isPending}
          onCancel={() => setIsConfirmingCancel(false)}
          onConfirm={() => cancelMutation.mutate(booking.bookingId, { onSuccess: () => setIsConfirmingCancel(false) })}
        />
      ) : null}
    </div>
  )
}
