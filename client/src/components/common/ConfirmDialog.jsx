import { Button } from './Button.jsx'

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, isLoading }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
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
