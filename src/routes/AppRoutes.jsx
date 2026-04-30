import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "@/components/ui/toast"
import Navbar from "@/components/Navbar"
import Home from "../pages/Home"
import Reservas from "../pages/Reservas"
import Habitaciones from "../pages/Habitaciones"
import Clientes from "../pages/Clientes"

function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/reservas" element={<Reservas />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
