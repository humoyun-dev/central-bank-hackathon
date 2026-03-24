import type { DebtDto } from "@/features/debts/schemas/debt.dto"
import type { Debt } from "@/features/debts/types/debt"

export function mapDebtDtoToDebt(debtDto: DebtDto): Debt {
  return {
    id: debtDto.id,
    counterpartyName: debtDto.counterparty_name,
    direction: debtDto.direction,
    currencyCode: debtDto.currency_code,
    originalAmountMinor: debtDto.original_amount_minor,
    remainingAmountMinor: debtDto.remaining_amount_minor,
    description: debtDto.description,
    createdAtUtc: debtDto.created_at_utc,
    dueAtUtc: debtDto.due_at_utc,
    status: debtDto.status,
  }
}
