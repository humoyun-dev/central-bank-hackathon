import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const upsertBudgetFormSchema = z.object({
  categoryId: z.string().min(1, "validation.budgets.categoryId.required"),
  period: z.enum(["MONTHLY", "WEEKLY"]),
  amount: z
    .string()
    .trim()
    .min(1, "validation.budgets.amount.required")
    .refine(isValidMoneyInput, "validation.money.invalidAmount"),
  effectiveFromLocalDate: z.string().min(1, "validation.budgets.effectiveFrom.required"),
})

export const upsertBudgetRequestSchema = z.object({
  categoryId: z.string().min(1),
  period: z.enum(["MONTHLY", "WEEKLY"]),
  limitMinor: z.number().int().positive(),
  effectiveFromLocalDate: z.string(),
})

export type UpsertBudgetFormValues = z.infer<typeof upsertBudgetFormSchema>
export type UpsertBudgetRequest = z.infer<typeof upsertBudgetRequestSchema>
