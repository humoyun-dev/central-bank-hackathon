"use client"

import { householdInviteDtoSchema } from "@/features/households/schemas/invite.dto"
import { mapHouseholdInviteDtoToInvite } from "@/features/households/mappers/map-household-invite-dto-to-invite"
import { browserApiRequest } from "@/services/api/browser/client"
import type { CreateHouseholdInviteRequest } from "@/features/households/schemas/create-household-invite"

export function createHouseholdInvite(
  householdId: string,
  body: CreateHouseholdInviteRequest,
) {
  return browserApiRequest({
    path: `/api/households/${householdId}/invites`,
    method: "POST",
    body,
    schema: householdInviteDtoSchema,
  }).then(mapHouseholdInviteDtoToInvite)
}
