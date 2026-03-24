import { z } from "zod"

export const createHouseholdInviteRequestSchema = z.object({
  email: z.string().email("validation.households.invite.email.invalid"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
})

export type CreateHouseholdInviteRequest = z.infer<
  typeof createHouseholdInviteRequestSchema
>
