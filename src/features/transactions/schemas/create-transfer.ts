import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createTransferFormSchema = z
  .object({
    fromAccountId: z.string().min(1, "validation.transactions.fromAccountId.required"),
    toAccountId: z.string().min(1, "validation.transactions.toAccountId.required"),
    amount: z
      .string()
      .trim()
      .min(1, "validation.transactions.transferAmount.required")
      .refine(isValidMoneyInput, "validation.money.invalidAmount"),
    note: z.string().trim().max(160, "validation.transactions.transferNote.max").optional(),
    occurredAtLocal: z.string().min(1, "validation.transactions.occurredAt.required"),
  })
  .refine((value) => value.fromAccountId !== value.toAccountId, {
    message: "validation.transactions.accountsMustDiffer",
    path: ["toAccountId"],
  })

export const createTransferRequestSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amountMinor: z.number().int().positive(),
  note: z.string().trim().min(1).max(160).nullable(),
  occurredAtUtc: z.string(),
})

export type CreateTransferFormValues = z.infer<typeof createTransferFormSchema>
export type CreateTransferRequest = z.infer<typeof createTransferRequestSchema>
