const statusStyles = {
  pending: 'border-amber-300/30 bg-amber-400/10 text-amber-200',
  approved: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
  denied: 'border-rose-300/30 bg-rose-400/10 text-rose-200',
  cancelled: 'border-zinc-500/40 bg-zinc-700/35 text-zinc-300',
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.cancelled}`}
    >
      {status}
    </span>
  )
}
