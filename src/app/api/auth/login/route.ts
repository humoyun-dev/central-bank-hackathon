import { loginRequestSchema } from "@/features/auth/schemas/login-request"
import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { loginMockUser } from "@/services/auth/mock-auth-store"
import { writeSessionCookie } from "@/services/auth/session-cookie"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(request: Request) {
  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock auth disabled",
      detail: "Backend auth proxy wiring is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = loginRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const session = authSessionDtoSchema.parse(loginMockUser(parsedPayload.data))
    await writeSessionCookie(session.session_id)
    return Response.json(session, { status: 200 })
  } catch (error) {
    return domainProblemJson({
      title: "Unable to sign in",
      detail: error instanceof Error ? error.message : "The login request failed.",
      status: 401,
      errors: {
        root: ["Check your email and password, then try again."],
      },
    })
  }
}
