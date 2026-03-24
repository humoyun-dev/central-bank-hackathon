import { z } from "zod"
import { apiRequest } from "@/services/api/shared/request"

interface BrowserApiRequestOptions<TOutput> {
  path: string
  schema?: z.ZodType<TOutput>
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: HeadersInit
}

export function browserApiRequest<TOutput>(
  options: BrowserApiRequestOptions<TOutput>,
) {
  return apiRequest({
    baseUrl: "",
    path: options.path,
    ...(options.schema ? { schema: options.schema } : {}),
    ...(options.method ? { method: options.method } : {}),
    ...(options.body !== undefined ? { body: options.body } : {}),
    ...(options.headers ? { headers: options.headers } : {}),
  })
}
