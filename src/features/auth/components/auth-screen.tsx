import Link from "next/link"
import { ShieldCheck, WalletCards } from "lucide-react"
import { AppLogo } from "@/components/shared/app-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { publicEnv } from "@/services/config/public-env"

interface AuthScreenProps {
  mode: "login" | "register"
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const isLogin = mode === "login"

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="space-y-6">
        <AppLogo />
        <div className="space-y-3">
          <Badge variant="primary">Server-owned auth boundary</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
            {isLogin
              ? `Securely enter ${publicEnv.appName}`
              : `Create a household workspace without leaking tokens to the browser`}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            This quick-start phase focuses on shell, routing, and typed boundaries.
            Auth screens are production-shaped and ready for BFF wiring in the next
            delivery step.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="bg-card/85">
            <CardContent className="space-y-3 pt-6">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold">BFF-ready sign in</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Form surfaces are ready for secure cookie session exchange and
                  field-level validation.
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
                <h2 className="text-base font-semibold">Demo workspace enabled</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Use mocked household data to validate app shell, loading states, and
                  route composition immediately.
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
              {isLogin ? "Welcome back" : "Set up access"}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {isLogin
                ? "The fields below show the intended secure sign-in surface."
                : "The registration flow will attach to BFF routes after auth phase work begins."}
            </p>
          </div>
          <form className="space-y-4">
            {!isLogin ? (
              <div className="space-y-2">
                <label htmlFor="full-name" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <Input id="full-name" name="full-name" placeholder="Alex Johnson" />
              </div>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="alex@atlas.house" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Secure password"
              />
            </div>
            {!isLogin ? (
              <div className="space-y-2">
                <label htmlFor="household-name" className="text-sm font-medium text-foreground">
                  Household name
                </label>
                <Input
                  id="household-name"
                  name="household-name"
                  placeholder="Atlas Household"
                />
              </div>
            ) : null}
            <Button type="button" className="w-full" disabled>
              {isLogin ? "Secure login wiring lands next phase" : "Registration wiring lands next phase"}
            </Button>
          </form>
          <div className="space-y-3 rounded-[var(--radius-md)] border border-border/70 bg-muted/50 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Need to inspect the shell immediately? Continue with household-scoped demo
              data while auth routes are still being integrated.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/select-household">Open demo households</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={isLogin ? "/register" : "/login"}>
                  {isLogin ? "Go to register" : "Go to login"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
