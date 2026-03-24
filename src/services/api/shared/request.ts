import { z } from "zod"
import type { ProblemDetails } from "@/types/api"
import { parseProblemDetails } from "@/services/api/shared/problem-details"

export class ApiClientError extends Error {
  status: number
  problem: ProblemDetails | null

  constructor(status: number, message: string, problem: ProblemDetails | null) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.problem = problem
  }
}

interface ApiRequestOptions<TOutput> {
  baseUrl?: string
  path: string
  schema?: z.ZodType<TOutput>
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
}

export async function apiRequest<TOutput>({
  baseUrl,
  path,
  schema,
  method = "GET",
  body,
  headers,
  cache = "no-store",
}: ApiRequestOptions<TOutput>): Promise<TOutput> {
  const requestUrl = baseUrl ? new URL(path, baseUrl).toString() : path
  const response = await fetch(requestUrl, {
    method,
    cache,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : null),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const problem = await parseProblemDetails(response)
    throw new ApiClientError(
      response.status,
      problem?.detail ?? problem?.title ?? "Request failed",
      problem,
    )
  }

  if (!schema) {
    return undefined as TOutput
  }

  if (response.status === 204) {
    return schema.parse(undefined)
  }

  const payload = await response.json()
  return schema.parse(payload)
}
