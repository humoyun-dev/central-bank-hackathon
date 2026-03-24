import "server-only"
import { accountDtoListSchema } from "@/features/accounts/schemas/account.dto"
import { mapAccountDtoToAccount } from "@/features/accounts/mappers/map-account-dto-to-account"
import { mockAccountDtosByHousehold } from "@/services/api/mock/seed-data"
import { serverApiRequest } from "@/services/api/server/client"
import { publicEnv } from "@/services/config/public-env"

export async function getAccounts(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? accountDtoListSchema.parse(mockAccountDtosByHousehold[householdId] ?? [])
    : await serverApiRequest({
        path: `/households/${householdId}/accounts`,
        schema: accountDtoListSchema,
      })

  return parsedDtos.map(mapAccountDtoToAccount)
}
