import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/shared/dashboard-shell"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function HouseholdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const household = await getHouseholdContext(householdId)

  if (!household) {
    notFound()
  }

  return <DashboardShell household={household}>{children}</DashboardShell>
}
