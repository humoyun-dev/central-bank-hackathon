import { resolveLocale } from "@/i18n/config"

interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string | undefined
}

export function formatNumberByLocale(
  value: number,
  options: FormatNumberOptions = {},
) {
  const { locale, ...formatOptions } = options

  return new Intl.NumberFormat(resolveLocale(locale), formatOptions).format(value)
}

export function formatCompactNumberByLocale(
  value: number,
  options: Omit<FormatNumberOptions, "notation" | "compactDisplay"> = {},
) {
  return formatNumberByLocale(value, {
    ...options,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: options.maximumFractionDigits ?? 1,
  })
}
