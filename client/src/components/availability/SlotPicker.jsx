export function SlotPicker({ slots = [], startTime, durationHours, onStartChange, onDurationChange }) {
  const selectedSlot = slots.find((slot) => slot.startTime === startTime)
  const durations = selectedSlot?.durations || []

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-800">Start time</p>
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
                className={`min-h-11 rounded-full border px-3 py-2 font-mono text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-700/20 ${
                  selected
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-700/40 hover:bg-emerald-50'
                } ${disabled ? 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300 hover:border-zinc-100 hover:bg-zinc-50' : ''}`}
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
          <p className="text-sm font-medium text-zinc-800">Duration</p>
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
                className={`min-h-11 rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-700/20 ${
                  selected
                    ? 'border-emerald-800 bg-emerald-800 text-white'
                    : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-700/40 hover:bg-emerald-50'
                }`}
                onClick={() => onDurationChange(duration)}
                aria-pressed={selected}
              >
                {duration}h
              </button>
            )
          })}
          {!startTime ? (
            <span className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
              Start time required.
            </span>
          ) : null}
          {startTime && durations.length === 0 ? (
            <span className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
              No duration is available for this start time.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
