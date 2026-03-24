import type { CreateExpenseRequest } from "@/features/transactions/schemas/create-expense"
import { createExpenseRequestSchema } from "@/features/transactions/schemas/create-expense"
import {
  transactionMutationResultSchema,
  type TransactionMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function createExpense(
  householdId: string,
  body: CreateExpenseRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<TransactionMutationResult, CreateExpenseRequest>({
    path: `/api${apiEndpoints.households.expenses(householdId)}`,
    body,
    bodySchema: createExpenseRequestSchema,
    responseSchema: transactionMutationResultSchema,
    idempotencyScope: "expense",
    idempotencyKey,
  })
}
