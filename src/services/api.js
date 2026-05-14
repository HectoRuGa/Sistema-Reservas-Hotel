const API_BASE = "http://localhost:8000"

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  if (!response.ok) {
    const error = await response.text().catch(() => "")
    throw new Error(`Error: ${response.status} ${response.statusText} ${error}`)
  }
  return response.json()
}

export const habitacionesAPI = {
  getAll: () => fetchAPI("/habitaciones/"),
  create: (data) =>
    fetchAPI("/habitaciones/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/habitaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/habitaciones/${id}`, {
      method: "DELETE",
    }),
}

export const clientesAPI = {
  getAll: () => fetchAPI("/clientes/"),
  create: (data) =>
    fetchAPI("/clientes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/clientes/${id}`, {
      method: "DELETE",
    }),
}

export const reservasAPI = {
  getAll: () => fetchAPI("/reservas/"),
  get: (id) => fetchAPI(`/reservas/${id}`),
  create: (data) =>
    fetchAPI("/reservas/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchAPI(`/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchAPI(`/reservas/${id}`, {
      method: "DELETE",
    }),
  checkIn: (id) =>
    fetchAPI(`/reservas/${id}/check-in`, {
      method: "POST",
    }),
  checkOut: (id) =>
    fetchAPI(`/reservas/${id}/check-out`, {
      method: "POST",
    }),
  buscarDisponibilidad: (fecha_entrada, fecha_salida) =>
    fetchAPI(`/reservas/disponibilidad?fecha_entrada=${fecha_entrada}&fecha_salida=${fecha_salida}`),
}

export const consumosAPI = {
  list: (reservaId) => fetchAPI(`/reservas/${reservaId}/consumos`),
  create: (reservaId, data) =>
    fetchAPI(`/reservas/${reservaId}/consumos`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (reservaId, consumoId) =>
    fetchAPI(`/reservas/${reservaId}/consumos/${consumoId}`, {
      method: "DELETE",
    }),
}
