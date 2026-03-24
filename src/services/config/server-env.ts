import "server-only"
import { z } from "zod"

const serverEnvSchema = z.object({
  BACKEND_API_URL: z.string().url().default("http://localhost:8080"),
  SESSION_COOKIE_NAME: z.string().min(1).default("central-bank.session"),
})

export function getServerEnv() {
  return serverEnvSchema.parse({
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  })
}
