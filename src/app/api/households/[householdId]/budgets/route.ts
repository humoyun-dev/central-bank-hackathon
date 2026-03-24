import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { upsertBudgetRequestSchema } from "@/features/budgets/schemas/upsert-budget"
import { budgetMutationResultSchema } from "@/features/mutations/schemas/mutation-result"
import { hasPermission } from "@/lib/permissions"
import { runWithIdempotency, upsertMockBudget } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
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
      detail: "The target household no longer exists or is not accessible.",
      status: 404,
    })
  }

  if (!hasPermission(household.role, "manageBudgets")) {
    return domainProblemJson({
      title: "Budget management is not allowed",
      detail: "This membership does not have permission to create or update budgets.",
      status: 403,
    })
  }

  const idempotencyKey = request.headers.get("Idempotency-Key")

  if (!idempotencyKey) {
    return domainProblemJson({
      title: "Idempotency key required",
      detail: "Write requests must include an Idempotency-Key header.",
      status: 400,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = upsertBudgetRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const result = publicEnv.enableMockApi
      ? runWithIdempotency(idempotencyKey, () => {
          const budget = upsertMockBudget({
            householdId,
            ...parsedPayload.data,
          })

          return {
            budgetId: budget?.id ?? "",
            message: "Budget limit saved successfully.",
          }
        })
      : await serverApiRequest({
          path: apiEndpoints.households.budgets(householdId),
          method: "POST",
          body: parsedPayload.data,
          householdId,
          idempotencyKey,
          schema: budgetMutationResultSchema,
        })

    return Response.json(result, { status: 200 })
  } catch (error) {
    return domainProblemJson({
      title: "Budget could not be saved",
      detail: error instanceof Error ? error.message : "The budget request failed.",
      status: 409,
    })
  }
}
