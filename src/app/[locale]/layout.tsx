import type { Metadata } from "next"
import { IBM_Plex_Mono, Manrope } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { AppProviders } from "@/components/shared/providers/app-providers"
import { isSupportedLocale } from "@/i18n/config"
import { publicEnv } from "@/services/config/public-env"
import "../globals.css"

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isSupportedLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="h-dvh overflow-hidden bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
