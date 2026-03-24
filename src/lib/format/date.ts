import { format, formatDistanceToNowStrict, parseISO, type Locale } from "date-fns"
import { enUS, ru, uz } from "date-fns/locale"
import { resolveLocale } from "@/i18n/config"

const locales: Record<string, Locale> = {
  en: enUS,
  ru: ru,
  uz: uz,
}

function getDateFnsLocale(locale?: string) {
  return locales[resolveLocale(locale)] ?? enUS
}

function parseDateInput(value: Date | string) {
  return value instanceof Date ? value : parseISO(value)
}

export function formatDateByLocale(
  value: Date | string,
  locale?: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
  },
) {
  return new Intl.DateTimeFormat(resolveLocale(locale), options).format(parseDateInput(value))
}

export function formatMonthDayByLocale(value: Date | string, locale?: string) {
  return formatDateByLocale(value, locale, {
    month: "short",
    day: "numeric",
  })
}

export function formatWeekdayDayByLocale(value: Date | string, locale?: string) {
  return formatDateByLocale(value, locale, {
    weekday: "short",
    day: "numeric",
  })
}

export function formatDateLabel(isoString: string, localeStr?: string) {
  return formatDateByLocale(isoString, localeStr, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTimeLabel(isoString: string, localeStr?: string) {
  return formatDateByLocale(isoString, localeStr, {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatRelativeDate(isoString: string, localeStr?: string) {
  return formatDistanceToNowStrict(parseISO(isoString), {
    addSuffix: true,
    locale: getDateFnsLocale(localeStr),
  })
}

export function formatDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function formatDateTimeInputValue(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function parseDateInputToUtc(localDate: string) {
  return new Date(`${localDate}T00:00:00`).toISOString()
}

export function parseDateTimeInputToUtc(localDateTime: string) {
  return new Date(localDateTime).toISOString()
}
