import Navbar from "@/components/Navbar"

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
