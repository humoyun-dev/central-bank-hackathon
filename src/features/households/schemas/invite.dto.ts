import { z } from "zod"

export const householdInviteDtoSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  household_name: z.string(),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  status: z.enum(["PENDING", "ACCEPTED"]),
  invited_by_name: z.string(),
  created_at_utc: z.string(),
  accepted_at_utc: z.string().nullable(),
})

export const householdInviteDtoListSchema = z.array(householdInviteDtoSchema)

export type HouseholdInviteDto = z.infer<typeof householdInviteDtoSchema>
