import { z } from "zod"

export const accountDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  institution_name: z.string(),
  type: z.enum(["BANK", "CARD", "CASH"]),
  currency_code: z.string().length(3),
  balance_minor: z.number().int(),
  available_balance_minor: z.number().int(),
  masked_number: z.string().nullable(),
  is_primary: z.boolean(),
})

export const accountDtoListSchema = z.array(accountDtoSchema)

export type AccountDto = z.infer<typeof accountDtoSchema>
