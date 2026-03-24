import { notFound } from "next/navigation"
import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { DashboardOverviewScreen } from "@/features/dashboard/components/dashboard-overview-screen"

export default async function HouseholdOverviewPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const household = await getHouseholdContext(householdId)

  if (!household) {
    notFound()
  }

  return <DashboardOverviewScreen household={household} householdId={householdId} />
}
