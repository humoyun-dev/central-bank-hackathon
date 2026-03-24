"use client"

import { ChevronDown, LogOut, RefreshCcw, Settings2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { logout } from "@/features/auth/api/logout"
import { Link, useRouter } from "@/i18n/navigation"

export function UserMenu({
  fullName,
  email,
  householdId,
}: {
  fullName: string
  email: string
  householdId: string
}) {
  const t = useTranslations("auth.userMenu")
  const router = useRouter()
  const initials = fullName
    .split(" ")
    .map((segment) => segment[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success(t("sessionClosed"))
      router.push("/login")
      router.refresh()
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-slate-200 bg-white/85 px-2.5"
          aria-label={t("open")}
        >
          <Avatar className="size-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 text-left xl:block">
            <p className="truncate text-sm font-semibold text-slate-950">{fullName}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
          <ChevronDown className="size-4 text-slate-500" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("session")}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/select-household">
            <RefreshCcw className="size-4" aria-hidden="true" />
            {t("switchHousehold")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${householdId}/settings`}>
            <Settings2 className="size-4" aria-hidden="true" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            logoutMutation.mutate()
          }}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {logoutMutation.isPending ? t("signingOut") : t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
