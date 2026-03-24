import "server-only"

import { debtDtoListSchema } from "@/features/debts/schemas/debt.dto"
import { mapDebtDtoToDebt } from "@/features/debts/mappers/map-debt-dto-to-debt"
import { getMockDebtsByHousehold } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getDebtsInternal(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? debtDtoListSchema.parse(getMockDebtsByHousehold(householdId))
    : await serverApiRequest({
        path: apiEndpoints.households.debts(householdId),
        schema: debtDtoListSchema,
        householdId,
      })

  return parsedDtos.map(mapDebtDtoToDebt)
}

export async function getDebts(householdId: string) {
  return getDebtsInternal(householdId)
}
