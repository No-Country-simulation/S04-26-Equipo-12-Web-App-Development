import { DashboardLayout } from "@/components/templates"
import { StatsGroup } from "@/features/dashboard"


export const DashboardPage = () => {
  
  const pageTitle = "Dashboard de Supervisión"

  return (
    <DashboardLayout pageTitle={pageTitle} userName="John Doe" userRole="Admin">
      <div className="flex flex-col gap-6">
        <StatsGroup />
      </div>
    </DashboardLayout>
  )
}