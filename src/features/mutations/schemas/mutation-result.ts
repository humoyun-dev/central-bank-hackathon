import { z } from "zod"

export const transactionMutationResultSchema = z.object({
  transactionId: z.string(),
  message: z.string(),
})

export const debtMutationResultSchema = z.object({
  debtId: z.string(),
  status: z.enum(["OPEN", "PARTIAL", "SETTLED"]),
  remainingAmountMinor: z.number().int().nonnegative(),
  message: z.string(),
})

export const budgetMutationResultSchema = z.object({
  budgetId: z.string(),
  message: z.string(),
})

export type TransactionMutationResult = z.infer<typeof transactionMutationResultSchema>
export type DebtMutationResult = z.infer<typeof debtMutationResultSchema>
export type BudgetMutationResult = z.infer<typeof budgetMutationResultSchema>
