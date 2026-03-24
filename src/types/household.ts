export type MembershipRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"

export interface HouseholdContext {
  id: string
  name: string
  role: MembershipRole
  currencyCode: string
  memberCount: number
  availableBalanceMinor: number
  monthIncomeMinor: number
  monthSpendMinor: number
}
