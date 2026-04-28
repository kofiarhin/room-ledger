import { StatusBadge } from '../common/StatusBadge.jsx'

export function BookingSummary({ booking }) {
  if (!booking) return null
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Booking ID</dt>
        <dd className="font-mono font-semibold text-zinc-950">{booking.bookingId}</dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Status</dt>
        <dd className="mt-1">
          <StatusBadge status={booking.status} />
        </dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Room</dt>
        <dd className="font-medium text-zinc-950">{booking.room?.name}</dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Date and time</dt>
        <dd className="font-medium text-zinc-950">
          {booking.date}, {booking.startTime}-{booking.endTime}
        </dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Requester</dt>
        <dd className="font-medium text-zinc-950">{booking.requesterName}</dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4">
        <dt className="text-zinc-500">Department</dt>
        <dd className="font-medium text-zinc-950">{booking.department}</dd>
      </div>
      <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
        <dt className="text-zinc-500">Purpose</dt>
        <dd className="font-medium text-zinc-950">{booking.purpose}</dd>
      </div>
      {booking.adminNote ? (
        <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
          <dt className="text-zinc-500">Admin note</dt>
          <dd className="font-medium text-zinc-950">{booking.adminNote}</dd>
        </div>
      ) : null}
    </dl>
  )
}
