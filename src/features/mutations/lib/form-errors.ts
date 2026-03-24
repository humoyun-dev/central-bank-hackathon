import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ApiClientError } from "@/services/api/shared/request"

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
        message: firstMessage,
      })
    })

    return error.problem?.detail ?? error.problem?.title ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "The form could not be submitted."
}
