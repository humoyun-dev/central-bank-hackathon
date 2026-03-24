import { z } from "zod"

export const registerRequestSchema = z.object({
  fullName: z
    .string()
    .min(2, "validation.auth.fullName.min")
    .max(80, "validation.auth.fullName.max"),
  email: z.string().email("validation.auth.email.invalid"),
  password: z
    .string()
    .min(8, "validation.auth.password.min")
    .regex(/[a-zA-Z]/, "validation.auth.password.letter")
    .regex(/[0-9]/, "validation.auth.password.number"),
  householdName: z
    .string()
    .min(2, "validation.households.name.min")
    .max(64, "validation.households.name.max"),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
