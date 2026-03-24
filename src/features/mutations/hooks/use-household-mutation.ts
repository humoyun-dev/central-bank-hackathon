"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { startTransition, useRef } from "react"
import { toast } from "sonner"
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

      toast.success(
        typeof successMessage === "function" ? successMessage(result) : successMessage,
      )

      await onSuccess?.(result)

      idempotencyKeyRef.current = null

      startTransition(() => {
        router.refresh()
      })
    },
  })
}
