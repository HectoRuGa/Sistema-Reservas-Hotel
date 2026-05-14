import { useState, useEffect } from "react"
import { reservasAPI, consumosAPI, clientesAPI, habitacionesAPI } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectOption } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import {
  Plus,
  Search,
  LogIn,
  LogOut,
  Wine,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  CalendarDays,
  Bed,
  Users,
  ClipboardCheck,
  Building2,
  SearchX,
} from "lucide-react"

const estadoBadge = {
  pendiente: <Badge variant="warning">Pendiente</Badge>,
  activa: <Badge variant="success">Activa</Badge>,
  finalizada: <Badge variant="secondary">Finalizada</Badge>,
  cancelada: <Badge variant="destructive">Cancelada</Badge>,
}

function Reservas() {
  const [tab, setTab] = useState("checkin")
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("")
  const [expandedReserva, setExpandedReserva] = useState(null)
  const [expandedConsumos, setExpandedConsumos] = useState(null)
  const [consumos, setConsumos] = useState({})
  const { addToast } = useToast()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reservaToDelete, setReservaToDelete] = useState(null)
  const [clientes, setClientes] = useState([])
  const [habitaciones, setHabitaciones] = useState([])
  const [formData, setFormData] = useState({ cliente_id: "", habitacion_id: "", fecha_entrada: "", fecha_salida: "" })
  const [formErrors, setFormErrors] = useState({})

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmData, setConfirmData] = useState(null)

  const [consumoDialogOpen, setConsumoDialogOpen] = useState(false)
  const [consumoReserva, setConsumoReserva] = useState(null)
  const [consumoData, setConsumoData] = useState({ descripcion: "", monto: "" })
  const [consumoErrors, setConsumoErrors] = useState({})

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [checkoutReserva, setCheckoutReserva] = useState(null)
  const [checkoutConsumos, setCheckoutConsumos] = useState([])

  const [dispFechas, setDispFechas] = useState({ entrada: "", salida: "" })
  const [disponibles, setDisponibles] = useState([])
  const [dispLoading, setDispLoading] = useState(false)
  const [dispSearched, setDispSearched] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [r, c, h] = await Promise.all([
        reservasAPI.getAll(),
        clientesAPI.getAll(),
        habitacionesAPI.getAll(),
      ])
      setReservas(r)
      setClientes(c)
      setHabitaciones(h)
    } catch (error) {
      addToast("Error al cargar datos", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadConsumos = async (reservaId) => {
    try {
      const data = await consumosAPI.list(reservaId)
      setConsumos((prev) => ({ ...prev, [reservaId]: data }))
    } catch {
      addToast("Error al cargar consumos", "error")
    }
  }

  const filteredReservas = reservas.filter((r) => {
    const matchSearch = r.cliente_nombre?.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filterEstado ? r.estado === filterEstado : true
    return matchSearch && matchEstado
  })

  const pendientes = reservas.filter((r) => r.estado === "pendiente")
  const activas = reservas.filter((r) => r.estado === "activa")

  const handleCheckIn = async (id) => {
    try {
      await reservasAPI.checkIn(id)
      addToast("Check-in registrado correctamente", "success")
      loadAll()
    } catch (error) {
      addToast(error.message || "Error al registrar check-in", "error")
    }
  }

  const openCheckout = async (reserva) => {
    setCheckoutReserva(reserva)
    try {
      const data = await consumosAPI.list(reserva.id)
      setCheckoutConsumos(data)
    } catch {
      setCheckoutConsumos([])
    }
    setCheckoutDialogOpen(true)
  }

  const handleCheckOut = async () => {
    try {
      await reservasAPI.checkOut(checkoutReserva.id)
      addToast("Check-out registrado correctamente", "success")
      setCheckoutDialogOpen(false)
      loadAll()
    } catch (error) {
      addToast(error.message || "Error al registrar check-out", "error")
    }
  }

  const openConsumoDialog = (reserva) => {
    setConsumoReserva(reserva)
    setConsumoData({ descripcion: "", monto: "" })
    setConsumoErrors({})
    setConsumoDialogOpen(true)
  }

  const handleAddConsumo = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!consumoData.descripcion.trim()) errors.descripcion = "Requerido"
    if (!consumoData.monto || parseFloat(consumoData.monto) <= 0) errors.monto = "Debe ser mayor a 0"
    setConsumoErrors(errors)
    if (Object.keys(errors).length) return

    try {
      await consumosAPI.create(consumoReserva.id, {
        descripcion: consumoData.descripcion.trim(),
        monto: parseFloat(consumoData.monto),
      })
      addToast("Consumo agregado correctamente", "success")
      setConsumoDialogOpen(false)
      loadAll()
      loadConsumos(consumoReserva.id)
    } catch (error) {
      addToast(error.message || "Error al agregar consumo", "error")
    }
  }

  const openCreateDialog = (preselect = {}) => {
    setFormData({
      cliente_id: "",
      habitacion_id: preselect.habitacion_id?.toString() || "",
      fecha_entrada: preselect.fecha_entrada || "",
      fecha_salida: preselect.fecha_salida || "",
    })
    setFormErrors({})
    setCreateDialogOpen(true)
  }

  const handleBuscarDisponibilidad = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!dispFechas.entrada) errors.entrada = true
    if (!dispFechas.salida) errors.salida = true
    if (Object.keys(errors).length) { addToast("Selecciona ambas fechas", "error"); return }
    if (dispFechas.entrada >= dispFechas.salida) { addToast("La fecha de salida debe ser posterior a la de entrada", "error"); return }

    setDispLoading(true)
    setDispSearched(true)
    try {
      const data = await reservasAPI.buscarDisponibilidad(dispFechas.entrada, dispFechas.salida)
      setDisponibles(data)
    } catch (error) {
      addToast(error.message || "Error al buscar disponibilidad", "error")
      setDisponibles([])
    } finally {
      setDispLoading(false)
    }
  }

  const handleCreateReserva = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.cliente_id) errors.cliente_id = "Selecciona un cliente"
    if (!formData.habitacion_id) errors.habitacion_id = "Selecciona una habitación"
    setFormErrors(errors)
    if (Object.keys(errors).length) return

    const cliente = clientes.find((c) => c.id === parseInt(formData.cliente_id))
    const habitacion = habitaciones.find((h) => h.id === parseInt(formData.habitacion_id))
    if (!cliente || !habitacion) return

    let noches = 0
    if (formData.fecha_entrada && formData.fecha_salida) {
      const d1 = new Date(formData.fecha_entrada)
      const d2 = new Date(formData.fecha_salida)
      noches = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)))
    }

    setConfirmData({
      cliente_nombre: cliente.nombre,
      habitacion_id: habitacion.id,
      habitacion_tipo: `#${habitacion.id} - ${habitacion.tipo}`,
      precio_noche: habitacion.precio || 0,
      fecha_entrada: formData.fecha_entrada,
      fecha_salida: formData.fecha_salida,
      noches,
      total_estimado: noches > 0 ? (habitacion.precio || 0) * noches : 0,
    })
    setCreateDialogOpen(false)
    setConfirmDialogOpen(true)
  }

  const handleConfirmCreateReserva = async () => {
    try {
      const payload = {
        cliente_id: parseInt(formData.cliente_id),
        habitacion_id: parseInt(formData.habitacion_id),
      }
      if (formData.fecha_entrada) payload.fecha_entrada = formData.fecha_entrada
      if (formData.fecha_salida) payload.fecha_salida = formData.fecha_salida
      await reservasAPI.create(payload)
      addToast("Reserva creada correctamente", "success")
      setConfirmDialogOpen(false)
      setConfirmData(null)
      loadAll()
    } catch (error) {
      addToast(error.message || "Error al crear reserva", "error")
      setConfirmDialogOpen(false)
      setConfirmData(null)
    }
  }

  const openDeleteDialog = (reserva) => {
    setReservaToDelete(reserva)
    setDeleteDialogOpen(true)
  }

  const handleDeleteReserva = async () => {
    try {
      await reservasAPI.delete(reservaToDelete.id)
      addToast("Reserva eliminada", "success")
      setDeleteDialogOpen(false)
      loadAll()
    } catch (error) {
      addToast(error.message || "Error al eliminar", "error")
    }
  }

  const totalConsumos = (reservaId) => {
    const cs = consumos[reservaId]
    return cs ? cs.reduce((sum, c) => sum + c.monto, 0) : 0
  }

  const habitacionesDisponibles = habitaciones.filter((h) => h.estado === "disponible")

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reservas & Check-In</h1>
          <p className="text-gray-500 mt-1">Gestión de reservas y recepción del hotel</p>
        </div>
        <div className="flex gap-2">
          {tab === "reservas" && (
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        <button
          onClick={() => setTab("checkin")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "checkin"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          Check-In / Recepción
          {pendientes.length > 0 && (
            <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
              {pendientes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("reservas")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "reservas"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Reservas
        </button>
        <button
          onClick={() => setTab("disponibilidad")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "disponibilidad"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          Disponibilidad
        </button>
      </div>

      {/* ============= TAB: CHECK-IN ============= */}
      {tab === "checkin" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-amber-600" />
                  <CardTitle>Check-ins Pendientes</CardTitle>
                </div>
                <Badge variant="warning">{pendientes.length} pendiente(s)</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendientes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No hay check-ins pendientes</p>
              ) : (
                <div className="space-y-3">
                  {pendientes.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{r.cliente_nombre}</p>
                          <p className="text-sm text-gray-500">
                            <Bed className="inline h-3 w-3 mr-1" />
                            {r.habitacion_tipo}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleCheckIn(r.id)}>
                        <LogIn className="mr-1.5 h-4 w-4" /> Check-In
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogOut className="h-5 w-5 text-green-600" />
                  <CardTitle>Huéspedes Actuales</CardTitle>
                </div>
                <Badge variant="success">{activas.length} activa(s)</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No hay huéspedes actualmente</p>
              ) : (
                <div className="space-y-3">
                  {activas.map((r) => {
                    const isExpanded = expandedConsumos === r.id
                    const total = totalConsumos(r.id)
                    return (
                      <div key={r.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-white">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{r.cliente_nombre}</p>
                              <p className="text-sm text-gray-500">
                                <Bed className="inline h-3 w-3 mr-1" />
                                {r.habitacion_tipo}
                                <span className="mx-2">·</span>
                                <DollarSign className="inline h-3 w-3 mr-0.5" />
                                Consumos: ${total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openConsumoDialog(r)}>
                              <Wine className="mr-1.5 h-4 w-4" /> Consumo
                            </Button>
                            <Button size="sm" onClick={() => openCheckout(r)}>
                              <LogOut className="mr-1.5 h-4 w-4" /> Check-Out
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (isExpanded) {
                                  setExpandedConsumos(null)
                                } else {
                                  setExpandedConsumos(r.id)
                                  loadConsumos(r.id)
                                }
                              }}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-gray-50 border-t">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 mt-3">Consumos</h4>
                            {(!consumos[r.id] || consumos[r.id].length === 0) ? (
                              <p className="text-sm text-gray-400">Sin consumos registrados</p>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Fecha</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {consumos[r.id].map((c) => (
                                    <TableRow key={c.id}>
                                      <TableCell>{c.descripcion}</TableCell>
                                      <TableCell>${c.monto.toFixed(2)}</TableCell>
                                      <TableCell>{new Date(c.fecha).toLocaleString()}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============= TAB: RESERVAS ============= */}
      {tab === "reservas" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="activa">Activa</option>
              <option value="finalizada">Finalizada</option>
              <option value="cancelada">Cancelada</option>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Consumos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron reservas
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservas.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell className="font-medium">{r.cliente_nombre}</TableCell>
                    <TableCell>{r.habitacion_tipo}</TableCell>
                    <TableCell>{estadoBadge[r.estado]}</TableCell>
                    <TableCell>${r.total_consumos?.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {r.estado === "pendiente" && (
                          <Button variant="outline" size="sm" onClick={() => handleCheckIn(r.id)}>
                            <LogIn className="h-4 w-4" />
                          </Button>
                        )}
                        {r.estado === "pendiente" && (
                          <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(r)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {r.estado === "activa" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => openConsumoDialog(r)}>
                              <Wine className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => openCheckout(r)}>
                              <LogOut className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}

      {/* ============= TAB: DISPONIBILIDAD ============= */}
      {tab === "disponibilidad" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <CardTitle>Buscar Habitaciones Disponibles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscarDisponibilidad} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <Label htmlFor="fecha_entrada">Fecha de Entrada</Label>
                  <Input
                    id="fecha_entrada"
                    type="date"
                    value={dispFechas.entrada}
                    onChange={(e) => setDispFechas({ ...dispFechas, entrada: e.target.value })}
                  />
                </div>
                <div className="flex-1 w-full">
                  <Label htmlFor="fecha_salida">Fecha de Salida</Label>
                  <Input
                    id="fecha_salida"
                    type="date"
                    value={dispFechas.salida}
                    onChange={(e) => setDispFechas({ ...dispFechas, salida: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={dispLoading} className="w-full sm:w-auto">
                  {dispLoading ? "Buscando..." : "Buscar Disponibilidad"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {dispSearched && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Resultados</CardTitle>
                  <Badge variant="outline">{disponibles.length} disponible(s)</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {disponibles.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <SearchX className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No hay habitaciones disponibles en esas fechas</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Precio por noche</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disponibles.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="font-medium">{h.id}</TableCell>
                          <TableCell>{h.tipo}</TableCell>
                          <TableCell>${(h.precio || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => {
                                openCreateDialog({
                                  habitacion_id: h.id,
                                  fecha_entrada: dispFechas.entrada,
                                  fecha_salida: dispFechas.salida,
                                })
                              }}
                            >
                              <Building2 className="mr-1.5 h-4 w-4" /> Reservar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ============= CREATE RESERVA DIALOG ============= */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateReserva}>
            <DialogHeader>
              <DialogTitle>Nueva Reserva</DialogTitle>
              <DialogDescription>
                Selecciona el cliente, la habitación y las fechas para la reserva
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  id="cliente"
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  className={formErrors.cliente_id ? "border-red-500" : ""}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <SelectOption key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectOption>
                  ))}
                </Select>
                {formErrors.cliente_id && (
                  <p className="text-sm text-red-500">{formErrors.cliente_id}</p>
                )}
              </Field>
              <Field>
                <Label htmlFor="habitacion">Habitación</Label>
                <Select
                  id="habitacion"
                  value={formData.habitacion_id}
                  onChange={(e) => setFormData({ ...formData, habitacion_id: e.target.value })}
                  className={formErrors.habitacion_id ? "border-red-500" : ""}
                >
                  <option value="">Seleccionar habitación...</option>
                  {habitacionesDisponibles.map((h) => (
                    <SelectOption key={h.id} value={h.id}>
                      #{h.id} - {h.tipo} (${(h.precio || 0).toFixed(2)})
                    </SelectOption>
                  ))}
                </Select>
                {formErrors.habitacion_id && (
                  <p className="text-sm text-red-500">{formErrors.habitacion_id}</p>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="fecha_entrada">Fecha de Entrada</Label>
                  <Input
                    id="fecha_entrada"
                    type="date"
                    value={formData.fecha_entrada}
                    onChange={(e) => setFormData({ ...formData, fecha_entrada: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label htmlFor="fecha_salida">Fecha de Salida</Label>
                  <Input
                    id="fecha_salida"
                    type="date"
                    value={formData.fecha_salida}
                    onChange={(e) => setFormData({ ...formData, fecha_salida: e.target.value })}
                  />
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Revisar Reserva</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============= CONFIRM RESERVA DIALOG ============= */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              Revisa los datos antes de confirmar la reserva
            </DialogDescription>
          </DialogHeader>
          {confirmData && (
            <div className="px-6 pb-6 space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Cliente</span>
                <span className="font-medium">{confirmData.cliente_nombre}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Habitación</span>
                <span className="font-medium">{confirmData.habitacion_tipo}</span>
              </div>
              {confirmData.fecha_entrada && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Entrada</span>
                  <span className="font-medium">{confirmData.fecha_entrada}</span>
                </div>
              )}
              {confirmData.fecha_salida && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Salida</span>
                  <span className="font-medium">{confirmData.fecha_salida}</span>
                </div>
              )}
              {confirmData.noches > 0 && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Noches</span>
                    <span className="font-medium">{confirmData.noches}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Precio por noche</span>
                    <span className="font-medium">${confirmData.precio_noche.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total estimado</span>
                    <span>${confirmData.total_estimado.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleConfirmCreateReserva}>Confirmar Reserva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============= DELETE RESERVA DIALOG ============= */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar la reserva de <strong>{reservaToDelete?.cliente_nombre}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteReserva}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============= ADD CONSUMO DIALOG ============= */}
      <Dialog open={consumoDialogOpen} onOpenChange={setConsumoDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddConsumo}>
            <DialogHeader>
              <DialogTitle>Agregar Consumo</DialogTitle>
              <DialogDescription>
                {consumoReserva?.cliente_nombre} — {consumoReserva?.habitacion_tipo}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={consumoData.descripcion}
                  onChange={(e) => setConsumoData({ ...consumoData, descripcion: e.target.value })}
                  placeholder="Ej: Minibar, Cena, Lavandería..."
                  className={consumoErrors.descripcion ? "border-red-500" : ""}
                />
                {consumoErrors.descripcion && (
                  <p className="text-sm text-red-500">{consumoErrors.descripcion}</p>
                )}
              </Field>
              <Field>
                <Label htmlFor="monto">Monto ($)</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={consumoData.monto}
                  onChange={(e) => setConsumoData({ ...consumoData, monto: e.target.value })}
                  placeholder="0.00"
                  className={consumoErrors.monto ? "border-red-500" : ""}
                />
                {consumoErrors.monto && (
                  <p className="text-sm text-red-500">{consumoErrors.monto}</p>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Agregar Consumo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============= CHECK-OUT DIALOG ============= */}
      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Check-Out</DialogTitle>
            <DialogDescription>
              {checkoutReserva?.cliente_nombre} — {checkoutReserva?.habitacion_tipo}
            </DialogDescription>
          </DialogHeader>
          {checkoutConsumos.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Consumos registrados</h3>
              <div className="space-y-2">
                {checkoutConsumos.map((c) => (
                  <div key={c.id} className="flex justify-between text-sm">
                    <span>{c.descripcion}</span>
                    <span className="font-medium">${c.monto.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                <span>Total consumos</span>
                <span>${checkoutConsumos.reduce((s, c) => s + c.monto, 0).toFixed(2)}</span>
              </div>
            </div>
          )}
          {checkoutConsumos.length === 0 && (
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-400">Sin consumos registrados</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCheckOut}>
              <LogOut className="mr-1.5 h-4 w-4" /> Confirmar Check-Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Reservas
