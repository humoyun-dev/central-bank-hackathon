import { z } from "zod"
import { createIdempotencyKey } from "@/lib/idempotency"
import { browserApiRequest } from "@/services/api/browser/client"

interface BrowserApiMutationOptions<TOutput, TBody> {
  path: string
  body: TBody
  bodySchema?: z.ZodType<TBody>
  responseSchema: z.ZodType<TOutput>
  method?: "POST" | "PUT" | "PATCH" | "DELETE"
  idempotencyScope?: string
  idempotencyKey?: string | undefined
}

export function browserApiMutation<TOutput, TBody>({
  path,
  body,
  bodySchema,
  responseSchema,
  method = "POST",
  idempotencyScope = "mutation",
  idempotencyKey,
}: BrowserApiMutationOptions<TOutput, TBody>) {
  const parsedBody = bodySchema ? bodySchema.parse(body) : body

  return browserApiRequest({
    path,
    method,
    body: parsedBody,
    schema: responseSchema,
    headers: {
      "Idempotency-Key": idempotencyKey ?? createIdempotencyKey(idempotencyScope),
    },
  })
}
