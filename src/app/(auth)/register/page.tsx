import { AuthScreen } from "@/features/auth/components/auth-screen"
import { getSession } from "@/features/auth/api/get-session"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect(session.defaultHouseholdId ? `/${session.defaultHouseholdId}` : "/select-household")
  }

  return <AuthScreen mode="register" />
}
