"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { FormActions } from "@/components/shared/forms/form-actions"
import { AmountField } from "@/components/shared/forms/amount-field"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createAccount } from "@/features/accounts/api/create-account"
import { updateAccount } from "@/features/accounts/api/update-account"
import type { Account } from "@/features/accounts/types/account"
import {
  createAccountFormSchema,
  type CreateAccountFormValues,
} from "@/features/accounts/schemas/create-account"
import {
  updateAccountFormSchema,
  type UpdateAccountFormValues,
} from "@/features/accounts/schemas/update-account"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { useHouseholdMutation } from "@/features/mutations/hooks/use-household-mutation"
import { parseMoneyToMinor } from "@/lib/format/money"
import { queryKeys } from "@/lib/query-keys"

function getCreateDefaults(currencyCode: string): CreateAccountFormValues {
  return {
    name: "",
    institutionName: "",
    kind: "BANK",
    currencyCode,
    openingBalance: "0.00",
    maskedNumber: "",
    isPrimary: "no",
  }
}

function getUpdateDefaults(account: Account): UpdateAccountFormValues {
  return {
    name: account.name,
    institutionName: account.institutionName,
    maskedNumber: account.maskedNumber ?? "",
    isPrimary: account.isPrimary ? "yes" : "no",
    status: account.status,
    disabledReason: account.disabledReason ?? "",
  }
}

function CreateAccountFormPanel({
  householdId,
  currencyCode,
  onCancel,
  onSuccess,
}: {
  householdId: string
  currencyCode: string
  onCancel: () => void
  onSuccess: () => void
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: getCreateDefaults(currencyCode),
  })

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof createAccount>[1]) =>
      createAccount(householdId, payload),
    invalidateKeys: [
      queryKeys.household(householdId),
      queryKeys.accounts(householdId),
    ],
    successMessage: "Account created",
    idempotencyScope: "account-create",
    onSuccess: () => {
      form.reset(getCreateDefaults(currencyCode))
      setFormError("")
      onSuccess()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    try {
      await mutation.mutateAsync({
        name: values.name.trim(),
        institutionName: values.institutionName.trim(),
        kind: values.kind,
        currencyCode: values.currencyCode.trim().toUpperCase(),
        openingBalanceMinor: parseMoneyToMinor(values.openingBalance),
        maskedNumber: values.maskedNumber.trim() ? values.maskedNumber.trim() : null,
        isPrimary: values.isPrimary === "yes",
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title="Account setup"
        description="Account surfaces stay household-scoped and later sync metadata can attach without reshaping this form."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-name">Account name</Label>
            <Input
              id="account-name"
              placeholder="Operating Account"
              disabled={mutation.isPending}
              {...form.register("name")}
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-institution">Institution</Label>
            <Input
              id="account-institution"
              placeholder="Mercury Private"
              disabled={mutation.isPending}
              {...form.register("institutionName")}
            />
            <FormFieldError message={form.formState.errors.institutionName?.message} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="kind"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="account-kind">Kind</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="account-kind" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose account kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">Bank</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="account-currency">Currency</Label>
            <Input
              id="account-currency"
              maxLength={3}
              disabled={mutation.isPending}
              {...form.register("currencyCode")}
            />
            <FormFieldError message={form.formState.errors.currencyCode?.message} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-masked-number">Last four digits</Label>
            <Input
              id="account-masked-number"
              placeholder="4821"
              disabled={mutation.isPending}
              {...form.register("maskedNumber")}
            />
            <FormFieldError message={form.formState.errors.maskedNumber?.message} />
          </div>
          <Controller
            control={form.control}
            name="isPrimary"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="account-primary">Primary account</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="account-primary" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose primary state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Keep as secondary</SelectItem>
                    <SelectItem value="yes">Set as primary</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
      </FormSection>
      <FormSection
        title="Opening balance"
        description="Balances are entered in decimal form and normalized to minor units before submit."
      >
        <AmountField
          control={form.control}
          name="openingBalance"
          label="Opening balance"
          disabled={mutation.isPending}
        />
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Create account"
        pendingLabel="Creating..."
      />
    </form>
  )
}

function EditAccountFormPanel({
  householdId,
  account,
  onCancel,
  onSuccess,
}: {
  householdId: string
  account: Account
  onCancel: () => void
  onSuccess: () => void
}) {
  const [formError, setFormError] = useState("")
  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountFormSchema),
    defaultValues: getUpdateDefaults(account),
  })
  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  })

  useEffect(() => {
    form.reset(getUpdateDefaults(account))
  }, [account, form])

  const mutation = useHouseholdMutation({
    mutationFn: (payload: Parameters<typeof updateAccount>[2]) =>
      updateAccount(householdId, account.id, payload),
    invalidateKeys: [
      queryKeys.household(householdId),
      queryKeys.accounts(householdId),
    ],
    successMessage: "Account updated",
    idempotencyScope: "account-update",
    onSuccess: () => {
      form.reset(getUpdateDefaults(account))
      setFormError("")
      onSuccess()
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError("")

    try {
      await mutation.mutateAsync({
        name: values.name.trim(),
        institutionName: values.institutionName.trim(),
        maskedNumber: values.maskedNumber.trim() ? values.maskedNumber.trim() : null,
        isPrimary: values.isPrimary === "yes",
        status: values.status,
        disabledReason:
          values.status === "RESTRICTED" && values.disabledReason?.trim()
            ? values.disabledReason.trim()
            : null,
      })
    } catch (error) {
      setFormError(applyProblemDetailsToForm(error, form.setError))
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InlineFormError message={formError} />
      <FormSection
        title="Account settings"
        description="Update labels, primary placement, and availability state without leaving the account workspace."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-name">Account name</Label>
            <Input
              id="account-name"
              placeholder="Operating Account"
              disabled={mutation.isPending}
              {...form.register("name")}
            />
            <FormFieldError message={form.formState.errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-institution">Institution</Label>
            <Input
              id="account-institution"
              placeholder="Mercury Private"
              disabled={mutation.isPending}
              {...form.register("institutionName")}
            />
            <FormFieldError message={form.formState.errors.institutionName?.message} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-masked-number">Last four digits</Label>
            <Input
              id="account-masked-number"
              placeholder="4821"
              disabled={mutation.isPending}
              {...form.register("maskedNumber")}
            />
            <FormFieldError message={form.formState.errors.maskedNumber?.message} />
          </div>
          <Controller
            control={form.control}
            name="isPrimary"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="account-primary">Primary account</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="account-primary" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose primary state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Keep as secondary</SelectItem>
                    <SelectItem value="yes">Set as primary</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
      </FormSection>
      <FormSection
        title="Availability"
        description="Archive or restrict accounts so downstream finance actions stay accurate."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="account-status">Status</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id="account-status" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose account status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="RESTRICTED">Restricted</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldState.error?.message} />
              </div>
            )}
          />
          {selectedStatus === "RESTRICTED" ? (
            <div className="space-y-2">
              <Label htmlFor="account-disabled-reason">Restriction reason</Label>
              <Input
                id="account-disabled-reason"
                placeholder="Verification pending"
                disabled={mutation.isPending}
                {...form.register("disabledReason")}
              />
              <FormFieldError message={form.formState.errors.disabledReason?.message} />
            </div>
          ) : null}
        </div>
      </FormSection>
      <FormActions
        isSubmitting={mutation.isPending}
        onCancel={onCancel}
        submitLabel="Save account"
        pendingLabel="Saving..."
      />
    </form>
  )
}

export function AccountForm({
  householdId,
  currencyCode,
  account,
  onCancel,
  onSuccess,
}: {
  householdId: string
  currencyCode: string
  account?: Account | undefined
  onCancel: () => void
  onSuccess: () => void
}) {
  if (account) {
    return (
      <EditAccountFormPanel
        householdId={householdId}
        account={account}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <CreateAccountFormPanel
      householdId={householdId}
      currencyCode={currencyCode}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  )
}
