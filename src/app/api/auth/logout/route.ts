import { clearSessionCookie, readSessionCookie } from "@/services/auth/session-cookie"
import { destroyMockSession } from "@/services/auth/mock-auth-store"

export async function POST() {
  const sessionId = await readSessionCookie()

  if (sessionId) {
    destroyMockSession(sessionId)
  }

  await clearSessionCookie()

  return Response.json({ success: true }, { status: 200 })
}
