import { z } from "zod"
import type { ProblemDetails } from "@/types/api"
import { parseProblemDetails } from "@/services/api/shared/problem-details"

export class ApiClientError extends Error {
  status: number
  problem: ProblemDetails | null
  method: string
  path: string

  constructor(
    status: number,
    message: string,
    problem: ProblemDetails | null,
    method: string,
    path: string,
  ) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.problem = problem
    this.method = method
    this.path = path
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
  let response: Response

  try {
    response = await fetch(requestUrl, {
      method,
      cache,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : null),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    throw new ApiClientError(
      0,
      error instanceof Error ? error.message : "Network request failed",
      {
        title: "Network request failed",
        detail:
          error instanceof Error
            ? error.message
            : "The request could not reach the backend boundary.",
        status: 0,
        kind: "network",
      },
      method,
      path,
    )
  }

  if (!response.ok) {
    const problem = await parseProblemDetails(response)
    throw new ApiClientError(
      response.status,
      problem?.detail ?? problem?.title ?? "Request failed",
      problem,
      method,
      path,
    )
  }

  if (!schema) {
    return undefined as TOutput
  }

  if (response.status === 204) {
    return schema.parse(undefined)
  }

  const payload = await response.json()
  const parsedPayload = schema.safeParse(payload)

  if (!parsedPayload.success) {
    throw new ApiClientError(
      response.status,
      "Response validation failed",
      {
        title: "Response validation failed",
        detail: parsedPayload.error.issues[0]?.message ?? "Invalid backend payload",
        status: response.status,
        kind: "schema",
      },
      method,
      path,
    )
  }

  return parsedPayload.data
}
