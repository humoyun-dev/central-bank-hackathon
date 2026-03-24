import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { accountDtoSchema } from "@/features/accounts/schemas/account.dto"
import { createAccountRequestSchema } from "@/features/accounts/schemas/create-account"
import { hasPermission } from "@/lib/permissions"
import { createMockAccount } from "@/services/api/mock/store"
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
      title: "Account management not allowed",
      detail: "This membership cannot create or manage household accounts.",
      status: 403,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock mode disabled",
      detail: "Backend account proxy is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = createAccountRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const account = createMockAccount({
      householdId,
      ...parsedPayload.data,
    })

    return Response.json(accountDtoSchema.parse(account), { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Account could not be created",
      detail: error instanceof Error ? error.message : "The account request failed.",
      status: 409,
    })
  }
}
