import { z } from "zod"

export const createHouseholdInviteRequestSchema = z.object({
  email: z.string().email("Enter a valid invite email address."),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
})

export type CreateHouseholdInviteRequest = z.infer<
  typeof createHouseholdInviteRequestSchema
>
