import { notFound } from "next/navigation"
import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { getHouseholdInvites } from "@/features/households/api/get-household-invites"
import { HouseholdSettingsScreen } from "@/features/households/components/household-settings-screen"

export default async function HouseholdSettingsPage({
  params,
}: {
  params: Promise<{ householdId: string }>
}) {
  const { householdId } = await params
  const [household, invites] = await Promise.all([
    getHouseholdContext(householdId),
    getHouseholdInvites(householdId),
  ])

  if (!household) {
    notFound()
  }

  return <HouseholdSettingsScreen household={household} invites={invites} />
}
