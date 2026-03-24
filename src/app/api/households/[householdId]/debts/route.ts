import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { createDebtRequestSchema } from "@/features/debts/schemas/create-debt"
import { debtMutationResultSchema } from "@/features/mutations/schemas/mutation-result"
import { hasPermission } from "@/lib/permissions"
import { createMockDebt, runWithIdempotency } from "@/services/api/mock/store"
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

  if (!hasPermission(household.role, "createDebt")) {
    return domainProblemJson({
      title: "Debt creation is not allowed",
      detail: "This membership does not have permission to create debt records.",
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
  const parsedPayload = createDebtRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const result = publicEnv.enableMockApi
      ? runWithIdempotency(idempotencyKey, () => {
          const debt = createMockDebt({
            householdId,
            ...parsedPayload.data,
          })

          return {
            debtId: debt.id,
            status: debt.status,
            remainingAmountMinor: debt.remaining_amount_minor,
            message: "Debt record created successfully.",
          }
        })
      : await serverApiRequest({
          path: apiEndpoints.households.debts(householdId),
          method: "POST",
          body: parsedPayload.data,
          householdId,
          idempotencyKey,
          schema: debtMutationResultSchema,
        })

    return Response.json(result, { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Debt could not be created",
      detail: error instanceof Error ? error.message : "The debt request failed.",
      status: 409,
    })
  }
}
