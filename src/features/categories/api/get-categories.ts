import "server-only"

import { categoryDtoListSchema } from "@/features/categories/schemas/category.dto"
import { mapCategoryDtoToCategory } from "@/features/categories/mappers/map-category-dto-to-category"
import type { CategoryKind } from "@/features/categories/types/category"
import { getMockCategoriesByHousehold } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { publicEnv } from "@/services/config/public-env"

async function getCategoriesInternal(
  householdId: string,
  kind?: CategoryKind,
) {
  const parsedDtos = publicEnv.enableMockApi
    ? categoryDtoListSchema.parse(getMockCategoriesByHousehold(householdId))
    : await serverApiRequest({
        path: apiEndpoints.households.categories(householdId),
        schema: categoryDtoListSchema,
        householdId,
      })

  const categories = parsedDtos.map(mapCategoryDtoToCategory)
  return kind ? categories.filter((category) => category.kind === kind) : categories
}

export async function getCategories(householdId: string, kind?: CategoryKind) {
  return getCategoriesInternal(householdId, kind)
}
