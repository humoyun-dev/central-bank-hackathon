"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { startTransition, useRef } from "react"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import { isTranslationKey } from "@/i18n/translate"
import { createIdempotencyKey } from "@/lib/idempotency"

interface UseHouseholdMutationOptions<TInput, TOutput> {
  mutationFn: (input: TInput, idempotencyKey: string) => Promise<TOutput>
  invalidateKeys?: ReadonlyArray<readonly unknown[]>
  successMessage: string | ((result: TOutput) => string)
  onSuccess?: (result: TOutput) => void | Promise<void>
  idempotencyScope?: string
}

export function useHouseholdMutation<TInput, TOutput>({
  mutationFn,
  invalidateKeys = [],
  successMessage,
  onSuccess,
  idempotencyScope = "mutation",
}: UseHouseholdMutationOptions<TInput, TOutput>) {
  const t = useTranslations()
  const queryClient = useQueryClient()
  const router = useRouter()
  const idempotencyKeyRef = useRef<string | null>(null)

  return useMutation<TOutput, Error, TInput>({
    mutationFn: (input) => {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = createIdempotencyKey(idempotencyScope)
      }

      return mutationFn(input, idempotencyKeyRef.current)
    },
    onSuccess: async (result) => {
      await Promise.all(
        invalidateKeys.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
          }),
        ),
      )

      const message =
        typeof successMessage === "function" ? successMessage(result) : successMessage

      toast.success(isTranslationKey(message) ? t(message) : message)

      await onSuccess?.(result)

      idempotencyKeyRef.current = null

      startTransition(() => {
        router.refresh()
      })
    },
  })
}
