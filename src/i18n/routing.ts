import { defineRouting } from "next-intl/routing"
import { defaultLocale, locales } from "@/i18n/config"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    name: "central-bank-locale",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
})
