import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createIncomeFormSchema = z.object({
  accountId: z.string().min(1, "validation.transactions.accountId.required"),
  categoryId: z.string().min(1, "validation.transactions.incomeCategoryId.required"),
  amount: z
    .string()
    .trim()
    .min(1, "validation.transactions.incomeAmount.required")
    .refine(isValidMoneyInput, "validation.money.invalidAmount"),
  description: z.string().trim().max(120, "validation.transactions.description.max").optional(),
  occurredAtLocal: z.string().min(1, "validation.transactions.occurredAt.required"),
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
