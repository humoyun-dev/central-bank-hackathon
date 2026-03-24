import { z } from "zod"

export const dashboardAnalyticsPointDtoSchema = z.object({
  label: z.string(),
  income_minor: z.number().int().nonnegative(),
  expense_minor: z.number().int().nonnegative(),
})

export const dashboardAnalyticsPreviewDtoSchema = z.object({
  period: z.enum(["weekly", "monthly"]),
  currency_code: z.string().length(3),
  current_balance_minor: z.number().int(),
  income_minor: z.number().int().nonnegative(),
  expense_minor: z.number().int().nonnegative(),
  net_change_minor: z.number().int(),
  points: z.array(dashboardAnalyticsPointDtoSchema).min(1),
})

export type DashboardAnalyticsPreviewDto = z.infer<
  typeof dashboardAnalyticsPreviewDtoSchema
>
