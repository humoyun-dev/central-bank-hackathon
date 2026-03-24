export const queryKeys = {
  household: (householdId: string) => ["household", householdId] as const,
  accounts: (householdId: string) => ["household", householdId, "accounts"] as const,
  transactions: (householdId: string, query: string) =>
    ["household", householdId, "transactions", query] as const,
}
