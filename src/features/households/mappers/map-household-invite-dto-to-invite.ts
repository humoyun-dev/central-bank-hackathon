import type { HouseholdInvite } from "@/features/households/types/invite"
import type { HouseholdInviteDto } from "@/features/households/schemas/invite.dto"

export function mapHouseholdInviteDtoToInvite(
  inviteDto: HouseholdInviteDto,
): HouseholdInvite {
  return {
    id: inviteDto.id,
    householdId: inviteDto.household_id,
    householdName: inviteDto.household_name,
    email: inviteDto.email,
    role: inviteDto.role,
    status: inviteDto.status,
    invitedByName: inviteDto.invited_by_name,
    createdAtUtc: inviteDto.created_at_utc,
    acceptedAtUtc: inviteDto.accepted_at_utc,
  }
}
