import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ApiClientError } from "@/services/api/shared/request"
import { isTranslationKey } from "@/i18n/translate"

function getProblemFallbackKey(status?: number) {
  switch (status) {
    case 400:
      return "errors.submission.invalid"
    case 401:
      return "errors.auth.unauthorized"
    case 403:
      return "errors.permission.denied"
    case 404:
      return "errors.resource.notFound"
    case 409:
      return "errors.submission.conflict"
    default:
      return "errors.submission.generic"
  }
}

export function applyProblemDetailsToForm<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
) {
  if (error instanceof ApiClientError) {
    Object.entries(error.problem?.errors ?? {}).forEach(([field, messages]) => {
      const firstMessage = messages[0]

      if (!firstMessage) {
        return
      }

      setError(field as Path<TFieldValues>, {
        type: "server",
        message: isTranslationKey(firstMessage)
          ? firstMessage
          : "validation.common.invalidField",
      })
    })

    const message =
      error.problem?.detail ??
      error.problem?.title ??
      getProblemFallbackKey(error.problem?.status)

    return isTranslationKey(message)
      ? message
      : getProblemFallbackKey(error.problem?.status)
  }

  if (error instanceof Error) {
    return isTranslationKey(error.message) ? error.message : "errors.submission.generic"
  }

  return "errors.submission.generic"
}
