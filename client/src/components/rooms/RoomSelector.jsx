import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'

export function RoomSelector({ rooms }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_52px_-42px_rgba(0,0,0,0.85)]">
      {rooms.map((room, index) => (
        <Link
          key={room.id}
          to={`/rooms/${room.slug}`}
          className="group grid gap-5 border-b border-white/10 p-5 transition last:border-b-0 hover:bg-emerald-400/[0.08] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-[5rem_1fr] sm:items-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Room {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{room.name}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-500">Hourly weekday bookings from 08:00 to 17:00.</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-400">
              <span className="rounded-full bg-white/[0.06] px-3 py-2">Hourly</span>
              <span className="rounded-full bg-white/[0.06] px-3 py-2">Weekdays</span>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-zinc-950/70 transition group-hover:border-emerald-300/40 group-hover:bg-emerald-400">
              <ArrowRightIcon className="size-5 text-emerald-300 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
