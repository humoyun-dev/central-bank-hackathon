import { requireSession } from "@/features/auth/api/get-session"
import { getPendingInvites } from "@/features/households/api/get-household-invites"
import { listHouseholds } from "@/features/households/api/get-household-context"
import { HouseholdSelectionScreen } from "@/features/households/components/household-selection-screen"

export default async function SelectHouseholdPage() {
  const [session, households, pendingInvites] = await Promise.all([
    requireSession(),
    listHouseholds(),
    getPendingInvites(),
  ])

  return (
    <HouseholdSelectionScreen
      households={households}
      pendingInvites={pendingInvites}
      session={session}
    />
  )
}
