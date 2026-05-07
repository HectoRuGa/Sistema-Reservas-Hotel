import { useState, useEffect } from "react"
import { habitacionesAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectOption } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingHabitacion, setEditingHabitacion] = useState(null)
  const [habitacionToDelete, setHabitacionToDelete] = useState(null)
  const [searchTipo, setSearchTipo] = useState("")
  const [filterEstado, setFilterEstado] = useState("")
  const [formData, setFormData] = useState({ tipo: "", estado: "disponible", precio: "" })
  const [errors, setErrors] = useState({})
  const { addToast } = useToast()

  useEffect(() => {
    loadHabitaciones()
  }, [])

  const loadHabitaciones = async () => {
    try {
      const data = await habitacionesAPI.getAll()
      setHabitaciones(data)
    } catch (error) {
      addToast("Error al cargar habitaciones", "error")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const variants = {
      disponible: "success",
      ocupada: "danger",
      mantenimiento: "warning",
    }
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>
  }

  const filteredHabitaciones = habitaciones.filter((h) => {
    const matchTipo = h.tipo.toLowerCase().includes(searchTipo.toLowerCase())
    const matchEstado = filterEstado ? h.estado === filterEstado : true
    return matchTipo && matchEstado
  })

  const openCreateDialog = () => {
    setEditingHabitacion(null)
    setFormData({ tipo: "", estado: "disponible", precio: "" })
    setErrors({})
    setDialogOpen(true)
  }

  const openEditDialog = (habitacion) => {
    setEditingHabitacion(habitacion)
    setFormData({
      tipo: habitacion.tipo,
      estado: habitacion.estado,
      precio: habitacion.precio.toString(),
    })
    setErrors({})
    setDialogOpen(true)
  }

  const openDeleteDialog = (habitacion) => {
    setHabitacionToDelete(habitacion)
    setDeleteDialogOpen(true)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.tipo.trim()) newErrors.tipo = "El tipo es requerido"
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = {
      tipo: formData.tipo.trim(),
      estado: formData.estado,
      precio: parseFloat(formData.precio),
    }

    try {
      if (editingHabitacion) {
        await habitacionesAPI.update(editingHabitacion.id, data)
        addToast("Habitación actualizada correctamente", "success")
      } else {
        await habitacionesAPI.create(data)
        addToast("Habitación creada correctamente", "success")
      }
      setDialogOpen(false)
      loadHabitaciones()
    } catch (error) {
      addToast("Error al guardar la habitación", "error")
    }
  }

  const handleDelete = async () => {
    try {
      await habitacionesAPI.delete(habitacionToDelete.id)
      addToast("Habitación eliminada correctamente", "success")
      setDeleteDialogOpen(false)
      loadHabitaciones()
    } catch (error) {
      addToast("Error al eliminar la habitación", "error")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Cargando habitaciones...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Catálogo de Habitaciones</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Habitación
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por tipo..."
            value={searchTipo}
            onChange={(e) => setSearchTipo(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">Mantenimiento</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHabitaciones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No se encontraron habitaciones
              </TableCell>
            </TableRow>
          ) : (
            filteredHabitaciones.map((habitacion) => (
              <TableRow key={habitacion.id}>
                <TableCell>{habitacion.id}</TableCell>
                <TableCell className="font-medium">{habitacion.tipo}</TableCell>
                <TableCell>{getEstadoBadge(habitacion.estado)}</TableCell>
                <TableCell>${habitacion.precio.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(habitacion)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(habitacion)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="bg-background rounded-lg border shadow-lg w-full max-w-lg mx-4">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingHabitacion ? "Editar Habitación" : "Nueva Habitación"}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Habitación</Label>
                  <Input
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    placeholder="Ej: Simple, Doble, Suite"
                    className={errors.tipo ? "border-red-500" : ""}
                  />
                  {errors.tipo && <p className="text-sm text-red-500 mt-1">{errors.tipo}</p>}
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="0.00"
                    className={errors.precio ? "border-red-500" : ""}
                  />
                  {errors.precio && <p className="text-sm text-red-500 mt-1">{errors.precio}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingHabitacion ? "Actualizar" : "Crear"}</Button>
            </div>
          </form>
        </div>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="bg-background rounded-lg border shadow-lg w-full max-w-md mx-4">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Confirmar Eliminación</h2>
            <p className="text-muted-foreground">
              ¿Estás seguro de que deseas eliminar la habitación{" "}
              <strong>{habitacionToDelete?.tipo}</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-2 p-6 pt-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default Habitaciones
