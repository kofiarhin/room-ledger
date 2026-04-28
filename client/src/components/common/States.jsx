export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/80 ${className}`} />
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
      {message}
    </div>
  )
}

export function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-8 text-center shadow-sm">
      <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{message}</p>
    </div>
  )
}
