import { z } from "zod"

export const updateAccountRequestSchema = z
  .object({
    name: z.string().trim().min(2, "validation.accounts.name.min"),
    institutionName: z.string().trim().min(2, "validation.accounts.institutionName.min"),
    maskedNumber: z
      .string()
      .trim()
      .max(4, "validation.accounts.maskedNumber.max")
      .regex(/^\d{0,4}$/, "validation.accounts.maskedNumber.digits")
      .nullable(),
    isPrimary: z.boolean(),
    status: z.enum(["ACTIVE", "RESTRICTED", "ARCHIVED"]),
    disabledReason: z.string().trim().max(160).nullable(),
  })
  .superRefine((value, context) => {
    if (value.status === "RESTRICTED" && !value.disabledReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["disabledReason"],
        message: "validation.accounts.disabledReason.required",
      })
    }
  })

export const updateAccountFormSchema = z
  .object({
    name: z.string().trim().min(2, "validation.accounts.name.min"),
    institutionName: z.string().trim().min(2, "validation.accounts.institutionName.min"),
    maskedNumber: z
      .string()
      .trim()
      .max(4, "validation.accounts.maskedNumber.max")
      .regex(/^\d{0,4}$/, "validation.accounts.maskedNumber.digits")
      .or(z.literal("")),
    isPrimary: z.enum(["yes", "no"]),
    status: z.enum(["ACTIVE", "RESTRICTED", "ARCHIVED"]),
    disabledReason: z.string().trim().max(160).optional(),
  })
  .superRefine((value, context) => {
    if (value.status === "RESTRICTED" && !value.disabledReason?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["disabledReason"],
        message: "validation.accounts.disabledReason.required",
      })
    }
  })

export type UpdateAccountRequest = z.infer<typeof updateAccountRequestSchema>
export type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>
