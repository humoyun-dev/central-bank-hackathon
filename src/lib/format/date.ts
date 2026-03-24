import { format, formatDistanceToNowStrict, parseISO } from "date-fns"

export function formatDateLabel(isoString: string) {
  return format(parseISO(isoString), "MMM d, yyyy")
}

export function formatTimeLabel(isoString: string) {
  return format(parseISO(isoString), "hh:mm a")
}

export function formatRelativeDate(isoString: string) {
  return formatDistanceToNowStrict(parseISO(isoString), { addSuffix: true })
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
