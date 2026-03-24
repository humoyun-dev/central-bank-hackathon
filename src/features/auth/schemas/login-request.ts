import { z } from "zod"

export const loginRequestSchema = z.object({
  email: z.string().email("validation.auth.email.invalid"),
  password: z.string().min(8, "validation.auth.password.min"),
})

export type LoginRequest = z.infer<typeof loginRequestSchema>
