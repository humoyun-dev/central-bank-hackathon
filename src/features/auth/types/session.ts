import type { MembershipRole } from "@/types/household"

export interface SessionMembership {
  householdId: string
  role: MembershipRole
}

export interface SessionUser {
  id: string
  fullName: string
  email: string
}

export interface AuthSession {
  sessionId: string
  user: SessionUser
  memberships: SessionMembership[]
  defaultHouseholdId: string | null
}
