import { z } from "zod"

export const createHouseholdRequestSchema = z.object({
  name: z
    .string()
    .min(2, "validation.households.name.min")
    .max(64, "validation.households.name.max"),
  currencyCode: z.string().length(3, "validation.households.currencyCode.length"),
})

export type CreateHouseholdRequest = z.infer<typeof createHouseholdRequestSchema>
