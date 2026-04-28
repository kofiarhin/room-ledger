import { Link, NavLink, Outlet } from 'react-router-dom'

function navClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
  }`
}

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="text-xl font-semibold tracking-tight">RoomLedger</span>
            <span className="hidden text-sm text-zinc-500 sm:inline">Smart scheduling. Zero conflicts.</span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            <NavLink className={navClass} to="/">
              Rooms
            </NavLink>
            <NavLink className={navClass} to="/status">
              Status
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
