import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Bed,
  Users,
  Calendar,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/habitaciones", label: "Habitaciones", icon: Bed },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/reservas", label: "Reservas", icon: Calendar },
]

function Sidebar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 inline-flex items-center p-2 text-sm text-muted-foreground rounded-lg sm:hidden hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        aria-controls="sidebar"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen bg-sidebar border-r transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <Link
            to="/"
            className="flex items-center ps-2.5 mb-5"
            onClick={() => setMobileOpen(false)}
          >
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Hotel Reservas
            </span>
          </Link>

          <ul className="space-y-2 font-medium">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-2 py-2 rounded-lg group transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="ms-3">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
