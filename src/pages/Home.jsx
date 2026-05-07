import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bed, Users, Calendar, TrendingUp, BedDouble, UserPlus, CalendarDays, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { habitacionesAPI, clientesAPI, reservasAPI } from "@/services/api"

function Home() {
  const [stats, setStats] = useState({
    totalHabitaciones: 0,
    disponibles: 0,
    ocupadas: 0,
    mantenimiento: 0,
    totalClientes: 0,
    totalReservas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [habitaciones, clientes, reservas] = await Promise.all([
          habitacionesAPI.getAll(),
          clientesAPI.getAll(),
          reservasAPI.getAll().catch(() => []),
        ])

        const disponibles = habitaciones.filter((h) => h.estado === "disponible").length
        const ocupadas = habitaciones.filter((h) => h.estado === "ocupada").length
        const mantenimiento = habitaciones.filter((h) => h.estado === "mantenimiento").length

        setStats({
          totalHabitaciones: habitaciones.length,
          disponibles,
          ocupadas,
          mantenimiento,
          totalClientes: clientes.length,
          totalReservas: reservas.length || 0,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      title: "Total Habitaciones",
      value: stats.totalHabitaciones,
      icon: Bed,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/habitaciones",
    },
    {
      title: "Disponibles",
      value: stats.disponibles,
      icon: BedDouble,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "/habitaciones",
    },
    {
      title: "Ocupadas",
      value: stats.ocupadas,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/habitaciones",
    },
    {
      title: "Clientes",
      value: stats.totalClientes,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/clientes",
    },
    {
      title: "Reservas",
      value: stats.totalReservas,
      icon: Calendar,
      color: "text-rose-600",
      bg: "bg-rose-50",
      link: "/reservas",
    },
    {
      title: "En Mantenimiento",
      value: stats.mantenimiento,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "/habitaciones",
    },
  ]

  const quickAccess = [
    {
      title: "Habitaciones",
      description: "Gestiona el catálogo de habitaciones del hotel",
      icon: Bed,
      link: "/habitaciones",
      badge: `${stats.disponibles} disponibles`,
      badgeVariant: "success",
    },
    {
      title: "Clientes",
      description: "Registra y administra la información de los clientes",
      icon: Users,
      link: "/clientes",
      badge: `${stats.totalClientes} registrados`,
      badgeVariant: "default",
    },
    {
      title: "Reservas",
      description: "Gestiona las reservas del hotel",
      icon: Calendar,
      link: "/reservas",
      badge: stats.totalReservas > 0 ? `${stats.totalReservas} activas` : "Próximamente",
      badgeVariant: stats.totalReservas > 0 ? "warning" : "outline",
    },
  ]

  if (loading) {
    return <div className="flex justify-center p-8">Cargando dashboard...</div>
  }

  const tasaOcupacion =
    stats.totalHabitaciones > 0
      ? Math.round((stats.ocupadas / stats.totalHabitaciones) * 100)
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general del hotel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasa de Ocupación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ocupación actual</span>
              <span className="font-medium">{tasaOcupacion}%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${tasaOcupacion}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.ocupadas} ocupadas</span>
              <span>{stats.disponibles} disponibles</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickAccess.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} to={item.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <CardTitle>Actividad Reciente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2 border-b">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva habitación añadida</p>
                  <p className="text-xs text-muted-foreground">Actualizado recientemente</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cliente registrado</p>
                  <p className="text-xs text-muted-foreground">Actualizado recientemente</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Módulo de reservas</p>
                  <p className="text-xs text-muted-foreground">En desarrollo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <CardTitle>Próximas Reservas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-sm">
                No hay reservas próximas
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                El módulo de reservas estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home
