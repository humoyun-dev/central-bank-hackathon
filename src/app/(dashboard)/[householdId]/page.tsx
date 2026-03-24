import { notFound } from "next/navigation"
import { getDashboardOverview } from "@/features/dashboard/api/get-dashboard-overview"
import { DashboardOverviewScreen } from "@/features/dashboard/components/dashboard-overview-screen"

export default async function HouseholdOverviewPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const overview = await getDashboardOverview(householdId)

  if (!overview) {
    notFound()
  }

  return <DashboardOverviewScreen overview={overview} />
}
