import { PageHeader } from "@/components/layout/page-header"
import HealthDashboard from "@/health-dashboard"

export default function Page() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Vue d'ensemble"
        description="Suivez vos indicateurs santé, vos habitudes actives et vos routines de récupération."
      />
      <HealthDashboard />
    </div>
  )
}
