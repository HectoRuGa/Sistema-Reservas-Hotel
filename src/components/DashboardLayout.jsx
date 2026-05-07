function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="p-4 sm:ml-64">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
