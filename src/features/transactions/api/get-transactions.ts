import "server-only"
import { transactionDtoListSchema } from "@/features/transactions/schemas/transaction.dto"
import { mapTransactionDtoToTransaction } from "@/features/transactions/mappers/map-transaction-dto-to-transaction"
import { mockTransactionDtosByHousehold } from "@/services/api/mock/seed-data"
import { serverApiRequest } from "@/services/api/server/client"
import { publicEnv } from "@/services/config/public-env"

export async function getTransactions(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? transactionDtoListSchema.parse(mockTransactionDtosByHousehold[householdId] ?? [])
    : await serverApiRequest({
        path: `/households/${householdId}/transactions`,
        schema: transactionDtoListSchema,
      })

  return parsedDtos.map(mapTransactionDtoToTransaction)
}
