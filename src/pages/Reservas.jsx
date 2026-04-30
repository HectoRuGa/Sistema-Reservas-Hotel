import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

function Reservas() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Reservas</h1>
      <Card>
        <CardHeader>
          <Calendar className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Gestión de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Módulo de reservas en desarrollo. Aquí podrás crear, editar y gestionar las reservas del hotel.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reservas
