import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { createIncomeRequestSchema } from "@/features/transactions/schemas/create-income"
import { transactionMutationResultSchema } from "@/features/mutations/schemas/mutation-result"
import { hasPermission } from "@/lib/permissions"
import { createMockIncome, runWithIdempotency } from "@/services/api/mock/store"
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

  if (!hasPermission(household.role, "createIncome")) {
    return domainProblemJson({
      title: "Income creation is not allowed",
      detail: "This membership does not have permission to record incomes.",
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
  const parsedPayload = createIncomeRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const result = publicEnv.enableMockApi
      ? runWithIdempotency(idempotencyKey, () => {
          const transaction = createMockIncome({
            householdId,
            ...parsedPayload.data,
          })

          return {
            transactionId: transaction.id,
            message: "Income recorded successfully.",
          }
        })
      : await serverApiRequest({
          path: apiEndpoints.households.incomes(householdId),
          method: "POST",
          body: parsedPayload.data,
          householdId,
          idempotencyKey,
          schema: transactionMutationResultSchema,
        })

    return Response.json(result, { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Income could not be recorded",
      detail: error instanceof Error ? error.message : "The income request failed.",
      status: 409,
    })
  }
}
