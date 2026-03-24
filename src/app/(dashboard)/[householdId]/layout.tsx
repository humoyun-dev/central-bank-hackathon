import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/shared/dashboard-shell"
import { requireSession } from "@/features/auth/api/get-session"
import { getHouseholdContext } from "@/features/households/api/get-household-context"

export default async function HouseholdLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const session = await requireSession()
  const household = await getHouseholdContext(householdId)

  if (!household) {
    notFound()
  }

  return (
    <DashboardShell household={household} session={session}>
      {children}
    </DashboardShell>
  )
}
