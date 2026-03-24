import "server-only"

import { getLocale } from "next-intl/server"
import { resolveLocale } from "@/i18n/config"

export async function getCurrentLocale() {
  return resolveLocale(await getLocale())
}
