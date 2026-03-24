import { z } from "zod"

export const categoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["EXPENSE", "INCOME"]),
  is_system: z.boolean(),
})

export const categoryDtoListSchema = z.array(categoryDtoSchema)

export type CategoryDto = z.infer<typeof categoryDtoSchema>
