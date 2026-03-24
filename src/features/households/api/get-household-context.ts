import "server-only"
import { getSession } from "@/features/auth/api/get-session"
import { mapHouseholdDtoToContext } from "@/features/households/mappers/map-household-dto-to-context"
import {
  householdDtoListSchema,
} from "@/features/households/schemas/household.dto"
import { listMockHouseholdDtos } from "@/services/api/mock/store"

export async function listHouseholds() {
  const parsedHouseholds = householdDtoListSchema.parse(listMockHouseholdDtos())
  const session = await getSession()

  if (!session) {
    return []
  }

  const sessionMemberships = new Map(
    session.memberships.map((membership) => [membership.householdId, membership.role]),
  )

  return parsedHouseholds
    .filter((household) => sessionMemberships.has(household.id))
    .map((household) =>
      mapHouseholdDtoToContext({
        ...household,
        role: sessionMemberships.get(household.id) ?? household.role,
      }),
    )
}

async function getHouseholdContextInternal(householdId: string) {
  const households = await listHouseholds()
  return households.find((household) => household.id === householdId) ?? null
}

export async function getHouseholdContext(householdId: string) {
  return getHouseholdContextInternal(householdId)
}
