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
    throw new Error(`Error: ${response.status} ${response.statusText}`)
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
