import { Button } from './Button.jsx'

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, isLoading }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-zinc-900/80 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Working...' : confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Keep booking
        </Button>
      </div>
    </div>
  )
}
