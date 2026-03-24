import { ApiClientError } from "@/services/api/shared/request"

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
    const title = error.problem?.title ?? options.fallbackTitle
    const detail = error.problem?.detail ?? options.fallbackDescription
    const traceIdSuffix = error.problem?.traceId
      ? ` Reference: ${error.problem.traceId}.`
      : ""

    return {
      title,
      description: `${detail}${traceIdSuffix}`.trim(),
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return {
      title: options.fallbackTitle,
      description: error.message,
    }
  }

  return {
    title: options.fallbackTitle,
    description: options.fallbackDescription,
  }
}
