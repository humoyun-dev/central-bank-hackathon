import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createIncomeFormSchema = z.object({
  accountId: z.string().min(1, "Choose the account that received the income."),
  categoryId: z.string().min(1, "Choose the income source."),
  amount: z
    .string()
    .trim()
    .min(1, "Enter the income amount.")
    .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
  description: z.string().trim().max(120, "Keep the description within 120 characters.").optional(),
  occurredAtLocal: z.string().min(1, "Choose when the income was received."),
})

export const createIncomeRequestSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  description: z.string().trim().min(1).max(120).nullable(),
  occurredAtUtc: z.string(),
})

export type CreateIncomeFormValues = z.infer<typeof createIncomeFormSchema>
export type CreateIncomeRequest = z.infer<typeof createIncomeRequestSchema>
