import { ApiClientError } from "@/services/api/shared/request"
import { isTranslationKey } from "@/i18n/translate"

interface ErrorPresentationCopy {
  title: string
  description: string
}

interface ErrorPresentationOptions {
  fallbackTitle: string
  fallbackDescription: string
}

export function getErrorPresentation(
  error: unknown,
  options: ErrorPresentationOptions,
): ErrorPresentationCopy {
  if (error instanceof ApiClientError) {
    const title =
      error.problem?.title && isTranslationKey(error.problem.title)
        ? error.problem.title
        : options.fallbackTitle
    const detail =
      error.problem?.detail && isTranslationKey(error.problem.detail)
        ? error.problem.detail
        : options.fallbackDescription
    const traceIdSuffix = error.problem?.traceId
      ? ` (${error.problem.traceId})`
      : ""

    return {
      title,
      description: `${detail}${traceIdSuffix}`.trim(),
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return {
      title: options.fallbackTitle,
      description: isTranslationKey(error.message)
        ? error.message
        : options.fallbackDescription,
    }
  }

  return {
    title: options.fallbackTitle,
    description: options.fallbackDescription,
  }
}
