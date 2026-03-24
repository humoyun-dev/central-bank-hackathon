import { z } from "zod"
import type { ProblemDetails } from "@/types/api"

const problemDetailsSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  status: z.number().int().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  timestamp: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  traceId: z.string().optional(),
})

const jsonErrorSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  detail: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
})

export async function parseProblemDetails(
  response: Response,
): Promise<ProblemDetails | null> {
  const contentType = response.headers.get("content-type") ?? ""
  const isProblemDetails = contentType.includes("application/problem+json")
  const isJson = contentType.includes("application/json")

  if (isProblemDetails || isJson) {
    const payload = await response.json().catch(() => null)

    if (isProblemDetails) {
      const parsed = problemDetailsSchema.safeParse(payload)

      if (parsed.success) {
        return {
          ...parsed.data,
          kind: "problem-details",
        }
      }
    }

    const parsedJsonError = jsonErrorSchema.safeParse(payload)

    if (parsedJsonError.success) {
      return {
        title: parsedJsonError.data.error ?? parsedJsonError.data.message ?? "Request failed",
        detail:
          parsedJsonError.data.detail ??
          parsedJsonError.data.message ??
          parsedJsonError.data.error,
        errors: parsedJsonError.data.errors,
        status: response.status,
        kind: "json",
      }
    }
  }

  const textBody = await response.text().catch(() => "")
  const trimmedText = textBody.trim()

  if (trimmedText.length > 0) {
    return {
      title: response.statusText || "Request failed",
      detail: trimmedText,
      status: response.status,
      kind: "text",
    }
  }

  return {
    title: response.statusText || "Request failed",
    detail: "The request could not be completed.",
    status: response.status,
    kind: "unknown",
  }
}
