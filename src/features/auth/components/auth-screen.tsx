"use client"

import { ShieldCheck, WalletCards } from "lucide-react"
import { useTranslations } from "next-intl"
import { AppLogo } from "@/components/shared/app-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthForm } from "@/features/auth/components/auth-form"
import { Link } from "@/i18n/navigation"
import { publicEnv } from "@/services/config/public-env"

interface AuthScreenProps {
  mode: "login" | "register"
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const t = useTranslations("auth")
  const isLogin = mode === "login"

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="space-y-6">
        <AppLogo />
        <div className="space-y-3">
          <Badge variant="primary">{t("serverOwned")}</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
            {isLogin
              ? t("loginTitle", { appName: publicEnv.appName })
              : t("registerTitle")}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {t("authDescription")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="bg-card/85">
            <CardContent className="space-y-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{t("bffReadyTitle")}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("bffReadyDescription")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/85">
            <CardContent className="space-y-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <WalletCards className="size-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{t("demoWorkspaceTitle")}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("demoWorkspaceDescription")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="bg-card/94">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {isLogin ? t("welcomeBack") : t("setUpAccess")}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {isLogin ? t("loginSub") : t("registerSub")}
            </p>
          </div>
          <AuthForm mode={mode} />
          <div className="space-y-3 rounded-[var(--radius-md)] border border-border/70 bg-muted/50 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {t("inspectShell")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/select-household">{t("openDemo")}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={isLogin ? "/register" : "/login"}>
                  {isLogin ? t("goToRegister") : t("goToLogin")}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
