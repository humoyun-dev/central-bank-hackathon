import { z } from "zod"

export const createAccountRequestSchema = z.object({
  name: z.string().trim().min(2, "validation.accounts.name.min"),
  institutionName: z.string().trim().min(2, "validation.accounts.institutionName.min"),
  kind: z.enum(["BANK", "CARD", "CASH"]),
  currencyCode: z.string().trim().length(3, "validation.accounts.currencyCode.length"),
  openingBalanceMinor: z.number().int(),
  maskedNumber: z
    .string()
    .trim()
    .max(4, "validation.accounts.maskedNumber.max")
    .regex(/^\d{0,4}$/, "validation.accounts.maskedNumber.digits")
    .nullable(),
  isPrimary: z.boolean(),
})

export const createAccountFormSchema = z.object({
  name: z.string().trim().min(2, "validation.accounts.name.min"),
  institutionName: z.string().trim().min(2, "validation.accounts.institutionName.min"),
  kind: z.enum(["BANK", "CARD", "CASH"]),
  currencyCode: z.string().trim().length(3, "validation.accounts.currencyCode.length"),
  openingBalance: z.string().trim().min(1, "validation.accounts.openingBalance.required"),
  maskedNumber: z
    .string()
    .trim()
    .max(4, "validation.accounts.maskedNumber.max")
    .regex(/^\d{0,4}$/, "validation.accounts.maskedNumber.digits")
    .or(z.literal("")),
  isPrimary: z.enum(["yes", "no"]),
})

export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>
export type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>
