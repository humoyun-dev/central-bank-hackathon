"use client"

import { categoryDtoSchema } from "@/features/categories/schemas/category.dto"
import { mapCategoryDtoToCategory } from "@/features/categories/mappers/map-category-dto-to-category"
import { browserApiRequest } from "@/services/api/browser/client"
import type { CreateCategoryRequest } from "@/features/categories/schemas/create-category"

export function createCategory(householdId: string, body: CreateCategoryRequest) {
  return browserApiRequest({
    path: `/api/households/${householdId}/categories`,
    method: "POST",
    body,
    schema: categoryDtoSchema,
  }).then(mapCategoryDtoToCategory)
}
