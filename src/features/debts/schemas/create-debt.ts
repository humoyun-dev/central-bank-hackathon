import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createDebtFormSchema = z.object({
  counterpartyName: z.string().trim().min(2, "Enter the person or member name.").max(80),
  direction: z.enum(["PAYABLE", "RECEIVABLE"]),
  amount: z
    .string()
    .trim()
    .min(1, "Enter the debt amount.")
    .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
  description: z.string().trim().max(240, "Keep the description within 240 characters.").optional(),
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
