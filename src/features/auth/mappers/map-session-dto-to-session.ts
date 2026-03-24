import type { AuthSession } from "@/features/auth/types/session"
import type { AuthSessionDto } from "@/features/auth/schemas/session.dto"

export function mapSessionDtoToSession(sessionDto: AuthSessionDto): AuthSession {
  return {
    sessionId: sessionDto.session_id,
    user: {
      id: sessionDto.user.id,
      fullName: sessionDto.user.full_name,
      email: sessionDto.user.email,
    },
    memberships: sessionDto.memberships.map((membership) => ({
      householdId: membership.household_id,
      role: membership.role,
    })),
    defaultHouseholdId: sessionDto.default_household_id,
  }
}
