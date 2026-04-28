export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-emerald-800 text-white hover:bg-emerald-900 border-emerald-800 shadow-[0_12px_24px_-16px_rgba(4,120,87,0.75)]',
    secondary: 'bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-200 shadow-sm',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 border-rose-700 shadow-[0_12px_24px_-16px_rgba(190,18,60,0.75)]',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent',
  }

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-700/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
