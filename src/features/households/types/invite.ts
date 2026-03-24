import type { MembershipRole } from "@/types/household"

export type HouseholdInviteStatus = "PENDING" | "ACCEPTED"

export interface HouseholdInvite {
  id: string
  householdId: string
  householdName: string
  email: string
  role: MembershipRole
  status: HouseholdInviteStatus
  invitedByName: string
  createdAtUtc: string
  acceptedAtUtc: string | null
}
