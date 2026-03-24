import { getSession } from "@/features/auth/api/get-session"
import { getHouseholdContext } from "@/features/households/api/get-household-context"
import { createHouseholdInviteRequestSchema } from "@/features/households/schemas/create-household-invite"
import { householdInviteDtoSchema } from "@/features/households/schemas/invite.dto"
import { hasPermission } from "@/lib/permissions"
import { createMockHouseholdInvite } from "@/services/api/mock/store"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(
  request: Request,
  context: { params: Promise<{ householdId: string }> },
) {
  const session = await getSession()

  if (!session) {
    return domainProblemJson({
      title: "Authentication required",
      detail: "A valid session is required to manage household invites.",
      status: 401,
    })
  }

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
      title: "Invite management not allowed",
      detail: "This membership cannot issue household invites.",
      status: 403,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock mode disabled",
      detail: "Backend invite proxy is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = createHouseholdInviteRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const invite = createMockHouseholdInvite({
      householdId,
      email: parsedPayload.data.email,
      role: parsedPayload.data.role,
      invitedByName: session.user.fullName,
    })

    return Response.json(householdInviteDtoSchema.parse(invite), { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Invite could not be sent",
      detail: error instanceof Error ? error.message : "The invite request failed.",
      status: 409,
    })
  }
}
