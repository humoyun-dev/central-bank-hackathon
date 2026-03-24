import { z } from "zod"

export const sessionMembershipDtoSchema = z.object({
  household_id: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
})

export const sessionUserDtoSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
})

export const authSessionDtoSchema = z.object({
  session_id: z.string(),
  user: sessionUserDtoSchema,
  memberships: z.array(sessionMembershipDtoSchema),
  default_household_id: z.string().nullable(),
})

export type SessionMembershipDto = z.infer<typeof sessionMembershipDtoSchema>
export type SessionUserDto = z.infer<typeof sessionUserDtoSchema>
export type AuthSessionDto = z.infer<typeof authSessionDtoSchema>
