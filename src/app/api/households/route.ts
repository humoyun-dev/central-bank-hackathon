import { getSession } from "@/features/auth/api/get-session"
import { householdDtoSchema } from "@/features/households/schemas/household.dto"
import { createHouseholdRequestSchema } from "@/features/households/schemas/create-household"
import { grantMockSessionHouseholdAccess } from "@/services/auth/mock-auth-store"
import { createMockHousehold } from "@/services/api/mock/store"
import { domainProblemJson, zodProblemJson } from "@/services/api/shared/problem-response"
import { publicEnv } from "@/services/config/public-env"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return domainProblemJson({
      title: "Authentication required",
      detail: "A valid session is required to create a household.",
      status: 401,
    })
  }

  if (!publicEnv.enableMockApi) {
    return domainProblemJson({
      title: "Mock mode disabled",
      detail: "Backend household creation proxy is not configured in this environment.",
      status: 501,
    })
  }

  const rawPayload = await request.json().catch(() => null)
  const parsedPayload = createHouseholdRequestSchema.safeParse(rawPayload)

  if (!parsedPayload.success) {
    return zodProblemJson(parsedPayload.error)
  }

  try {
    const household = createMockHousehold({
      name: parsedPayload.data.name,
      currencyCode: parsedPayload.data.currencyCode,
      role: "OWNER",
    })

    grantMockSessionHouseholdAccess({
      sessionId: session.sessionId,
      householdId: household.id,
      role: "OWNER",
    })

    return Response.json(householdDtoSchema.parse(household), { status: 201 })
  } catch (error) {
    return domainProblemJson({
      title: "Household could not be created",
      detail: error instanceof Error ? error.message : "The request failed.",
      status: 409,
    })
  }
}
