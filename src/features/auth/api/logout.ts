"use client"
import { browserApiRequest } from "@/services/api/browser/client"

export function logout() {
  return browserApiRequest({
    path: "/api/auth/logout",
    method: "POST",
  })
}
