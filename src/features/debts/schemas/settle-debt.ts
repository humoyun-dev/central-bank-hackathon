import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const settleDebtFormSchema = z.object({
  debtId: z.string().min(1, "Choose the debt to settle."),
  accountId: z.string().min(1, "Choose the account used for settlement."),
  amount: z
    .string()
    .trim()
    .min(1, "Enter the settlement amount.")
    .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
  note: z.string().trim().max(180, "Keep the note within 180 characters.").optional(),
  occurredAtLocal: z.string().min(1, "Choose when the settlement happened."),
})

export const settleDebtRequestSchema = z.object({
  accountId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  note: z.string().trim().min(1).max(180).nullable(),
  occurredAtUtc: z.string(),
})

export type SettleDebtFormValues = z.infer<typeof settleDebtFormSchema>
export type SettleDebtRequest = z.infer<typeof settleDebtRequestSchema>
