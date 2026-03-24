import "server-only"

import {
  eachDayOfInterval,
  format,
  isAfter,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns"
import { getTransactions } from "@/features/transactions/api/get-transactions"
import type { AnalyticsPeriod, AnalyticsSnapshot } from "@/features/analytics/types/analytics"
import { formatMonthDayByLocale, formatWeekdayDayByLocale } from "@/lib/format/date"

const periodToDays: Record<AnalyticsPeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

export async function getAnalyticsSnapshot(
  householdId: string,
  period: AnalyticsPeriod,
  locale?: string,
): Promise<AnalyticsSnapshot> {
  const transactions = await getTransactions(householdId)
  const periodDays = periodToDays[period]
  const startDate = startOfDay(subDays(new Date(), periodDays - 1))

  const filteredTransactions = transactions.filter((transaction) =>
    isAfter(parseISO(transaction.occurredAtUtc), startDate),
  )

  const incomeMinor = filteredTransactions
    .filter((transaction) => transaction.kind === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0)
  const expenseMinor = filteredTransactions
    .filter((transaction) => transaction.kind === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amountMinor, 0)

  const trendMap = new Map<string, { incomeMinor: number; expenseMinor: number }>()

  for (const day of eachDayOfInterval({ start: startDate, end: new Date() })) {
    trendMap.set(format(day, "yyyy-MM-dd"), { incomeMinor: 0, expenseMinor: 0 })
  }

  filteredTransactions.forEach((transaction) => {
    const dayKey = format(parseISO(transaction.occurredAtUtc), "yyyy-MM-dd")
    const existingPoint = trendMap.get(dayKey)

    if (!existingPoint) {
      return
    }

    if (transaction.kind === "INCOME") {
      existingPoint.incomeMinor += transaction.amountMinor
    }

    if (transaction.kind === "EXPENSE") {
      existingPoint.expenseMinor += transaction.amountMinor
    }
  })

  const trend = Array.from(trendMap.entries()).map(([date, point]) => ({
    date,
    label:
      period === "90d"
        ? formatMonthDayByLocale(parseISO(`${date}T00:00:00.000Z`), locale)
        : formatWeekdayDayByLocale(parseISO(`${date}T00:00:00.000Z`), locale),
    incomeMinor: point.incomeMinor,
    expenseMinor: point.expenseMinor,
  }))

  const categoryMap = new Map<string, { spendMinor: number; transactionCount: number }>()

  filteredTransactions
    .filter((transaction) => transaction.kind === "EXPENSE")
    .forEach((transaction) => {
      const existingCategory = categoryMap.get(transaction.categoryName) ?? {
        spendMinor: 0,
        transactionCount: 0,
      }
      existingCategory.spendMinor += transaction.amountMinor
      existingCategory.transactionCount += 1
      categoryMap.set(transaction.categoryName, existingCategory)
    })

  const categories = Array.from(categoryMap.entries())
    .map(([categoryName, category]) => ({
      categoryName,
      spendMinor: category.spendMinor,
      transactionCount: category.transactionCount,
    }))
    .sort((left, right) => right.spendMinor - left.spendMinor)
    .slice(0, 6)

  const calendar = Array.from(trendMap.entries())
    .slice(-35)
    .map(([date, point]) => ({
      date,
      label: formatWeekdayDayByLocale(parseISO(`${date}T00:00:00.000Z`), locale),
      expenseMinor: point.expenseMinor,
      incomeMinor: point.incomeMinor,
    }))

  return {
    period,
    currencyCode: filteredTransactions[0]?.currencyCode ?? "USD",
    summary: {
      incomeMinor,
      expenseMinor,
      netChangeMinor: incomeMinor - expenseMinor,
      transactionCount: filteredTransactions.length,
    },
    trend,
    categories,
    calendar,
  }
}
