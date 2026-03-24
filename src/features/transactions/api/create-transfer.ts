import type { CreateTransferRequest } from "@/features/transactions/schemas/create-transfer"
import { createTransferRequestSchema } from "@/features/transactions/schemas/create-transfer"
import {
  transactionMutationResultSchema,
  type TransactionMutationResult,
} from "@/features/mutations/schemas/mutation-result"
import { browserApiMutation } from "@/services/api/browser/mutation-client"
import { apiEndpoints } from "@/services/api/shared/endpoints"

export function createTransfer(
  householdId: string,
  body: CreateTransferRequest,
  idempotencyKey?: string,
) {
  return browserApiMutation<TransactionMutationResult, CreateTransferRequest>({
    path: `/api${apiEndpoints.households.transfers(householdId)}`,
    body,
    bodySchema: createTransferRequestSchema,
    responseSchema: transactionMutationResultSchema,
    idempotencyScope: "transfer",
    idempotencyKey,
  })
}
