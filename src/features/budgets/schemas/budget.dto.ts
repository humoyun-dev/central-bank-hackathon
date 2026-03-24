import { z } from "zod"

export const budgetDtoSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  category_name: z.string(),
  period: z.enum(["MONTHLY", "WEEKLY"]),
  currency_code: z.string().length(3),
  limit_minor: z.number().int().nonnegative(),
  spent_minor: z.number().int().nonnegative(),
  remaining_minor: z.number().int(),
  effective_from_local_date: z.string(),
})

export const budgetDtoListSchema = z.array(budgetDtoSchema)

export type BudgetDto = z.infer<typeof budgetDtoSchema>
