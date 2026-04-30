import { Link } from "react-router-dom"
import { Bed, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a Hotel Reservas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link to="/habitaciones">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Bed className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Habitaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gestiona el catálogo de habitaciones del hotel</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/clientes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Registra y administra la información de los clientes</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/reservas">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gestiona las reservas del hotel</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default Home
