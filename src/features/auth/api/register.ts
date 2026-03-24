"use client"

import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { mapSessionDtoToSession } from "@/features/auth/mappers/map-session-dto-to-session"
import { browserApiRequest } from "@/services/api/browser/client"
import type { RegisterRequest } from "@/features/auth/schemas/register-request"

export function register(body: RegisterRequest) {
  return browserApiRequest({
    path: "/api/auth/register",
    method: "POST",
    body,
    schema: authSessionDtoSchema,
  }).then(mapSessionDtoToSession)
}
