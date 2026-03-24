import { StatusBadge } from "@/components/shared/status-badge"
import type { DebtStatus } from "@/features/debts/types/debt"

const debtStatusTone = {
  OPEN: "warning",
  PARTIAL: "primary",
  SETTLED: "success",
} as const

export function DebtStatusBadge({ status }: { status: DebtStatus }) {
  return <StatusBadge label={status} tone={debtStatusTone[status]} />
}
