"use client"

import { authSessionDtoSchema } from "@/features/auth/schemas/session.dto"
import { mapSessionDtoToSession } from "@/features/auth/mappers/map-session-dto-to-session"
import { browserApiRequest } from "@/services/api/browser/client"
import type { LoginRequest } from "@/features/auth/schemas/login-request"

export function login(body: LoginRequest) {
  return browserApiRequest({
    path: "/api/auth/login",
    method: "POST",
    body,
    schema: authSessionDtoSchema,
  }).then(mapSessionDtoToSession)
}
