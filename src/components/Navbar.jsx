import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Home, Bed, Users, Calendar } from "lucide-react"

const navItems = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/habitaciones", label: "Habitaciones", icon: Bed },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/reservas", label: "Reservas", icon: Calendar },
]

function Navbar() {
  const location = useLocation()

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Hotel Reservas
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
