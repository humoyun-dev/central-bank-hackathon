import { z } from "zod"

export const transactionDtoSchema = z.object({
  id: z.string(),
  kind: z.enum(["EXPENSE", "INCOME", "TRANSFER"]),
  description: z.string(),
  category_name: z.string(),
  account_name: z.string(),
  occurred_at_utc: z.string(),
  currency_code: z.string().length(3),
  amount_minor: z.number().int().nonnegative(),
  status: z.enum(["POSTED", "PENDING"]),
})

export const transactionDtoListSchema = z.array(transactionDtoSchema)

export type TransactionDto = z.infer<typeof transactionDtoSchema>
