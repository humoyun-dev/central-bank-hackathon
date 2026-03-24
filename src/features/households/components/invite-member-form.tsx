"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormActions } from "@/components/shared/forms/form-actions"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createHouseholdInvite } from "@/features/households/api/create-household-invite"
import {
  createHouseholdInviteRequestSchema,
  type CreateHouseholdInviteRequest,
} from "@/features/households/schemas/create-household-invite"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"

export function InviteMemberForm({ householdId }: { householdId: string }) {
  const router = useRouter()
  const form = useForm<CreateHouseholdInviteRequest>({
    resolver: zodResolver(createHouseholdInviteRequestSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateHouseholdInviteRequest) =>
      createHouseholdInvite(householdId, values),
    onSuccess: () => {
      toast.success("Invite sent")
      form.reset({
        email: "",
        role: "MEMBER",
      })
      router.refresh()
    },
  })

  async function onSubmit(values: CreateHouseholdInviteRequest) {
    form.clearErrors()

    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      applyProblemDetailsToForm(error, form.setError)
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormSection
        title="Invite member"
        description="Provision a role-scoped household invite that can be accepted from the selection surface."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              {...form.register("email")}
              placeholder="member@atlas.house"
            />
            <FormFieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="invite-role" className="text-sm font-medium text-foreground">
              Role
            </label>
            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="invite-role" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldError message={form.formState.errors.role?.message} />
          </div>
        </div>
      </FormSection>

      <InlineFormError message={form.formState.errors.root?.message} />
      <FormActions
        isSubmitting={mutation.isPending}
        submitLabel="Send invite"
        pendingLabel="Sending..."
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />
    </form>
  )
}
