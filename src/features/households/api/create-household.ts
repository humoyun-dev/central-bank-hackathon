"use client"

import { householdDtoSchema } from "@/features/households/schemas/household.dto"
import { mapHouseholdDtoToContext } from "@/features/households/mappers/map-household-dto-to-context"
import { browserApiRequest } from "@/services/api/browser/client"
import type { CreateHouseholdRequest } from "@/features/households/schemas/create-household"

export function createHousehold(body: CreateHouseholdRequest) {
  return browserApiRequest({
    path: "/api/households",
    method: "POST",
    body,
    schema: householdDtoSchema,
  }).then(mapHouseholdDtoToContext)
}
