export const locales = ["en", "ru", "uz"] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = "en"

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbekcha",
}

const supportedLocales = new Set<string>(locales)

export function isSupportedLocale(locale: string): locale is AppLocale {
  return supportedLocales.has(locale)
}

export function resolveLocale(locale?: string | null): AppLocale {
  if (locale && isSupportedLocale(locale)) {
    return locale
  }

  return defaultLocale
}

export function getLocaleLabel(locale?: string | null) {
  return localeLabels[resolveLocale(locale)]
}
