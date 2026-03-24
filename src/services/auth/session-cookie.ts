import "server-only"

import { cookies } from "next/headers"
import { getServerEnv } from "@/services/config/server-env"

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14

export async function readSessionCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(getServerEnv().SESSION_COOKIE_NAME)?.value ?? null
}

export async function writeSessionCookie(sessionId: string) {
  const cookieStore = await cookies()

  cookieStore.set({
    name: getServerEnv().SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(getServerEnv().SESSION_COOKIE_NAME)
}
