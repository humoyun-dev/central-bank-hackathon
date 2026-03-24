import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { settleDebtRequestSchema } from "@/features/debts/schemas/settle-debt"
import { debtMutationResultSchema } from "@/features/mutations/schemas/mutation-result"
import { hasPermission } from "@/lib/permissions"
import { runWithIdempotency, settleMockDebt } from "@/services/api/mock/store"
import { serverApiRequest } from "@/services/api/server/client"
import { apiEndpoints } from "@/services/api/shared/endpoints"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(
  request: Request,
  context: { params: Promise<{ householdId: string; debtId: string }> },
) {
  const { householdId, debtId } = await context.params
  const household = await getHouseholdContext(householdId)

  if (!household) {
    return domainProblemJson({
      title: "Household not found",
      detail: "The target household no longer exists or is not accessible.",
      status: 404,
    })
  }

  if (!hasPermission(household.role, "settleDebt")) {
    return domainProblemJson({
      title: "Debt settlement is not allowed",
      detail: "This membership does not have permission to settle debts.",
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
  const parsedPayload = settleDebtRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const result = publicEnv.enableMockApi
      ? runWithIdempotency(idempotencyKey, () => {
          const settlement = settleMockDebt({
            householdId,
            debtId,
            ...parsedPayload.data,
          })

          return {
            debtId: settlement.debt.id,
            status: settlement.debt.status,
            remainingAmountMinor: settlement.debt.remaining_amount_minor,
            message: "Debt settlement recorded successfully.",
          }
        })
      : await serverApiRequest({
          path: apiEndpoints.households.debtSettlement(householdId, debtId),
          method: "POST",
          body: parsedPayload.data,
          householdId,
          idempotencyKey,
          schema: debtMutationResultSchema,
        })

    return Response.json(result, { status: 200 })
  } catch (error) {
    return domainProblemJson({
      title: "Debt could not be settled",
      detail: error instanceof Error ? error.message : "The settlement request failed.",
      status: 409,
    })
  }
}
