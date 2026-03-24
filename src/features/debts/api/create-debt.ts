import type { CreateDebtRequest } from "@/features/debts/schemas/create-debt"
import { createDebtRequestSchema } from "@/features/debts/schemas/create-debt"
import {
  debtMutationResultSchema,
  type DebtMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function createDebt(
  householdId: string,
  body: CreateDebtRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<DebtMutationResult, CreateDebtRequest>({
    path: `/api${apiEndpoints.households.debts(householdId)}`,
    body,
    bodySchema: createDebtRequestSchema,
    responseSchema: debtMutationResultSchema,
    idempotencyScope: "debt",
    idempotencyKey,
  })
}
