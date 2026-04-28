function FieldWrap({ label, error, helper, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-800">
      <span>{label}</span>
      {children}
      {helper ? <span className="text-xs font-normal text-zinc-500">{helper}</span> : null}
      {error ? <span className="text-xs font-normal text-rose-700">{error}</span> : null}
    </label>
  )
}

const inputClass =
  'w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500'

export function InputField({ label, error, helper, icon, ...props }) {
  return (
    <FieldWrap label={label} error={error} helper={helper}>
      {icon ? (
        <span className="relative block">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>
          <input className={`${inputClass} pl-10`} {...props} />
        </span>
      ) : (
        <input className={inputClass} {...props} />
      )}
    </FieldWrap>
  )
}

export function SelectField({ label, error, helper, children, ...props }) {
  return (
    <FieldWrap label={label} error={error} helper={helper}>
      <select className={inputClass} {...props}>
        {children}
      </select>
    </FieldWrap>
  )
}

export function TextareaField({ label, error, helper, ...props }) {
  return (
    <FieldWrap label={label} error={error} helper={helper}>
      <textarea className={`${inputClass} min-h-32 resize-y`} {...props} />
    </FieldWrap>
  )
}
