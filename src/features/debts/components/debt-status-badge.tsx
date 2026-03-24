import { useTranslations } from "next-intl"
import { StatusBadge } from "@/components/shared/status-badge"
import type { DebtStatus } from "@/features/debts/types/debt"

const debtStatusTone = {
  OPEN: "warning",
  PARTIAL: "primary",
  SETTLED: "success",
} as const

export function DebtStatusBadge({ status }: { status: DebtStatus }) {
  const t = useTranslations("debts.common.status")

  return (
    <StatusBadge
      label={t(status.toLowerCase())}
      tone={debtStatusTone[status]}
    />
  )
}
