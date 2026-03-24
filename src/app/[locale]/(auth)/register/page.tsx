import { AuthScreen } from "@/features/auth/components/auth-screen"
import { getSession } from "@/features/auth/api/get-session"
import { redirect } from "next/navigation"

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()

  if (session) {
    redirect(
      session.defaultHouseholdId
        ? `/${locale}/${session.defaultHouseholdId}`
        : `/${locale}/select-household`,
    )
  }

  return <AuthScreen mode="register" />
}
