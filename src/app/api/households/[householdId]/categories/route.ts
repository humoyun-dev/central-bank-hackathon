import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { createCategoryRequestSchema } from "@/features/categories/schemas/create-category"
import { categoryDtoSchema } from "@/features/categories/schemas/category.dto"
import { hasPermission } from "@/lib/permissions"
import { createMockCategory } from "@/services/api/mock/store"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(
  request: Request,
  context: { params: Promise<{ householdId: string }> },
) {
  const { householdId } = await context.params
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
      detail: "This membership cannot create household categories.",
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
  const parsedPayload = createCategoryRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const category = createMockCategory({
      householdId,
      ...parsedPayload.data,
    })

    return Response.json(categoryDtoSchema.parse(category), { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Category could not be created",
      detail: error instanceof Error ? error.message : "The category request failed.",
      status: 409,
    })
  }
}
