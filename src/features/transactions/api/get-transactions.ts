import "server-only"
import { transactionDtoListSchema } from "@/features/transactions/schemas/transaction.dto"
import { mapTransactionDtoToTransaction } from "@/features/transactions/mappers/map-transaction-dto-to-transaction"
import { getMockTransactionsByHousehold } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getTransactionsInternal(householdId: string) {
  const parsedDtos = publicEnv.enableMockApi
    ? transactionDtoListSchema.parse(getMockTransactionsByHousehold(householdId))
    : await serverApiRequest({
        path: apiEndpoints.households.transactions(householdId),
        schema: transactionDtoListSchema,
        householdId,
      })

  return parsedDtos.map(mapTransactionDtoToTransaction)
}

export async function getTransactions(householdId: string) {
  return getTransactionsInternal(householdId)
}
