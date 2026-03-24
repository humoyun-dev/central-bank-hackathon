import { z } from "zod"

export const createAccountRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter an account name."),
  institutionName: z.string().trim().min(2, "Enter an institution or provider."),
  kind: z.enum(["BANK", "CARD", "CASH"]),
  currencyCode: z.string().trim().length(3, "Use a 3-letter currency code."),
  openingBalanceMinor: z.number().int(),
  maskedNumber: z
    .string()
    .trim()
    .max(4, "Use up to the last four digits.")
    .regex(/^\d{0,4}$/, "Use digits only.")
    .nullable(),
  isPrimary: z.boolean(),
})

export const createAccountFormSchema = z.object({
  name: z.string().trim().min(2, "Enter an account name."),
  institutionName: z.string().trim().min(2, "Enter an institution or provider."),
  kind: z.enum(["BANK", "CARD", "CASH"]),
  currencyCode: z.string().trim().length(3, "Use a 3-letter currency code."),
  openingBalance: z.string().trim().min(1, "Enter an opening balance."),
  maskedNumber: z
    .string()
    .trim()
    .max(4, "Use up to the last four digits.")
    .regex(/^\d{0,4}$/, "Use digits only.")
    .or(z.literal("")),
  isPrimary: z.enum(["yes", "no"]),
})

export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>
export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
