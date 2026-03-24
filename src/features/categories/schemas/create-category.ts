import { z } from "zod"

export const createCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(48, "Category name is too long."),
  kind: z.enum(["EXPENSE", "INCOME"]),
})

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
