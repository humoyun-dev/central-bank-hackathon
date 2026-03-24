import { getSession } from "@/features/auth/api/get-session"
import { householdInviteDtoSchema } from "@/features/households/schemas/invite.dto"
import { grantMockSessionHouseholdAccess } from "@/services/auth/mock-auth-store"
import { acceptMockHouseholdInvite } from "@/services/api/mock/store"
import { domainProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(
  _request: Request,
  context: { params: Promise<{ inviteId: string }> },
) {
  const session = await getSession()

  if (!session) {
    return domainProblemJson({
      title: "Authentication required",
      detail: "A valid session is required to accept household invites.",
      status: 401,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock mode disabled",
      detail: "Backend invite acceptance proxy is not configured in this environment.",
      status: 501,
    })
  }

  const { inviteId } = await context.params

  try {
    const invite = acceptMockHouseholdInvite({
      inviteId,
      email: session.user.email,
    })

    grantMockSessionHouseholdAccess({
      sessionId: session.sessionId,
      householdId: invite.household_id,
      role: invite.role,
    })

    return Response.json(householdInviteDtoSchema.parse(invite), { status: 200 })
  } catch (error) {
    return domainProblemJson({
      title: "Invite could not be accepted",
      detail: error instanceof Error ? error.message : "The invite acceptance failed.",
      status: 409,
    })
  }
}
