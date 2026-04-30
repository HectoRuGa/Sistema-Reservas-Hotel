import { Link } from "react-router-dom";
import { 
  Bed, 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  CreditCard, 
  ArrowRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Home() {
  // Obtenemos la fecha actual con un formato elegante
  const hoy = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. HERO SECTION (Encabezado Empresarial) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">Panel de Control</h1>
              <p className="text-indigo-200 text-lg capitalize">Hotel Reservas ERP • {hoy}</p>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
              <Activity className="text-emerald-400 mr-2 h-5 w-5 animate-pulse" />
              <span className="font-medium text-emerald-50 tracking-wide text-sm">Sistema en Línea</span>
            </div>
          </div>
        </div>

        {/* 2. KPI DASHBOARD (Métricas rápidas simuladas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ocupación Actual</p>
                  <h3 className="text-3xl font-bold text-slate-800">85%</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Reservas Hoy</p>
                  <h3 className="text-3xl font-bold text-slate-800">12</h3>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Estimados</p>
                  <h3 className="text-3xl font-bold text-slate-800">$4,250</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. MÓDULOS PRINCIPALES (Tus tarjetas originales mejoradas) */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            Módulos de Gestión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/habitaciones" className="group">
              <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="p-4 bg-blue-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                    <Bed className="h-10 w-10 text-blue-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Habitaciones</CardTitle>
                  <p className="text-muted-foreground mb-6 text-sm">Gestiona el catálogo de cuartos, precios y estados de limpieza.</p>
                  <div className="mt-auto flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Ir al módulo <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/clientes" className="group">
              <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="p-4 bg-indigo-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                    <Users className="h-10 w-10 text-indigo-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Clientes</CardTitle>
                  <p className="text-muted-foreground mb-6 text-sm">Administra el CRM, perfiles de huéspedes y su historial.</p>
                  <div className="mt-auto flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Ir al módulo <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/reservas" className="group">
              <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="p-4 bg-emerald-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                    <Calendar className="h-10 w-10 text-emerald-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">Reservas</CardTitle>
                  <p className="text-muted-foreground mb-6 text-sm">Control de check-in, check-out y asignación de habitaciones.</p>
                  <div className="mt-auto flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Ir al módulo <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 4. SECCIÓN DE ACTIVIDAD (Estructura base) */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center text-slate-700">
              <Clock className="mr-2 h-5 w-5 text-slate-400" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-center py-10 text-slate-500 text-sm">
              Aquí conectaremos los últimos movimientos de la base de datos de FastAPI...
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default Home;