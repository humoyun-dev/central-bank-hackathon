"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import { useTranslations } from "next-intl"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { StatusBadge } from "@/components/shared/status-badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Account } from "@/features/accounts/types/account"

interface AccountSelectProps<TFieldValues extends FieldValues> {
  accounts: Account[]
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  disabled?: boolean
  excludeAccountId?: string
}

export function AccountSelect<TFieldValues extends FieldValues>({
  accounts,
  control,
  name,
  label = "Account",
  description,
  disabled = false,
  excludeAccountId,
}: AccountSelectProps<TFieldValues>) {
  const t = useTranslations("forms.common")
  const tAccount = useTranslations("accounts.common")
  const options = accounts.filter((account) => account.id !== excludeAccountId)
  const statusLabels = {
    ACTIVE: tAccount("status.active"),
    RESTRICTED: tAccount("status.restricted"),
    ARCHIVED: tAccount("status.archived"),
  } as const

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={String(name)}>{label === "Account" ? t("accountLabel") : label}</Label>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={String(name)} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={t("accountPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {options.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{account.name}</span>
                    {account.status !== "ACTIVE" ? (
                      <StatusBadge
                        label={statusLabels[account.status]}
                        tone={account.status === "RESTRICTED" ? "warning" : "neutral"}
                      />
                    ) : null}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormFieldError message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}
