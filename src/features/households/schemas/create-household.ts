import { z } from "zod"

export const createHouseholdRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Household name must be at least 2 characters.")
    .max(64, "Household name is too long."),
  currencyCode: z.string().length(3, "Currency code must contain 3 letters."),
})

export type CreateHouseholdRequest = z.infer<typeof createHouseholdRequestSchema>
