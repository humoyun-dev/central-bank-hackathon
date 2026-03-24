import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope } from "next/font/google"
import { AppProviders } from "@/components/shared/providers/app-providers"
import { publicEnv } from "@/services/config/public-env"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: publicEnv.appName,
    template: `%s | ${publicEnv.appName}`,
  },
  description:
    "Household-scoped fintech dashboard foundation with server-first routing and typed API boundaries.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="h-dvh overflow-hidden bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
