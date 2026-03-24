import { AppLogo } from "@/components/shared/app-logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(82,122,188,0.18),transparent_42%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-10">
        <div className="lg:hidden">
          <AppLogo />
        </div>
        {children}
      </div>
    </div>
  )
}
