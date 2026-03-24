import { redirect } from "next/navigation"
import { getSession } from "@/features/auth/api/get-session"

export default async function Page() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  redirect(session.defaultHouseholdId ? `/${session.defaultHouseholdId}` : "/select-household")
}
