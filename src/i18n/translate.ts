import { useTranslations } from "next-intl"

export function isTranslationKey(value: string) {
  return /^[a-z0-9]+(?:[._-][a-z0-9_-]+)+$/.test(value)
}

export function useOptionalTranslation() {
  const t = useTranslations()

  return (value?: string | null) => {
    if (!value) {
      return undefined
    }

    return isTranslationKey(value) ? t(value) : value
  }
}
