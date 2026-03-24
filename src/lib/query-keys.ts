export const queryKeys = {
  household: (householdId: string) => ["household", householdId] as const,
  accounts: (householdId: string) => ["household", householdId, "accounts"] as const,
  categories: (householdId: string) => ["household", householdId, "categories"] as const,
  debts: (householdId: string) => ["household", householdId, "debts"] as const,
  budgets: (householdId: string) => ["household", householdId, "budgets"] as const,
  transactions: (householdId: string, query: string) =>
    ["household", householdId, "transactions", query] as const,
  analyticsPreview: (householdId: string) =>
    ["household", householdId, "analytics-preview"] as const,
}
