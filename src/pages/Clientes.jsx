import { useState, useEffect } from "react"
import { clientesAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [clienteToDelete, setClienteToDelete] = useState(null)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({ nombre: "", correo: "", telefono: "" })
  const [errors, setErrors] = useState({})
  const { addToast } = useToast()

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const data = await clientesAPI.getAll()
      setClientes(data)
    } catch (error) {
      addToast("Error al cargar clientes", "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.correo.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingCliente(null)
    setFormData({ nombre: "", correo: "", telefono: "" })
    setErrors({})
    setDialogOpen(true)
  }

  const openEditDialog = (cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const openDeleteDialog = (cliente) => {
    setClienteToDelete(cliente)
    setDeleteDialogOpen(true)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.correo?.trim()) {
      newErrors.correo = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido"
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\d+$/.test(formData.telefono.replace(/[\s-]/g, ""))) {
      newErrors.telefono = "El teléfono debe contener solo números"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = {
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      telefono: formData.telefono.trim(),
    }

    try {
      if (editingCliente) {
        await clientesAPI.update(editingCliente.id, data)
        addToast("Cliente actualizado correctamente", "success")
      } else {
        await clientesAPI.create(data)
        addToast("Cliente creado correctamente", "success")
      }
      setDialogOpen(false)
      loadClientes()
    } catch (error) {
      addToast("Error al guardar el cliente", "error")
    }
  }

  const handleDelete = async () => {
    try {
      await clientesAPI.delete(clienteToDelete.id)
      addToast("Cliente eliminado correctamente", "success")
      setDeleteDialogOpen(false)
      loadClientes()
    } catch (error) {
      addToast("Error al eliminar el cliente", "error")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Cargando clientes...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Registro de Clientes</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No se encontraron clientes
              </TableCell>
            </TableRow>
          ) : (
            filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell className="font-medium">{cliente.nombre}</TableCell>
                <TableCell>{cliente.correo}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(cliente)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(cliente)}>
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
                {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre completo"
                    className={errors.nombre ? "border-red-500" : ""}
                  />
                  {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <Label htmlFor="correo">Correo</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className={errors.correo ? "border-red-500" : ""}
                  />
                  {errors.correo && <p className="text-sm text-red-500 mt-1">{errors.correo}</p>}
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="1234567890"
                    className={errors.telefono ? "border-red-500" : ""}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingCliente ? "Actualizar" : "Crear"}</Button>
            </div>
          </form>
        </div>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="bg-background rounded-lg border shadow-lg w-full max-w-md mx-4">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Confirmar Eliminación</h2>
            <p className="text-muted-foreground">
              ¿Estás seguro de que deseas eliminar al cliente{" "}
              <strong>{clienteToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
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

export default Clientes
