import "server-only"

import { getSession } from "@/features/auth/api/get-session"
import { mapHouseholdInviteDtoToInvite } from "@/features/households/mappers/map-household-invite-dto-to-invite"
import {
  householdInviteDtoListSchema,
} from "@/features/households/schemas/invite.dto"
import {
  getMockHouseholdInvitesByHousehold,
  getMockPendingInvitesByEmail,
} from "@/services/api/mock/store"

export async function getHouseholdInvites(householdId: string) {
  const parsedInvites = householdInviteDtoListSchema.parse(
    getMockHouseholdInvitesByHousehold(householdId),
  )

  return parsedInvites.map(mapHouseholdInviteDtoToInvite)
}

export async function getPendingInvites() {
  const session = await getSession()

  if (!session) {
    return []
  }

  const parsedInvites = householdInviteDtoListSchema.parse(
    getMockPendingInvitesByEmail(session.user.email),
  )

  return parsedInvites.map(mapHouseholdInviteDtoToInvite)
}
