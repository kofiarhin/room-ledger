export function SlotPicker({ slots = [], startTime, durationHours, onStartChange, onDurationChange }) {
  const selectedSlot = slots.find((slot) => slot.startTime === startTime)
  const durations = selectedSlot?.durations || []

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-200">Start time</p>
          <p className="mt-1 text-xs text-zinc-500">Unavailable starts are dimmed.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {slots.map((slot) => {
            const disabled = slot.durations.length === 0
            const selected = slot.startTime === startTime

            return (
              <button
                key={slot.startTime}
                type="button"
                className={`min-h-11 rounded-full border px-3 py-2 font-mono text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/20 ${
                  selected
                    ? 'border-emerald-300 bg-emerald-400 text-zinc-950'
                    : 'border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-emerald-300/40 hover:bg-emerald-400/10'
                } ${disabled ? 'cursor-not-allowed border-white/5 bg-zinc-950/30 text-zinc-700 hover:border-white/5 hover:bg-zinc-950/30' : ''}`}
                onClick={() => onStartChange(slot.startTime)}
                disabled={disabled}
                aria-pressed={selected}
              >
                {slot.startTime}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-200">Duration</p>
          <p className="mt-1 text-xs text-zinc-500">
            {startTime ? 'Options reflect the selected start time.' : 'Select a start time first.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {(startTime ? durations : []).map((duration) => {
            const selected = Number(durationHours) === duration

            return (
              <button
                key={duration}
                type="button"
                className={`min-h-11 rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/20 ${
                  selected
                    ? 'border-emerald-300 bg-emerald-400 text-zinc-950'
                    : 'border-white/10 bg-zinc-950/50 text-zinc-300 hover:border-emerald-300/40 hover:bg-emerald-400/10'
                }`}
                onClick={() => onDurationChange(duration)}
                aria-pressed={selected}
              >
                {duration}h
              </button>
            )
          })}
          {!startTime ? (
            <span className="col-span-full rounded-2xl border border-dashed border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500">
              Start time required.
            </span>
          ) : null}
          {startTime && durations.length === 0 ? (
            <span className="col-span-full rounded-2xl border border-dashed border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500">
              No duration is available for this start time.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
