"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle, LockKeyhole, Mail, UserRound, WalletCards } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { z } from "zod"
import { FormActions } from "@/components/shared/forms/form-actions"
import { FormFieldError } from "@/components/shared/forms/form-field-error"
import { FormSection } from "@/components/shared/forms/form-section"
import { InlineFormError } from "@/components/shared/forms/inline-form-error"
import { Input } from "@/components/ui/input"
import { applyProblemDetailsToForm } from "@/features/mutations/lib/form-errors"
import { login } from "@/features/auth/api/login"
import { register } from "@/features/auth/api/register"
import { loginRequestSchema } from "@/features/auth/schemas/login-request"
import { registerRequestSchema } from "@/features/auth/schemas/register-request"
import { Link, useRouter } from "@/i18n/navigation"

const loginFormSchema = loginRequestSchema

const registerFormSchema = registerRequestSchema

type LoginFormValues = z.infer<typeof loginFormSchema>
type RegisterFormValues = z.infer<typeof registerFormSchema>

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("auth")
  const router = useRouter()
  const isLogin = mode === "login"
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "atlas@centralbank.app",
      password: "Atlas12345",
    },
  })
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "Atlas Owner",
      email: "atlas@centralbank.app",
      password: "Atlas12345",
      householdName: "Atlas Household",
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues | RegisterFormValues) =>
      isLogin ? login(values as LoginFormValues) : register(values as RegisterFormValues),
    onSuccess: (session) => {
      if (isLogin) {
        loginForm.reset()
      } else {
        registerForm.reset()
      }
      const nextPath =
        session.memberships.length === 1 && session.defaultHouseholdId
          ? `/${session.defaultHouseholdId}`
          : "/select-household"
      router.push(nextPath)
      router.refresh()
    },
  })

  async function onLoginSubmit(values: LoginFormValues) {
    loginForm.clearErrors()

    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      applyProblemDetailsToForm(error, loginForm.setError)
    }
  }

  async function onRegisterSubmit(values: RegisterFormValues) {
    registerForm.clearErrors()

    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      applyProblemDetailsToForm(error, registerForm.setError)
    }
  }

  if (isLogin) {
    return (
      <form
        className="space-y-5"
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        noValidate
      >
        <FormSection
          title={t("signInTitle")}
          description={t("signInDescription")}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register("email")}
                  placeholder={t("emailPlaceholder")}
                  className="pl-9"
                />
              </div>
              <FormFieldError message={loginForm.formState.errors.email?.message} />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                  placeholder={t("passwordPlaceholder")}
                  className="pl-9"
                />
              </div>
              <FormFieldError message={loginForm.formState.errors.password?.message} />
            </div>
          </div>
        </FormSection>

        <InlineFormError message={loginForm.formState.errors.root?.message} />
        <FormActions
          isSubmitting={mutation.isPending}
          submitLabel={t("signInButton")}
          pendingLabel={t("signingIn")}
          submitAdornment={
            mutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : undefined
          }
        />
        <div className="rounded-[1.25rem] border border-border/70 bg-muted/50 p-4 text-sm text-muted-foreground">
          {t.rich("demoCredentials", {
            email: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
            password: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
          })}
        </div>
      </form>
    )
  }

  return (
    <form
      className="space-y-5"
      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
      noValidate
    >
      <FormSection
        title={t("identityTitle")}
        description={t("identityDescription")}
      >
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            {t("fullNameLabel")}
          </label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="fullName"
              {...registerForm.register("fullName")}
              placeholder={t("fullNamePlaceholder")}
              className="pl-9"
            />
          </div>
          <FormFieldError message={registerForm.formState.errors.fullName?.message} />
        </div>
      </FormSection>

      <FormSection
        title={t("credentialSetupTitle")}
        description={t("credentialSetupDescription")}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-foreground">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            <Input
              id="register-email"
              type="email"
              {...registerForm.register("email")}
              placeholder={t("registerEmailPlaceholder")}
              className="pl-9"
            />
            </div>
            <FormFieldError message={registerForm.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="text-sm font-medium text-foreground">
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="register-password"
                type="password"
                {...registerForm.register("password")}
                placeholder={t("passwordPlaceholder")}
                className="pl-9"
              />
            </div>
            <FormFieldError message={registerForm.formState.errors.password?.message} />
          </div>
        </div>
      </FormSection>

      <FormSection
        title={t("initialHouseholdTitle")}
        description={t("initialHouseholdDescription")}
      >
        <div className="space-y-2">
          <label htmlFor="householdName" className="text-sm font-medium text-foreground">
            {t("householdNameLabel")}
          </label>
          <div className="relative">
            <WalletCards
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="householdName"
              {...registerForm.register("householdName")}
              placeholder={t("householdNamePlaceholder")}
              className="pl-9"
            />
          </div>
          <FormFieldError message={registerForm.formState.errors.householdName?.message} />
        </div>
      </FormSection>

      <InlineFormError message={registerForm.formState.errors.root?.message} />
      <FormActions
        isSubmitting={mutation.isPending}
        submitLabel={t("createAccountButton")}
        pendingLabel={t("creatingWorkspace")}
        submitAdornment={
          mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : undefined
        }
      />

      <div className="rounded-[1.25rem] border border-border/70 bg-muted/50 p-4 text-sm text-muted-foreground">
        {t("alreadyHaveAccess")}{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          {t("returnToLogin")}
        </Link>
      </div>
    </form>
  )
}
