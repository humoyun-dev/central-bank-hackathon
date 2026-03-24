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
})

export async function parseProblemDetails(
  response: Response,
): Promise<ProblemDetails | null> {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/problem+json")) {
    return null
  }

  const payload = await response.json().catch(() => null)
  const parsed = problemDetailsSchema.safeParse(payload)

  return parsed.success ? parsed.data : null
}
