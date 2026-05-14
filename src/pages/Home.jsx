import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bed, Users, Calendar, UserPlus, CalendarDays, BedDouble, TrendingUp, Shield, LogIn, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { habitacionesAPI, clientesAPI, reservasAPI } from "@/services/api"

function Home() {
  const { isLoggedIn, setIsLoggedIn, showLoginModal, closeLogin, openLogin } = useAuth()
  const [stats, setStats] = useState({ habitaciones: 0, clientes: 0, reservas: 0, disponibles: 0, ocupadas: 0, mantenimiento: 0 })
  const [loading, setLoading] = useState(true)
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
  const [loginErrors, setLoginErrors] = useState({})
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    async function loadStats() {
      try {
        const [habitaciones, clientes, reservas] = await Promise.all([
          habitacionesAPI.getAll(),
          clientesAPI.getAll(),
          reservasAPI.getAll().catch(() => []),
        ])
        setStats({
          habitaciones: habitaciones.length,
          clientes: clientes.length,
          reservas: reservas.length || 0,
          disponibles: habitaciones.filter((h) => h.estado === "disponible").length,
          ocupadas: habitaciones.filter((h) => h.estado === "ocupada").length,
          mantenimiento: habitaciones.filter((h) => h.estado === "mantenimiento").length,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const validateLogin = () => {
    const newErrors = {}
    if (!loginData.email?.trim()) newErrors.email = "Requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) newErrors.email = "Correo no válido"
    if (!loginData.password?.trim()) newErrors.password = "Requerida"
    else if (loginData.password.length < 6) newErrors.password = "Mínimo 6 caracteres"
    setLoginErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    setLoginLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsLoggedIn(true)
    closeLogin()
    setLoginLoading(false)
    setLoginData({ email: "", password: "", remember: false })
    setLoginErrors({})
  }

  const tasaOcupacion = stats.habitaciones > 0 ? Math.round((stats.ocupadas / stats.habitaciones) * 100) : 0

  const statCards = [
    { title: "Total Habitaciones", value: stats.habitaciones, icon: Bed, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Disponibles", value: stats.disponibles, icon: BedDouble, color: "text-green-600", bg: "bg-green-50" },
    { title: "Ocupadas", value: stats.ocupadas, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Clientes", value: stats.clientes, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Reservas", value: stats.reservas, icon: Calendar, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Mantenimiento", value: stats.mantenimiento, icon: Shield, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  if (loading) return <div className="flex justify-center p-8">Cargando...</div>

  return (
    <div className="space-y-8">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={closeLogin}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-white rounded-xl border shadow-2xl w-full max-w-md mx-4 p-6 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Iniciar Sesión</h2>
              <button onClick={() => { closeLogin(); setLoginErrors({}); setLoginData({ email: "", password: "", remember: false }); }} className="p-1 rounded hover:bg-gray-100">
                <span className="sr-only">Cerrar</span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
                <input id="email" type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} placeholder="ejemplo@hotel.com" className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loginErrors.email ? "border-red-500" : "border-gray-300"}`} />
                {loginErrors.email && <p className="text-xs text-red-500 mt-1">{loginErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
                <input id="password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="Ingresa tu contraseña" className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loginErrors.password ? "border-red-500" : "border-gray-300"}`} />
                {loginErrors.password && <p className="text-xs text-red-500 mt-1">{loginErrors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={loginData.remember} onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <label htmlFor="remember" className="text-sm text-gray-700">Recuérdame</label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <button type="submit" disabled={loginLoading} className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {loginLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Not logged in — simple login prompt */}
      {!isLoggedIn && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-4 bg-gray-900 text-white rounded-2xl mb-6">
            <Building2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Reservas</h1>
          <p className="text-gray-500 mb-8">Panel de administración del hotel</p>
          <button onClick={openLogin} className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors">
            <LogIn className="h-5 w-5" />
            Iniciar Sesión
          </button>
        </div>
      )}

      {/* Logged in — Dashboard */}
      {isLoggedIn && (
        <>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Resumen general del hotel</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Módulos de Gestión */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos de Gestión</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/habitaciones">
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <Bed className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Habitaciones</h3>
                      <p className="text-sm text-gray-500">Gestionar habitaciones</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/clientes">
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Clientes</h3>
                      <p className="text-sm text-gray-500">Gestionar huéspedes</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/reservas">
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Reservas</h3>
                      <p className="text-sm text-gray-500">Check-in / Check-out</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Occupancy + Activity */}
          <Card>
            <CardHeader><CardTitle>Tasa de Ocupación</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ocupación actual</span>
                  <span className="font-medium">{tasaOcupacion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gray-900 h-3 rounded-full transition-all" style={{ width: `${tasaOcupacion}%` }} />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{stats.ocupadas} ocupadas</span>
                  <span>{stats.disponibles} disponibles</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-600" /><CardTitle>Actividad Reciente</CardTitle></div></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-2 border-b"><div className="w-2 h-2 bg-green-500 rounded-full" /><div><p className="text-sm font-medium">Nueva habitación añadida</p><p className="text-xs text-gray-500">Actualizado recientemente</p></div></div>
                  <div className="flex items-center gap-3 py-2 border-b"><div className="w-2 h-2 bg-blue-500 rounded-full" /><div><p className="text-sm font-medium">Cliente registrado</p><p className="text-xs text-gray-500">Actualizado recientemente</p></div></div>
                  <div className="flex items-center gap-3 py-2"><div className="w-2 h-2 bg-green-500 rounded-full" /><div><p className="text-sm font-medium">Módulo de reservas activo</p><p className="text-xs text-gray-500">Check-in y consumos disponibles</p></div></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><div className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /><CardTitle>Próximas Reservas</CardTitle></div></CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No hay reservas próximas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Home
