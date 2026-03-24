import { z } from "zod"

export const householdDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  currency_code: z.string().length(3),
  member_count: z.number().int().nonnegative(),
  available_balance_minor: z.number().int(),
  month_income_minor: z.number().int().nonnegative(),
  month_spend_minor: z.number().int().nonnegative(),
})

export const householdDtoListSchema = z.array(householdDtoSchema)

export type HouseholdDto = z.infer<typeof householdDtoSchema>
