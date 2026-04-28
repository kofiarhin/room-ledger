const statusStyles = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  denied: 'border-rose-200 bg-rose-50 text-rose-800',
  cancelled: 'border-zinc-200 bg-zinc-100 text-zinc-700',
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.cancelled}`}
    >
      {status}
    </span>
  )
}
