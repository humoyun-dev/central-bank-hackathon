"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { localeLabels, locales } from "@/i18n/config"
import { usePathname, useRouter } from "@/i18n/navigation"

export function LanguageSwitcher() {
  const t = useTranslations("common.languageSwitcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleLanguageChange(nextLocale: (typeof locales)[number]) {
    router.replace(pathname, { locale: nextLocale })
    router.refresh()
  }

  const currentLanguageLabel = localeLabels[locale as keyof typeof localeLabels] ?? localeLabels.en

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          aria-label={t("trigger", { language: currentLanguageLabel })}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline-block">{currentLanguageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((languageCode) => (
          <DropdownMenuItem
            key={languageCode}
            onClick={() => handleLanguageChange(languageCode)}
            className={locale === languageCode ? "bg-muted font-bold" : ""}
            aria-label={t("option", { language: localeLabels[languageCode] })}
          >
            {localeLabels[languageCode]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
