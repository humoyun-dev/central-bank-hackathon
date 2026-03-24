import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const settleDebtFormSchema = z.object({
  debtId: z.string().min(1, "validation.debts.debtId.required"),
  accountId: z.string().min(1, "validation.debts.accountId.required"),
  amount: z
    .string()
    .trim()
    .min(1, "validation.debts.amount.required")
    .refine(isValidMoneyInput, "validation.money.invalidAmount"),
  note: z.string().trim().max(180, "validation.debts.note.max").optional(),
  occurredAtLocal: z.string().min(1, "validation.debts.occurredAt.required"),
})

export const settleDebtRequestSchema = z.object({
  accountId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  note: z.string().trim().min(1).max(180).nullable(),
  occurredAtUtc: z.string(),
})

export type SettleDebtFormValues = z.infer<typeof settleDebtFormSchema>
export type SettleDebtRequest = z.infer<typeof settleDebtRequestSchema>
