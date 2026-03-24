import "server-only"
import { cookies } from "next/headers"
import { z } from "zod"
import { getServerEnv } from "@/services/config/server-env"
import { apiRequest } from "@/services/api/shared/request"

interface ServerApiRequestOptions<TOutput> {
  path: string
  schema?: z.ZodType<TOutput>
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  householdId?: string
  idempotencyKey?: string
}

export async function serverApiRequest<TOutput>({
  path,
  schema,
  method,
  body,
  householdId,
  idempotencyKey,
}: ServerApiRequestOptions<TOutput>) {
  const env = getServerEnv()
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(env.SESSION_COOKIE_NAME)?.value

  return apiRequest({
    baseUrl: env.BACKEND_API_URL,
    path,
    headers: {
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : null),
      ...(householdId ? { "X-Household-Id": householdId } : null),
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : null),
    },
    ...(schema ? { schema } : {}),
    ...(method ? { method } : {}),
    ...(body !== undefined ? { body } : {}),
  })
}
