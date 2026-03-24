import "server-only"

import { addDays, format, parseISO, startOfMonth, startOfWeek, subDays } from "date-fns"
import type { AccountDto } from "@/features/accounts/schemas/account.dto"
import type { BudgetDto } from "@/features/budgets/schemas/budget.dto"
import type { CategoryDto } from "@/features/categories/schemas/category.dto"
import type { DebtDto } from "@/features/debts/schemas/debt.dto"
import type { HouseholdDto } from "@/features/households/schemas/household.dto"
import type { HouseholdInviteDto } from "@/features/households/schemas/invite.dto"
import type { TransactionDto } from "@/features/transactions/schemas/transaction.dto"
import {
  mockAccountDtosByHousehold,
  mockBudgetDtosByHousehold,
  mockCategoryDtosByHousehold,
  mockDebtDtosByHousehold,
  mockHouseholdDtos,
  mockHouseholdInviteDtos,
  mockTransactionDtosByHousehold,
} from "@/services/api/mock/seed-data"

interface MockStoreState {
  households: HouseholdDto[]
  accountsByHousehold: Record<string, AccountDto[]>
  categoriesByHousehold: Record<string, CategoryDto[]>
  transactionsByHousehold: Record<string, TransactionDto[]>
  debtsByHousehold: Record<string, DebtDto[]>
  budgetsByHousehold: Record<string, BudgetDto[]>
  householdInvites: HouseholdInviteDto[]
  idempotencyResults: Map<string, unknown>
}

interface CreateExpenseRecordInput {
  householdId: string
  accountId: string
  categoryId: string
  amountMinor: number
  description: string | null
  note: string | null
  occurredAtUtc: string
  metadata: {
    reference?: string | undefined
  } | null
}

interface CreateIncomeRecordInput {
  householdId: string
  accountId: string
  categoryId: string
  amountMinor: number
  description: string | null
  occurredAtUtc: string
}

interface CreateTransferRecordInput {
  householdId: string
  fromAccountId: string
  toAccountId: string
  amountMinor: number
  note: string | null
  occurredAtUtc: string
}

interface CreateDebtRecordInput {
  householdId: string
  counterpartyName: string
  direction: DebtDto["direction"]
  amountMinor: number
  description: string | null
  dueAtUtc: string | null
}

interface SettleDebtRecordInput {
  householdId: string
  debtId: string
  accountId: string
  amountMinor: number
  occurredAtUtc: string
  note: string | null
}

interface UpsertBudgetRecordInput {
  householdId: string
  categoryId: string
  period: BudgetDto["period"]
  limitMinor: number
  effectiveFromLocalDate: string
}

interface CreateAccountRecordInput {
  householdId: string
  name: string
  institutionName: string
  kind: AccountDto["type"]
  currencyCode: string
  openingBalanceMinor: number
  maskedNumber: string | null
  isPrimary: boolean
}

interface UpdateAccountRecordInput {
  householdId: string
  accountId: string
  name: string
  institutionName: string
  maskedNumber: string | null
  isPrimary: boolean
  status: AccountDto["status"]
  disabledReason: string | null
}

interface UpdateCategoryRecordInput {
  householdId: string
  categoryId: string
  name: string
}

declare global {
  var __centralBankMockStore: MockStoreState | undefined
}

function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

function buildInitialStore(): MockStoreState {
  return {
    households: cloneValue(mockHouseholdDtos),
    accountsByHousehold: cloneValue(mockAccountDtosByHousehold),
    categoriesByHousehold: cloneValue(mockCategoryDtosByHousehold),
    transactionsByHousehold: cloneValue(mockTransactionDtosByHousehold),
    debtsByHousehold: cloneValue(mockDebtDtosByHousehold),
    budgetsByHousehold: cloneValue(mockBudgetDtosByHousehold),
    householdInvites: cloneValue(mockHouseholdInviteDtos),
    idempotencyResults: new Map(),
  }
}

function getStore() {
  if (!globalThis.__centralBankMockStore) {
    globalThis.__centralBankMockStore = buildInitialStore()
  }

  globalThis.__centralBankMockStore.householdInvites ??= []
  globalThis.__centralBankMockStore.idempotencyResults ??= new Map()

  return globalThis.__centralBankMockStore
}

function ensureHousehold(store: MockStoreState, householdId: string) {
  const household = store.households.find((item) => item.id === householdId)

  if (!household) {
    throw new Error("Household not found in mock store.")
  }

  return household
}

function ensureAccount(store: MockStoreState, householdId: string, accountId: string) {
  const account = store.accountsByHousehold[householdId]?.find((item) => item.id === accountId)

  if (!account) {
    throw new Error("Account not found in mock store.")
  }

  return account
}

function ensureCategory(store: MockStoreState, householdId: string, categoryId: string) {
  const category = store.categoriesByHousehold[householdId]?.find((item) => item.id === categoryId)

  if (!category) {
    throw new Error("Category not found in mock store.")
  }

  return category
}

function ensureDebt(store: MockStoreState, householdId: string, debtId: string) {
  const debt = store.debtsByHousehold[householdId]?.find((item) => item.id === debtId)

  if (!debt) {
    throw new Error("Debt not found in mock store.")
  }

  return debt
}

function assertActiveAccount(account: AccountDto) {
  if (account.status === "ARCHIVED") {
    throw new Error("Archived accounts cannot be used for new money movement.")
  }

  if (account.status === "RESTRICTED") {
    throw new Error("This account is temporarily restricted and cannot be used right now.")
  }
}

function adjustHouseholdMetrics(
  household: HouseholdDto,
  {
    availableDeltaMinor,
    incomeDeltaMinor = 0,
    spendDeltaMinor = 0,
  }: {
    availableDeltaMinor: number
    incomeDeltaMinor?: number
    spendDeltaMinor?: number
  },
) {
  household.available_balance_minor += availableDeltaMinor
  household.month_income_minor = Math.max(0, household.month_income_minor + incomeDeltaMinor)
  household.month_spend_minor = Math.max(0, household.month_spend_minor + spendDeltaMinor)
}

function createTransactionId() {
  return `txn-${crypto.randomUUID()}`
}

function createDebtId() {
  return `debt-${crypto.randomUUID()}`
}

function createBudgetId() {
  return `budget-${crypto.randomUUID()}`
}

function createHouseholdId() {
  return `household-${crypto.randomUUID()}`
}

function createHouseholdInviteId() {
  return `invite-${crypto.randomUUID()}`
}

function createAccountId() {
  return `account-${crypto.randomUUID()}`
}

function buildDefaultCategories(): CategoryDto[] {
  return [
    {
      id: `cat-expense-housing-${crypto.randomUUID()}`,
      name: "Housing",
      kind: "EXPENSE",
      is_system: true,
    },
    {
      id: `cat-expense-groceries-${crypto.randomUUID()}`,
      name: "Groceries",
      kind: "EXPENSE",
      is_system: true,
    },
    {
      id: `cat-expense-utilities-${crypto.randomUUID()}`,
      name: "Utilities",
      kind: "EXPENSE",
      is_system: true,
    },
    {
      id: `cat-income-salary-${crypto.randomUUID()}`,
      name: "Salary",
      kind: "INCOME",
      is_system: true,
    },
    {
      id: `cat-income-side-hustle-${crypto.randomUUID()}`,
      name: "Side hustle",
      kind: "INCOME",
      is_system: true,
    },
  ]
}

function insertTransaction(
  store: MockStoreState,
  householdId: string,
  transaction: TransactionDto,
) {
  const list = store.transactionsByHousehold[householdId] ?? []
  list.unshift(transaction)
  store.transactionsByHousehold[householdId] = list
  return transaction
}

function recomputeBudgetProgress(store: MockStoreState, householdId: string) {
  const budgets = store.budgetsByHousehold[householdId] ?? []
  const transactions = store.transactionsByHousehold[householdId] ?? []
  const now = new Date()

  budgets.forEach((budget) => {
    const startDate =
      budget.period === "MONTHLY" ? startOfMonth(now) : subDays(now, 6)

    const spentMinor = transactions
      .filter((transaction) => {
        if (transaction.kind !== "EXPENSE") {
          return false
        }

        if (transaction.category_name !== budget.category_name) {
          return false
        }

        return parseISO(transaction.occurred_at_utc) >= startDate
      })
      .reduce((sum, transaction) => sum + transaction.amount_minor, 0)

    budget.spent_minor = spentMinor
    budget.remaining_minor = budget.limit_minor - spentMinor
  })
}

export function listMockHouseholdDtos() {
  return cloneValue(getStore().households)
}

export function createMockHousehold({
  name,
  currencyCode,
  role,
}: {
  name: string
  currencyCode: string
  role: HouseholdDto["role"]
}) {
  const store = getStore()
  const household: HouseholdDto = {
    id: createHouseholdId(),
    name,
    role,
    currency_code: currencyCode,
    member_count: 1,
    available_balance_minor: 0,
    month_income_minor: 0,
    month_spend_minor: 0,
  }

  store.households.unshift(household)
  store.accountsByHousehold[household.id] = []
  store.categoriesByHousehold[household.id] = buildDefaultCategories()
  store.transactionsByHousehold[household.id] = []
  store.debtsByHousehold[household.id] = []
  store.budgetsByHousehold[household.id] = []

  return cloneValue(household)
}

export function createMockHouseholdInvite({
  householdId,
  email,
  role,
  invitedByName,
}: {
  householdId: string
  email: string
  role: HouseholdInviteDto["role"]
  invitedByName: string
}) {
  const store = getStore()
  const household = ensureHousehold(store, householdId)
  const normalizedEmail = email.trim().toLowerCase()

  const existingInvite = store.householdInvites.find(
    (invite) =>
      invite.household_id === householdId &&
      invite.email.toLowerCase() === normalizedEmail &&
      invite.status === "PENDING",
  )

  if (existingInvite) {
    throw new Error("There is already a pending invite for this email.")
  }

  const invite: HouseholdInviteDto = {
    id: createHouseholdInviteId(),
    household_id: householdId,
    household_name: household.name,
    email: normalizedEmail,
    role,
    status: "PENDING",
    invited_by_name: invitedByName,
    created_at_utc: new Date().toISOString(),
    accepted_at_utc: null,
  }

  store.householdInvites.unshift(invite)

  return cloneValue(invite)
}

export function acceptMockHouseholdInvite({
  inviteId,
  email,
}: {
  inviteId: string
  email: string
}) {
  const store = getStore()
  const normalizedEmail = email.trim().toLowerCase()
  const invite = store.householdInvites.find((item) => item.id === inviteId)

  if (!invite) {
    throw new Error("Invite could not be found.")
  }

  if (invite.email.toLowerCase() !== normalizedEmail) {
    throw new Error("This invite does not belong to the active session.")
  }

  if (invite.status === "ACCEPTED") {
    return cloneValue(invite)
  }

  invite.status = "ACCEPTED"
  invite.accepted_at_utc = new Date().toISOString()

  const household = ensureHousehold(store, invite.household_id)
  household.member_count += 1

  return cloneValue(invite)
}

export function getMockAccountsByHousehold(householdId: string) {
  return cloneValue(getStore().accountsByHousehold[householdId] ?? [])
}

export function createMockAccount(input: CreateAccountRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const accounts = store.accountsByHousehold[input.householdId] ?? []

  const account: AccountDto = {
    id: createAccountId(),
    name: input.name.trim(),
    institution_name: input.institutionName.trim(),
    type: input.kind,
    currency_code: input.currencyCode,
    balance_minor: input.openingBalanceMinor,
    available_balance_minor: input.openingBalanceMinor,
    masked_number: input.maskedNumber,
    is_primary: input.isPrimary || accounts.length === 0,
    status: "ACTIVE",
    archived_at_utc: null,
    disabled_reason: null,
  }

  if (account.is_primary) {
    accounts.forEach((item) => {
      item.is_primary = false
    })
  }

  accounts.unshift(account)
  store.accountsByHousehold[input.householdId] = accounts
  adjustHouseholdMetrics(household, {
    availableDeltaMinor: input.openingBalanceMinor,
  })

  return cloneValue(account)
}

export function updateMockAccount(input: UpdateAccountRecordInput) {
  const store = getStore()
  const account = ensureAccount(store, input.householdId, input.accountId)
  const accounts = store.accountsByHousehold[input.householdId] ?? []

  if (account.status === "ARCHIVED" && input.status !== "ARCHIVED") {
    account.archived_at_utc = null
  }

  account.name = input.name.trim()
  account.institution_name = input.institutionName.trim()
  account.masked_number = input.maskedNumber
  account.status = input.status
  account.disabled_reason =
    input.status === "RESTRICTED" ? input.disabledReason : null
  account.archived_at_utc =
    input.status === "ARCHIVED" ? account.archived_at_utc ?? new Date().toISOString() : null

  if (input.isPrimary && input.status !== "ARCHIVED") {
    accounts.forEach((item) => {
      item.is_primary = item.id === account.id
    })
  } else if (account.is_primary && input.status === "ARCHIVED") {
    const replacement = accounts.find(
      (item) => item.id !== account.id && item.status !== "ARCHIVED",
    )

    account.is_primary = false

    if (replacement) {
      replacement.is_primary = true
    }
  }

  if (account.status !== "ARCHIVED" && !accounts.some((item) => item.is_primary)) {
    account.is_primary = true
  }

  if (account.status === "ARCHIVED" && account.disabled_reason === null) {
    account.disabled_reason = "Archived accounts are hidden from new finance actions."
  }

  return cloneValue(account)
}

export function getMockCategoriesByHousehold(householdId: string) {
  return cloneValue(getStore().categoriesByHousehold[householdId] ?? [])
}

export function createMockCategory({
  householdId,
  name,
  kind,
}: {
  householdId: string
  name: string
  kind: CategoryDto["kind"]
}) {
  const store = getStore()
  ensureHousehold(store, householdId)

  const categories = store.categoriesByHousehold[householdId] ?? []
  const normalizedName = name.trim().toLowerCase()
  const existingCategory = categories.find(
    (category) =>
      category.kind === kind && category.name.trim().toLowerCase() === normalizedName,
  )

  if (existingCategory) {
    throw new Error("A category with this name already exists for the selected kind.")
  }

  const category: CategoryDto = {
    id: `cat-${crypto.randomUUID()}`,
    name: name.trim(),
    kind,
    is_system: false,
  }

  categories.unshift(category)
  store.categoriesByHousehold[householdId] = categories

  return cloneValue(category)
}

export function updateMockCategory(input: UpdateCategoryRecordInput) {
  const store = getStore()
  ensureHousehold(store, input.householdId)

  const categories = store.categoriesByHousehold[input.householdId] ?? []
  const category = categories.find((item) => item.id === input.categoryId)

  if (!category) {
    throw new Error("Category not found in mock store.")
  }

  if (category.is_system) {
    throw new Error("System categories cannot be edited from the household workspace.")
  }

  const normalizedName = input.name.trim().toLowerCase()
  const existingCategory = categories.find(
    (item) =>
      item.id !== category.id &&
      item.kind === category.kind &&
      item.name.trim().toLowerCase() === normalizedName,
  )

  if (existingCategory) {
    throw new Error("A category with this name already exists for the selected kind.")
  }

  const previousName = category.name
  category.name = input.name.trim()

  const transactions = store.transactionsByHousehold[input.householdId] ?? []
  transactions.forEach((transaction) => {
    if (transaction.category_name === previousName) {
      transaction.category_name = category.name
    }
  })

  const budgets = store.budgetsByHousehold[input.householdId] ?? []
  budgets.forEach((budget) => {
    if (budget.category_id === category.id) {
      budget.category_name = category.name
    }
  })

  recomputeBudgetProgress(store, input.householdId)

  return cloneValue(category)
}

export function getMockTransactionsByHousehold(householdId: string) {
  return cloneValue(
    [...(getStore().transactionsByHousehold[householdId] ?? [])].sort((left, right) =>
      right.occurred_at_utc.localeCompare(left.occurred_at_utc),
    ),
  )
}

export function getMockDebtsByHousehold(householdId: string) {
  return cloneValue(getStore().debtsByHousehold[householdId] ?? [])
}

export function getMockBudgetsByHousehold(householdId: string) {
  recomputeBudgetProgress(getStore(), householdId)
  return cloneValue(getStore().budgetsByHousehold[householdId] ?? [])
}

export function getMockHouseholdInvitesByHousehold(householdId: string) {
  return cloneValue(
    getStore().householdInvites.filter((invite) => invite.household_id === householdId),
  )
}

export function getMockPendingInvitesByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  return cloneValue(
    getStore().householdInvites.filter(
      (invite) => invite.email.toLowerCase() === normalizedEmail && invite.status === "PENDING",
    ),
  )
}

export function getMockAnalyticsPreviewDto(
  householdId: string,
  period: "weekly" | "monthly" = "weekly",
) {
  const store = getStore()
  const household = ensureHousehold(store, householdId)
  const transactions = store.transactionsByHousehold[householdId] ?? []
  const points =
    period === "weekly"
      ? Array.from({ length: 7 }).map((_, index) => {
          const startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
          const pointDate = addDays(startDate, index)
          const incomeMinor = transactions
            .filter(
              (transaction) =>
                transaction.kind === "INCOME" &&
                format(parseISO(transaction.occurred_at_utc), "yyyy-MM-dd") ===
                  format(pointDate, "yyyy-MM-dd"),
            )
            .reduce((sum, transaction) => sum + transaction.amount_minor, 0)
          const expenseMinor = transactions
            .filter(
              (transaction) =>
                transaction.kind === "EXPENSE" &&
                format(parseISO(transaction.occurred_at_utc), "yyyy-MM-dd") ===
                  format(pointDate, "yyyy-MM-dd"),
            )
            .reduce((sum, transaction) => sum + transaction.amount_minor, 0)

          return {
            label: format(pointDate, "EEE"),
            income_minor: incomeMinor,
            expense_minor: expenseMinor,
          }
        })
      : Array.from({ length: 4 }).map((_, index) => {
          const weekStart = subDays(
            startOfWeek(new Date(), { weekStartsOn: 1 }),
            (3 - index) * 7,
          )
          const weekEnd = addDays(weekStart, 6)
          const incomeMinor = transactions
            .filter((transaction) => {
              const occurredAt = parseISO(transaction.occurred_at_utc)

              return (
                transaction.kind === "INCOME" &&
                occurredAt >= weekStart &&
                occurredAt <= weekEnd
              )
            })
            .reduce((sum, transaction) => sum + transaction.amount_minor, 0)
          const expenseMinor = transactions
            .filter((transaction) => {
              const occurredAt = parseISO(transaction.occurred_at_utc)

              return (
                transaction.kind === "EXPENSE" &&
                occurredAt >= weekStart &&
                occurredAt <= weekEnd
              )
            })
            .reduce((sum, transaction) => sum + transaction.amount_minor, 0)

          return {
            label: `W${index + 1}`,
            income_minor: incomeMinor,
            expense_minor: expenseMinor,
          }
        })

  return {
    period,
    currency_code: household.currency_code,
    current_balance_minor: household.available_balance_minor,
    income_minor: household.month_income_minor,
    expense_minor: household.month_spend_minor,
    net_change_minor: household.month_income_minor - household.month_spend_minor,
    points,
  }
}

export function runWithIdempotency<TResult>(
  idempotencyKey: string,
  factory: () => TResult,
) {
  const store = getStore()

  if (store.idempotencyResults.has(idempotencyKey)) {
    return cloneValue(store.idempotencyResults.get(idempotencyKey) as TResult)
  }

  const result = factory()
  store.idempotencyResults.set(idempotencyKey, cloneValue(result))
  return cloneValue(result)
}

export function createMockExpense(input: CreateExpenseRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const account = ensureAccount(store, input.householdId, input.accountId)
  const category = ensureCategory(store, input.householdId, input.categoryId)

  assertActiveAccount(account)

  if (category.kind !== "EXPENSE") {
    throw new Error("Selected category does not support expenses.")
  }

  if (account.available_balance_minor < input.amountMinor) {
    throw new Error("This account does not have enough available balance.")
  }

  account.balance_minor -= input.amountMinor
  account.available_balance_minor -= input.amountMinor
  adjustHouseholdMetrics(household, {
    availableDeltaMinor: -input.amountMinor,
    spendDeltaMinor: input.amountMinor,
  })

  const transaction = insertTransaction(store, input.householdId, {
    id: createTransactionId(),
    kind: "EXPENSE",
    description: input.description ?? input.note ?? category.name,
    category_name: category.name,
    account_name: account.name,
    occurred_at_utc: input.occurredAtUtc,
    currency_code: account.currency_code,
    amount_minor: input.amountMinor,
    status: "POSTED",
  })

  recomputeBudgetProgress(store, input.householdId)
  return transaction
}

export function createMockIncome(input: CreateIncomeRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const account = ensureAccount(store, input.householdId, input.accountId)
  const category = ensureCategory(store, input.householdId, input.categoryId)

  assertActiveAccount(account)

  if (category.kind !== "INCOME") {
    throw new Error("Selected category does not support incomes.")
  }

  account.balance_minor += input.amountMinor
  account.available_balance_minor += input.amountMinor
  adjustHouseholdMetrics(household, {
    availableDeltaMinor: input.amountMinor,
    incomeDeltaMinor: input.amountMinor,
  })

  return insertTransaction(store, input.householdId, {
    id: createTransactionId(),
    kind: "INCOME",
    description: input.description ?? category.name,
    category_name: category.name,
    account_name: account.name,
    occurred_at_utc: input.occurredAtUtc,
    currency_code: account.currency_code,
    amount_minor: input.amountMinor,
    status: "POSTED",
  })
}

export function createMockTransfer(input: CreateTransferRecordInput) {
  const store = getStore()
  const fromAccount = ensureAccount(store, input.householdId, input.fromAccountId)
  const toAccount = ensureAccount(store, input.householdId, input.toAccountId)

  assertActiveAccount(fromAccount)
  assertActiveAccount(toAccount)

  if (fromAccount.id === toAccount.id) {
    throw new Error("Transfers require a different destination account.")
  }

  if (fromAccount.currency_code !== toAccount.currency_code) {
    throw new Error("Cross-currency transfer support is not available in this phase.")
  }

  if (fromAccount.available_balance_minor < input.amountMinor) {
    throw new Error("Source account does not have enough available balance.")
  }

  fromAccount.balance_minor -= input.amountMinor
  fromAccount.available_balance_minor -= input.amountMinor
  toAccount.balance_minor += input.amountMinor
  toAccount.available_balance_minor += input.amountMinor

  return insertTransaction(store, input.householdId, {
    id: createTransactionId(),
    kind: "TRANSFER",
    description: input.note ?? `${fromAccount.name} to ${toAccount.name}`,
    category_name: "Internal transfer",
    account_name: `${fromAccount.name} → ${toAccount.name}`,
    occurred_at_utc: input.occurredAtUtc,
    currency_code: fromAccount.currency_code,
    amount_minor: input.amountMinor,
    status: "POSTED",
  })
}

export function createMockDebt(input: CreateDebtRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const debts = store.debtsByHousehold[input.householdId] ?? []

  const debt: DebtDto = {
    id: createDebtId(),
    counterparty_name: input.counterpartyName,
    direction: input.direction,
    currency_code: household.currency_code,
    original_amount_minor: input.amountMinor,
    remaining_amount_minor: input.amountMinor,
    description: input.description,
    created_at_utc: new Date().toISOString(),
    due_at_utc: input.dueAtUtc,
    status: "OPEN",
  }

  debts.unshift(debt)
  store.debtsByHousehold[input.householdId] = debts

  return debt
}

export function settleMockDebt(input: SettleDebtRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const debt = ensureDebt(store, input.householdId, input.debtId)
  const account = ensureAccount(store, input.householdId, input.accountId)

  assertActiveAccount(account)

  if (debt.status === "SETTLED" || debt.remaining_amount_minor === 0) {
    throw new Error("This debt has already been settled.")
  }

  if (input.amountMinor > debt.remaining_amount_minor) {
    throw new Error("Settlement amount cannot exceed the remaining debt amount.")
  }

  if (debt.direction === "PAYABLE" && account.available_balance_minor < input.amountMinor) {
    throw new Error("Selected account does not have enough balance for this settlement.")
  }

  debt.remaining_amount_minor -= input.amountMinor
  debt.status =
    debt.remaining_amount_minor === 0
      ? "SETTLED"
      : debt.remaining_amount_minor < debt.original_amount_minor
        ? "PARTIAL"
        : "OPEN"

  const transactionKind = debt.direction === "PAYABLE" ? "EXPENSE" : "INCOME"

  if (debt.direction === "PAYABLE") {
    account.balance_minor -= input.amountMinor
    account.available_balance_minor -= input.amountMinor
    adjustHouseholdMetrics(household, {
      availableDeltaMinor: -input.amountMinor,
      spendDeltaMinor: input.amountMinor,
    })
  } else {
    account.balance_minor += input.amountMinor
    account.available_balance_minor += input.amountMinor
    adjustHouseholdMetrics(household, {
      availableDeltaMinor: input.amountMinor,
      incomeDeltaMinor: input.amountMinor,
    })
  }

  const transaction = insertTransaction(store, input.householdId, {
    id: createTransactionId(),
    kind: transactionKind,
    description: input.note ?? `Debt settlement · ${debt.counterparty_name}`,
    category_name: "Debt settlement",
    account_name: account.name,
    occurred_at_utc: input.occurredAtUtc,
    currency_code: account.currency_code,
    amount_minor: input.amountMinor,
    status: "POSTED",
  })

  recomputeBudgetProgress(store, input.householdId)

  return {
    debt,
    transaction,
  }
}

export function upsertMockBudget(input: UpsertBudgetRecordInput) {
  const store = getStore()
  const household = ensureHousehold(store, input.householdId)
  const category = ensureCategory(store, input.householdId, input.categoryId)

  if (category.kind !== "EXPENSE") {
    throw new Error("Budgets are only available for expense categories in this phase.")
  }

  const budgets = store.budgetsByHousehold[input.householdId] ?? []
  const existingBudget = budgets.find(
    (budget) =>
      budget.category_id === input.categoryId && budget.period === input.period,
  )

  if (existingBudget) {
    existingBudget.limit_minor = input.limitMinor
    existingBudget.effective_from_local_date = input.effectiveFromLocalDate
  } else {
    budgets.unshift({
      id: createBudgetId(),
      category_id: input.categoryId,
      category_name: category.name,
      period: input.period,
      currency_code: household.currency_code,
      limit_minor: input.limitMinor,
      spent_minor: 0,
      remaining_minor: input.limitMinor,
      effective_from_local_date: input.effectiveFromLocalDate,
    })
    store.budgetsByHousehold[input.householdId] = budgets
  }

  recomputeBudgetProgress(store, input.householdId)

  return cloneValue(
    budgets.find(
      (budget) =>
        budget.category_id === input.categoryId && budget.period === input.period,
    ),
  )
}
