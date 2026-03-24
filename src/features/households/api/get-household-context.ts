import "server-only"
import { z } from "zod"
import { mockHouseholdDtos } from "@/services/api/mock/seed-data"
import type { HouseholdContext } from "@/types/household"

const householdDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  currency_code: z.string().length(3),
  member_count: z.number().int().nonnegative(),
  available_balance_minor: z.number().int(),
  month_income_minor: z.number().int().nonnegative(),
  month_spend_minor: z.number().int().nonnegative(),
})

const householdListSchema = z.array(householdDtoSchema)

function mapHouseholdDtoToContext(
  householdDto: z.infer<typeof householdDtoSchema>,
): HouseholdContext {
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

export async function listHouseholds() {
  const parsedHouseholds = householdListSchema.parse(mockHouseholdDtos)
  return parsedHouseholds.map(mapHouseholdDtoToContext)
}

export async function getHouseholdContext(householdId: string) {
  const households = await listHouseholds()
  return households.find((household) => household.id === householdId) ?? null
}
