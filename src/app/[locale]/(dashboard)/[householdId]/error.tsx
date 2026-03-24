"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { ErrorState } from "@/components/shared/error-state"

export default function HouseholdError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const t = useTranslations("common.routeStates.householdError")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ErrorState
        title={t("title")}
        description={t("description")}
        actionLabel={t("action")}
        onAction={unstable_retry}
      />
    </div>
  )
}
