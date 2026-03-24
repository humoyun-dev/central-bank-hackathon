import type { MembershipRole } from "@/types/household"

export type PermissionAction =
  | "viewAccounts"
  | "viewTransactions"
  | "viewAnalytics"
  | "createExpense"
  | "createIncome"
  | "initiateTransfer"
  | "createDebt"
  | "settleDebt"
  | "manageBudgets"
  | "manageSettings"

const permissionMatrix: Record<MembershipRole, readonly PermissionAction[]> = {
  OWNER: [
    "viewAccounts",
    "viewTransactions",
    "viewAnalytics",
    "createExpense",
    "createIncome",
    "initiateTransfer",
    "createDebt",
    "settleDebt",
    "manageBudgets",
    "manageSettings",
  ],
  ADMIN: [
    "viewAccounts",
    "viewTransactions",
    "viewAnalytics",
    "createExpense",
    "createIncome",
    "initiateTransfer",
    "createDebt",
    "settleDebt",
    "manageBudgets",
    "manageSettings",
  ],
  MEMBER: [
    "viewAccounts",
    "viewTransactions",
    "viewAnalytics",
    "createExpense",
    "createIncome",
    "initiateTransfer",
    "createDebt",
    "settleDebt",
  ],
  VIEWER: ["viewAccounts", "viewTransactions", "viewAnalytics"],
}

export function hasPermission(role: MembershipRole, action: PermissionAction) {
  return permissionMatrix[role].includes(action)
}

export function getVisibleDashboardActions(role: MembershipRole) {
  return {
    canViewAccounts: hasPermission(role, "viewAccounts"),
    canViewTransactions: hasPermission(role, "viewTransactions"),
    canViewAnalytics: hasPermission(role, "viewAnalytics"),
    canCreateExpense: hasPermission(role, "createExpense"),
    canCreateIncome: hasPermission(role, "createIncome"),
    canInitiateTransfer: hasPermission(role, "initiateTransfer"),
    canCreateDebt: hasPermission(role, "createDebt"),
    canSettleDebt: hasPermission(role, "settleDebt"),
    canManageBudgets: hasPermission(role, "manageBudgets"),
    canManageSettings: hasPermission(role, "manageSettings"),
  }
}
