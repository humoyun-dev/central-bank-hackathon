import { z } from "zod"

export const updateCategoryRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter a category name."),
})

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>
