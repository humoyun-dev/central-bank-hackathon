"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/shared/error-state"

export default function HouseholdError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ErrorState
        title="The household workspace could not be assembled"
        description="The shell stayed intact, but this route segment failed to render. Retry the segment or return to household selection."
        actionLabel="Retry segment"
        onAction={unstable_retry}
      />
    </div>
  )
}
