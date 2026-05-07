import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "@/components/ui/toast"
import Sidebar from "@/components/Sidebar"
import DashboardLayout from "@/components/DashboardLayout"
import Home from "../pages/Home"
import Reservas from "../pages/Reservas"
import Habitaciones from "../pages/Habitaciones"
import Clientes from "../pages/Clientes"

function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Sidebar />
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/reservas" element={<Reservas />} />
          </Routes>
        </DashboardLayout>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
