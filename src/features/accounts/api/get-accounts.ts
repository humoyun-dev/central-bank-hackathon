import "server-only"
import { accountDtoListSchema } from "@/features/accounts/schemas/account.dto"
import { mapAccountDtoToAccount } from "@/features/accounts/mappers/map-account-dto-to-account"
import { getMockAccountsByHousehold } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getAccountsInternal(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? accountDtoListSchema.parse(getMockAccountsByHousehold(householdId))
    : await serverApiRequest({
        path: apiEndpoints.households.accounts(householdId),
        schema: accountDtoListSchema,
        householdId,
      })

  return parsedDtos.map(mapAccountDtoToAccount)
}

export async function getAccounts(householdId: string) {
  return getAccountsInternal(householdId)
}
