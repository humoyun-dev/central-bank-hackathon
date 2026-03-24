import "server-only"

import type { MembershipRole } from "@/types/household"
import type { AuthSessionDto } from "@/features/auth/schemas/session.dto"
import { createMockHousehold } from "@/services/api/mock/store"

interface MockAuthUser {
  id: string
  fullName: string
  email: string
  password: string
  defaultHouseholdId: string | null
  memberships: Record<string, MembershipRole>
}

interface MockAuthStoreState {
  users: MockAuthUser[]
  sessions: Map<string, string>
}

declare global {
  var __centralBankMockAuthStore: MockAuthStoreState | undefined
}

function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

function buildInitialStore(): MockAuthStoreState {
  return {
    users: [
      {
        id: "user-atlas",
        fullName: "Atlas Owner",
        email: "atlas@centralbank.app",
        password: "Atlas12345",
        defaultHouseholdId: "household-atlas",
        memberships: {
          "household-atlas": "OWNER",
          "household-horizon": "ADMIN",
        },
      },
    ],
    sessions: new Map(),
  }
}

function getStore() {
  if (!globalThis.__centralBankMockAuthStore) {
    globalThis.__centralBankMockAuthStore = buildInitialStore()
  }

  return globalThis.__centralBankMockAuthStore
}

function toSessionDto(user: MockAuthUser, sessionId: string): AuthSessionDto {
  return {
    session_id: sessionId,
    user: {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
    },
    memberships: Object.entries(user.memberships).map(([householdId, role]) => ({
      household_id: householdId,
      role,
    })),
    default_household_id: user.defaultHouseholdId,
  }
}

function findUserBySessionId(sessionId: string) {
  const store = getStore()
  const userId = store.sessions.get(sessionId)

  if (!userId) {
    return null
  }

  return store.users.find((user) => user.id === userId) ?? null
}

function createSessionForUser(user: MockAuthUser) {
  const store = getStore()
  const sessionId = `session-${crypto.randomUUID()}`
  store.sessions.set(sessionId, user.id)
  return toSessionDto(user, sessionId)
}

export function loginMockUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const user = getStore().users.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password,
  )

  if (!user) {
    throw new Error("Email or password is incorrect.")
  }

  return createSessionForUser(user)
}

export function registerMockUser({
  fullName,
  email,
  password,
  householdName,
}: {
  fullName: string
  email: string
  password: string
  householdName: string
}) {
  const normalizedEmail = email.trim().toLowerCase()
  const store = getStore()

  if (store.users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.")
  }

  const household = createMockHousehold({
    name: householdName,
    currencyCode: "USD",
    role: "OWNER",
  })

  const user: MockAuthUser = {
    id: `user-${crypto.randomUUID()}`,
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    defaultHouseholdId: household.id,
    memberships: {
      [household.id]: "OWNER",
    },
  }

  store.users.unshift(user)

  return createSessionForUser(user)
}

export function getMockSession(sessionId: string) {
  const user = findUserBySessionId(sessionId)

  if (!user) {
    return null
  }

  return toSessionDto(user, sessionId)
}

export function destroyMockSession(sessionId: string) {
  getStore().sessions.delete(sessionId)
}

export function grantMockSessionHouseholdAccess({
  sessionId,
  householdId,
  role,
}: {
  sessionId: string
  householdId: string
  role: MembershipRole
}) {
  const user = findUserBySessionId(sessionId)

  if (!user) {
    throw new Error("Active session could not be resolved.")
  }

  user.memberships[householdId] = role
  user.defaultHouseholdId ??= householdId

  return cloneValue(user.memberships)
}

export function listMockHouseholdAccess(sessionId: string) {
  const user = findUserBySessionId(sessionId)
  return cloneValue(user?.memberships ?? {})
}
