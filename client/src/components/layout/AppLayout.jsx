import { Link, NavLink, Outlet } from 'react-router-dom'

function navClass({ isActive }) {
  return `flex min-h-10 flex-1 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none ${
    isActive ? 'bg-emerald-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:bg-white/8 hover:text-zinc-100'
  }`
}

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-700/20">
            <span className="grid size-9 place-items-center rounded-full bg-emerald-400 text-sm font-semibold text-zinc-950 shadow-sm">
              RL
            </span>
            <span className="grid">
              <span className="text-lg font-semibold tracking-tight">RoomLedger</span>
              <span className="text-xs font-medium text-zinc-500">Smart scheduling. Zero conflicts.</span>
            </span>
          </Link>
          <nav className="grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex sm:flex-wrap sm:gap-1">
            <NavLink className={navClass} to="/">
              Rooms
            </NavLink>
            <NavLink className={navClass} to="/status">
              Status
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
