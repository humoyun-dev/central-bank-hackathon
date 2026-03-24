"use client"

import { mapCategoryDtoToCategory } from "@/features/categories/mappers/map-category-dto-to-category"
import { categoryDtoSchema } from "@/features/categories/schemas/category.dto"
import {
  updateCategoryRequestSchema,
  type UpdateCategoryRequest,
} from "@/features/categories/schemas/update-category"
import { browserApiRequest } from "@/services/api/browser/client"

export function updateCategory(
  householdId: string,
  categoryId: string,
  body: UpdateCategoryRequest,
) {
  return browserApiRequest({
    path: `/api/households/${householdId}/categories/${categoryId}`,
    method: "PATCH",
    body: updateCategoryRequestSchema.parse(body),
    schema: categoryDtoSchema,
  }).then(mapCategoryDtoToCategory)
}
