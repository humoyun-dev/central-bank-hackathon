import { requireSession } from "@/features/auth/api/get-session"

export default async function DashboardRouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()
  return <>{children}</>
}
