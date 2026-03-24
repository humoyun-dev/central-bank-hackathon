import { redirect } from 'next/navigation';
import { getSession } from "@/features/auth/api/get-session"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()

  if (!session) {
    redirect(`/${locale}/login`)
  }

  const householdId = session.defaultHouseholdId
  
  if (householdId) {
    redirect(`/${locale}/${householdId}`)
  } else {
    redirect(`/${locale}/select-household`)
  }
}
