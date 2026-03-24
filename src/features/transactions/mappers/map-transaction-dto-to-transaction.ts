import type { TransactionDto } from "@/features/transactions/schemas/transaction.dto"
import type { TransactionListItem } from "@/features/transactions/types/transaction"

export function mapTransactionDtoToTransaction(
  transactionDto: TransactionDto,
): TransactionListItem {
  const signedAmountMinor =
    transactionDto.kind === "EXPENSE"
      ? -transactionDto.amount_minor
      : transactionDto.kind === "TRANSFER"
        ? 0
        : transactionDto.amount_minor

  return {
    id: transactionDto.id,
    kind: transactionDto.kind,
    description: transactionDto.description,
    categoryName: transactionDto.category_name,
    accountName: transactionDto.account_name,
    occurredAtUtc: transactionDto.occurred_at_utc,
    currencyCode: transactionDto.currency_code,
    amountMinor: transactionDto.amount_minor,
    signedAmountMinor,
    status: transactionDto.status,
  }
}
