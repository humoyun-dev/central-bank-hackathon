import { z } from "zod"
import type { ProblemDetails } from "@/types/api"

export function problemJson(problem: ProblemDetails) {
  return new Response(JSON.stringify(problem), {
    status: problem.status ?? 500,
    headers: {
      "Content-Type": "application/problem+json",
    },
  })
}

export function zodProblemJson(
  error: z.ZodError,
  detail = "Submitted data failed validation.",
) {
  return problemJson({
    title: "Validation failed",
    detail,
    status: 400,
    errors: Object.fromEntries(
      Object.entries(error.flatten().fieldErrors).filter(
        (entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].length > 0,
      ),
    ),
    kind: "problem-details",
  })
}

export function domainProblemJson({
  title,
  detail,
  status = 409,
  errors,
}: {
  title: string
  detail: string
  status?: number
  errors?: Record<string, string[]>
}) {
  return problemJson({
    title,
    detail,
    status,
    errors,
    kind: "problem-details",
  })
}
