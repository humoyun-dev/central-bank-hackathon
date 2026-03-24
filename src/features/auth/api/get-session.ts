import "server-only"

import { redirect } from "next/navigation"
import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { mapSessionDtoToSession } from "@/features/auth/mappers/map-session-dto-to-session"
import { getMockSession } from "@/services/auth/mock-auth-store"
import { readSessionCookie } from "@/services/auth/session-cookie"
import { publicEnv } from "@/services/config/public-env"

export async function getSession() {
  const sessionId = await readSessionCookie()

  if (!sessionId) {
    return null
  }

  if (!publicEnv.enableMockApi) {
    return null
  }

  const sessionDto = getMockSession(sessionId)

  if (!sessionDto) {
    return null
  }

  const parsedSession = authSessionDtoSchema.parse(sessionDto)
  return mapSessionDtoToSession(parsedSession)
}

export async function requireSession() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
