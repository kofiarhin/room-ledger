import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'

export function RoomSelector({ rooms }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rooms.map((room) => (
        <Link
          key={room.id}
          to={`/rooms/${room.slug}`}
          className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-700/40 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{room.name}</h2>
              <p className="mt-2 text-sm text-zinc-600">Weekday bookings from 08:00 to 17:00.</p>
            </div>
            <ArrowRightIcon className="mt-1 size-5 text-emerald-700 transition group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  )
}
