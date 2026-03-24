import type { CreateIncomeRequest } from "@/features/transactions/schemas/create-income"
import { createIncomeRequestSchema } from "@/features/transactions/schemas/create-income"
import {
  transactionMutationResultSchema,
  type TransactionMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function createIncome(
  householdId: string,
  body: CreateIncomeRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<TransactionMutationResult, CreateIncomeRequest>({
    path: `/api${apiEndpoints.households.incomes(householdId)}`,
    body,
    bodySchema: createIncomeRequestSchema,
    responseSchema: transactionMutationResultSchema,
    idempotencyScope: "income",
    idempotencyKey,
  })
}
