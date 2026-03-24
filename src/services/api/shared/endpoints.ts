export const apiEndpoints = {
  households: {
    list: "/households",
    detail: (householdId: string) => `/households/${householdId}`,
    accounts: (householdId: string) => `/households/${householdId}/accounts`,
    categories: (householdId: string) => `/households/${householdId}/categories`,
    transactions: (householdId: string) => `/households/${householdId}/transactions`,
    expenses: (householdId: string) => `/households/${householdId}/expenses`,
    incomes: (householdId: string) => `/households/${householdId}/incomes`,
    transfers: (householdId: string) => `/households/${householdId}/transfers`,
    debts: (householdId: string) => `/households/${householdId}/debts`,
    debtSettlement: (householdId: string, debtId: string) =>
      `/households/${householdId}/debts/${debtId}/settlements`,
    budgets: (householdId: string) => `/households/${householdId}/budgets`,
    analyticsPreview: (householdId: string) =>
      `/households/${householdId}/analytics/preview`,
  },
} as const
