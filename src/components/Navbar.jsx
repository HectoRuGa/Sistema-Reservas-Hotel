import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, LogOut, User, Settings, Bed, Users, Calendar } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const navLinks = [
  { to: "/", label: "Dashboard", icon: null },
  { to: "/habitaciones", label: "Habitaciones", icon: Bed },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/reservas", label: "Reservas", icon: Calendar },
]

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useAuth()
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setDropdownOpen(false)
  }

  if (!isLoggedIn) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm h-16">
        <div className="flex items-center justify-center h-full px-4">
          <span className="text-xl font-bold text-gray-900">Hotel Reservas</span>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm h-16">
      <div className="flex items-center justify-between h-full px-4">
        <Link to="/" className="text-xl font-bold text-gray-900 shrink-0">Hotel Reservas</Link>

        <div className="hidden md:flex items-center gap-1 mx-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <div className={`relative w-full transition-all ${searchFocused ? "ring-2 ring-blue-500 rounded-md" : ""}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 overflow-hidden border-2 border-gray-200">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">U</div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">Usuario</p>
                <p className="text-xs text-gray-500 truncate">usuario@hotel.com</p>
              </div>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="h-4 w-4" />Perfil</Link>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="h-4 w-4" />Configuración</a>
              <div className="border-t my-1" />
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
