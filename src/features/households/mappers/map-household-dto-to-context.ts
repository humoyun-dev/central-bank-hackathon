import type { HouseholdDto } from "@/features/households/schemas/household.dto"
import type { HouseholdContext } from "@/types/household"

export function mapHouseholdDtoToContext(householdDto: HouseholdDto): HouseholdContext {
  return {
    id: householdDto.id,
    name: householdDto.name,
    role: householdDto.role,
    currencyCode: householdDto.currency_code,
    memberCount: householdDto.member_count,
    availableBalanceMinor: householdDto.available_balance_minor,
    monthIncomeMinor: householdDto.month_income_minor,
    monthSpendMinor: householdDto.month_spend_minor,
  }
}
