import { StatusBadge } from "@/components/shared/status-badge"
import type { TransactionKind } from "@/features/transactions/types/transaction"

const kindToneMap: Record<TransactionKind, "success" | "warning" | "primary"> = {
  INCOME: "success",
  EXPENSE: "warning",
  TRANSFER: "primary",
}

export function TransactionKindBadge({ kind }: { kind: TransactionKind }) {
  return <StatusBadge label={kind} tone={kindToneMap[kind]} />
}
