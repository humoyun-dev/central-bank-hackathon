import { z } from "zod"

export const debtDtoSchema = z.object({
  id: z.string(),
  counterparty_name: z.string(),
  direction: z.enum(["PAYABLE", "RECEIVABLE"]),
  currency_code: z.string().length(3),
  original_amount_minor: z.number().int().nonnegative(),
  remaining_amount_minor: z.number().int().nonnegative(),
  description: z.string().nullable(),
  created_at_utc: z.string(),
  due_at_utc: z.string().nullable(),
  status: z.enum(["OPEN", "PARTIAL", "SETTLED"]),
})

export const debtDtoListSchema = z.array(debtDtoSchema)

export type DebtDto = z.infer<typeof debtDtoSchema>
