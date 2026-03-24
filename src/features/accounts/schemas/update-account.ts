import { z } from "zod"

export const updateAccountRequestSchema = z
  .object({
    name: z.string().trim().min(2, "Enter an account name."),
    institutionName: z.string().trim().min(2, "Enter an institution or provider."),
    maskedNumber: z
      .string()
      .trim()
      .max(4, "Use up to the last four digits.")
      .regex(/^\d{0,4}$/, "Use digits only.")
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
        message: "Restricted accounts need a short reason.",
      })
    }
  })

export const updateAccountFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter an account name."),
    institutionName: z.string().trim().min(2, "Enter an institution or provider."),
    maskedNumber: z
      .string()
      .trim()
      .max(4, "Use up to the last four digits.")
      .regex(/^\d{0,4}$/, "Use digits only.")
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
        message: "Restricted accounts need a short reason.",
      })
    }
  })

export type UpdateAccountRequest = z.infer<typeof updateAccountRequestSchema>
export type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>
