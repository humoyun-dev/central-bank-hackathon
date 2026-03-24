import "server-only"

import { budgetDtoListSchema } from "@/features/budgets/schemas/budget.dto"
import { mapBudgetDtoToBudget } from "@/features/budgets/mappers/map-budget-dto-to-budget"
import { getMockBudgetsByHousehold } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getBudgetsInternal(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? budgetDtoListSchema.parse(getMockBudgetsByHousehold(householdId))
    : await serverApiRequest({
        path: apiEndpoints.households.budgets(householdId),
        schema: budgetDtoListSchema,
        householdId,
      })

  return parsedDtos.map(mapBudgetDtoToBudget)
}

export async function getBudgets(householdId: string) {
  return getBudgetsInternal(householdId)
}
