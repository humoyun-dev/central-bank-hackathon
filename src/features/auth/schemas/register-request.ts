import { z } from "zod"

export const registerRequestSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name is too long."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  householdName: z
    .string()
    .min(2, "Household name must be at least 2 characters.")
    .max(64, "Household name is too long."),
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>
