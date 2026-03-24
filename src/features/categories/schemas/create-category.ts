import { z } from "zod"

export const createCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(2, "validation.categories.name.min")
    .max(48, "validation.categories.name.max"),
  kind: z.enum(["EXPENSE", "INCOME"]),
})

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
