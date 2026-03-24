import type { SettleDebtRequest } from "@/features/debts/schemas/settle-debt"
import { settleDebtRequestSchema } from "@/features/debts/schemas/settle-debt"
import {
  debtMutationResultSchema,
  type DebtMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function settleDebt(
  householdId: string,
  debtId: string,
  body: SettleDebtRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<DebtMutationResult, SettleDebtRequest>({
    path: `/api${apiEndpoints.households.debtSettlement(householdId, debtId)}`,
    body,
    bodySchema: settleDebtRequestSchema,
    responseSchema: debtMutationResultSchema,
    idempotencyScope: "debt-settlement",
    idempotencyKey,
  })
}
