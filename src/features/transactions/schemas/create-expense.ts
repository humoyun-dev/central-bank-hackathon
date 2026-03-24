import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createExpenseFormSchema = z.object({
  accountId: z.string().min(1, "Choose the account the expense came from."),
  categoryId: z.string().min(1, "Choose an expense category."),
  amount: z
    .string()
    .trim()
    .min(1, "Enter the expense amount.")
    .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
  description: z.string().trim().max(120, "Keep the description within 120 characters.").optional(),
  note: z.string().trim().max(240, "Keep the note within 240 characters.").optional(),
  occurredAtLocal: z.string().min(1, "Choose when the expense happened."),
  reference: z.string().trim().max(80, "Keep the reference within 80 characters.").optional(),
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
