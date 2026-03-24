import { z } from "zod"
import { isValidMoneyInput } from "@/lib/format/money"

export const createTransferFormSchema = z
  .object({
    fromAccountId: z.string().min(1, "Choose the source account."),
    toAccountId: z.string().min(1, "Choose the destination account."),
    amount: z
      .string()
      .trim()
      .min(1, "Enter the transfer amount.")
      .refine(isValidMoneyInput, "Enter a valid amount with up to two decimals."),
    note: z.string().trim().max(160, "Keep the note within 160 characters.").optional(),
    occurredAtLocal: z.string().min(1, "Choose when the transfer occurred."),
  })
  .refine((value) => value.fromAccountId !== value.toAccountId, {
    message: "Transfers must move between two different accounts.",
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
