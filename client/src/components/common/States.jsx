export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl border border-white/8 bg-white/[0.07] ${className}`} />
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
      {message}
    </div>
  )
}

export function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/14 bg-white/[0.04] px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
    </div>
  )
}
