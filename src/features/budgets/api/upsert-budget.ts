import type { UpsertBudgetRequest } from "@/features/budgets/schemas/upsert-budget"
import { upsertBudgetRequestSchema } from "@/features/budgets/schemas/upsert-budget"
import {
  budgetMutationResultSchema,
  type BudgetMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function upsertBudget(
  householdId: string,
  body: UpsertBudgetRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<BudgetMutationResult, UpsertBudgetRequest>({
    path: `/api${apiEndpoints.households.budgets(householdId)}`,
    body,
    bodySchema: upsertBudgetRequestSchema,
    responseSchema: budgetMutationResultSchema,
    idempotencyScope: "budget",
    idempotencyKey,
  })
}
