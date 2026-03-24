import type { Account } from "@/features/accounts/types/account"
import type { AccountDto } from "@/features/accounts/schemas/account.dto"

export function mapAccountDtoToAccount(accountDto: AccountDto): Account {
  return {
    id: accountDto.id,
    name: accountDto.name,
    institutionName: accountDto.institution_name,
    kind: accountDto.type,
    currencyCode: accountDto.currency_code,
    balanceMinor: accountDto.balance_minor,
    availableBalanceMinor: accountDto.available_balance_minor,
    maskedNumber: accountDto.masked_number,
    isPrimary: accountDto.is_primary,
    status: accountDto.status,
    archivedAtUtc: accountDto.archived_at_utc,
    disabledReason: accountDto.disabled_reason,
  }
}
