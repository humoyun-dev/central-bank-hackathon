import { registerRequestSchema } from "@/features/auth/schemas/register-request"
import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"
import { registerMockUser } from "@/services/auth/mock-auth-store"
import { writeSessionCookie } from "@/services/auth/session-cookie"

export async function POST(request: Request) {
  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock auth disabled",
      detail: "Backend registration proxy wiring is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = registerRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const session = authSessionDtoSchema.parse(registerMockUser(parsedPayload.data))
    await writeSessionCookie(session.session_id)
    return Response.json(session, { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Registration failed",
      detail: error instanceof Error ? error.message : "The registration request failed.",
      status: 409,
      errors: {
        root: ["Use a different email address or retry with another household name."],
      },
    })
  }
}
