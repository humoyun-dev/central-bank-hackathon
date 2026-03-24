import { z } from "zod"

export const updateCategoryRequestSchema = z.object({
  name: z.string().trim().min(2, "validation.categories.name.min"),
})

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>
