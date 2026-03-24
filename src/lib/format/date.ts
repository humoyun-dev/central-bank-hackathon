import { format, formatDistanceToNowStrict, parseISO } from "date-fns"

export function formatDateLabel(isoString: string) {
  return format(parseISO(isoString), "MMM d, yyyy")
}

export function formatRelativeDate(isoString: string) {
  return formatDistanceToNowStrict(parseISO(isoString), { addSuffix: true })
}
