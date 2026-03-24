"use client"

import { householdInviteDtoSchema } from "@/features/households/schemas/invite.dto"
import { mapHouseholdInviteDtoToInvite } from "@/features/households/mappers/map-household-invite-dto-to-invite"
import { browserApiRequest } from "@/services/api/browser/client"

export function acceptHouseholdInvite(inviteId: string) {
  return browserApiRequest({
    path: `/api/household-invites/${inviteId}/accept`,
    method: "POST",
    schema: householdInviteDtoSchema,
  }).then(mapHouseholdInviteDtoToInvite)
}
