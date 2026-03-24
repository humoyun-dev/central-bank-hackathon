import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const upsertBudgetFormSchema = z.object({
  categoryId: z.string().min(1, "Choose the category this budget should govern."),
  period: z.enum(["MONTHLY", "WEEKLY"]),
  amount: z
    .string()
    .trim()
    .min(1, "Enter the budget limit.")
    .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
  effectiveFromLocalDate: z.string().min(1, "Choose when the budget becomes active."),
})

export const upsertBudgetRequestSchema = z.object({
  categoryId: z.string().min(1),
  period: z.enum(["MONTHLY", "WEEKLY"]),
  limitMinor: z.number().int().positive(),
  effectiveFromLocalDate: z.string(),
})

export type UpsertBudgetFormValues = z.infer<typeof upsertBudgetFormSchema>
export type UpsertBudgetRequest = z.infer<typeof upsertBudgetRequestSchema>
