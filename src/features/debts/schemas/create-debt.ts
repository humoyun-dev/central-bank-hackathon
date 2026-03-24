import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createDebtFormSchema = z.object({
  counterpartyName: z.string().trim().min(2, "validation.debts.counterpartyName.min").max(80),
  direction: z.enum(["PAYABLE", "RECEIVABLE"]),
  amount: z
    .string()
    .trim()
    .min(1, "validation.debts.amount.required")
    .refine(isValidMoneyInput, "validation.money.invalidAmount"),
  description: z.string().trim().max(240, "validation.debts.description.max").optional(),
  dueAtLocalDate: z.string().optional(),
})

export const createDebtRequestSchema = z.object({
  counterpartyName: z.string().trim().min(2).max(80),
  direction: z.enum(["PAYABLE", "RECEIVABLE"]),
  amountMinor: z.number().int().positive(),
  description: z.string().trim().min(1).max(240).nullable(),
  dueAtUtc: z.string().nullable(),
})

export type CreateDebtFormValues = z.infer<typeof createDebtFormSchema>
export type CreateDebtRequest = z.infer<typeof createDebtRequestSchema>
