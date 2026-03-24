import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { categoryDtoSchema } from "@/features/categories/schemas/category.dto"
import { updateCategoryRequestSchema } from "@/features/categories/schemas/update-category"
import { hasPermission } from "@/lib/permissions"
import { updateMockCategory } from "@/services/api/mock/store"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ householdId: string; categoryId: string }> },
) {
  const { householdId, categoryId } = await context.params
  const household = await getHouseholdContext(householdId)

  if (!household) {
    return domainProblemJson({
      title: "Household not found",
      detail: "The target household is not accessible from this session.",
      status: 404,
    })
  }

  if (!hasPermission(household.role, "manageSettings")) {
    return domainProblemJson({
      title: "Category management not allowed",
      detail: "This membership cannot update household categories.",
      status: 403,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock mode disabled",
      detail: "Backend category proxy is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = updateCategoryRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const category = updateMockCategory({
      householdId,
      categoryId,
      ...parsedPayload.data,
    })

    return Response.json(categoryDtoSchema.parse(category), { status: 200 })
  } catch (error) {
    return domainProblemJson({
      title: "Category could not be updated",
      detail: error instanceof Error ? error.message : "The category request failed.",
      status: 409,
    })
  }
}
