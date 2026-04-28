import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'

export function RoomSelector({ rooms }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_20px_52px_-42px_rgba(24,24,27,0.6)]">
      {rooms.map((room, index) => (
        <Link
          key={room.id}
          to={`/rooms/${room.slug}`}
          className="group grid gap-5 border-b border-zinc-200 p-5 transition last:border-b-0 hover:bg-emerald-50/45 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-[5rem_1fr] sm:items-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Room {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{room.name}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">Hourly weekday bookings from 08:00 to 17:00.</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
              <span className="rounded-full bg-zinc-100 px-3 py-2">Hourly</span>
              <span className="rounded-full bg-zinc-100 px-3 py-2">Weekdays</span>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white transition group-hover:border-emerald-700/40 group-hover:bg-emerald-800">
              <ArrowRightIcon className="size-5 text-emerald-800 transition group-hover:translate-x-1 group-hover:text-white" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
