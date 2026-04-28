export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-emerald-400 text-zinc-950 hover:bg-emerald-300 border-emerald-300 shadow-[0_18px_34px_-24px_rgba(52,211,153,0.75)]',
    secondary: 'bg-white/[0.06] text-zinc-100 hover:bg-white/[0.1] border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    danger: 'bg-rose-500 text-white hover:bg-rose-400 border-rose-400 shadow-[0_18px_34px_-24px_rgba(244,63,94,0.7)]',
    ghost: 'bg-transparent text-zinc-300 hover:bg-white/[0.08] border-transparent',
  }

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300/25 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
