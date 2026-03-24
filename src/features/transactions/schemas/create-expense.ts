import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createExpenseFormSchema = z.object({
  accountId: z.string().min(1, "validation.transactions.accountId.required"),
  categoryId: z.string().min(1, "validation.transactions.expenseCategoryId.required"),
  amount: z
    .string()
    .trim()
    .min(1, "validation.transactions.expenseAmount.required")
    .refine(isValidMoneyInput, "validation.money.invalidAmount"),
  description: z.string().trim().max(120, "validation.transactions.description.max").optional(),
  note: z.string().trim().max(240, "validation.transactions.note.max").optional(),
  occurredAtLocal: z.string().min(1, "validation.transactions.occurredAt.required"),
  reference: z.string().trim().max(80, "validation.transactions.reference.max").optional(),
})

export const createExpenseRequestSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  description: z.string().trim().min(1).max(120).nullable(),
  note: z.string().trim().min(1).max(240).nullable(),
  occurredAtUtc: z.string(),
  metadata: z
    .object({
      reference: z.string().trim().min(1).max(80).optional(),
    })
    .nullable(),
})

export type CreateExpenseFormValues = z.infer<typeof createExpenseFormSchema>
export type CreateExpenseRequest = z.infer<typeof createExpenseRequestSchema>
