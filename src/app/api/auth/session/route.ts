import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { domainProblemJson } from "@/services/api/shared/problem-response"
import { getMockSession } from "@/services/auth/mock-auth-store"
import { readSessionCookie } from "@/services/auth/session-cookie"
import { publicEnv } from "@/services/config/public-env"

export async function GET() {
  const sessionId = await readSessionCookie()

  if (!sessionId) {
    return domainProblemJson({
      title: "No active session",
      detail: "The browser request does not contain an active session cookie.",
      status: 401,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock auth disabled",
      detail: "Backend session bootstrap proxy wiring is not configured in this environment.",
      status: 501,
    })
  }

  const session = getMockSession(sessionId)

  if (!session) {
    return domainProblemJson({
      title: "Session expired",
      detail: "The active session could not be restored. Sign in again to continue.",
      status: 401,
    })
  }

  return Response.json(authSessionDtoSchema.parse(session), { status: 200 })
}
