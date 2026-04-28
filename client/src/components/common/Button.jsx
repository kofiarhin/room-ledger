export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-700',
    secondary: 'bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-200',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 border-rose-700',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
