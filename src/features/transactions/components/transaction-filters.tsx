"use client"

import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "@/i18n/navigation"
import type {
  TransactionFilters,
  TransactionKindFilter,
  TransactionPeriod,
} from "@/features/transactions/types/transaction"

const filterKinds: TransactionKindFilter[] = ["ALL", "EXPENSE", "INCOME", "TRANSFER"]
const filterPeriods: TransactionPeriod[] = ["7d", "30d", "90d"]

export function TransactionFiltersBar({
  initialFilters,
}: {
  initialFilters: TransactionFilters
}) {
  const t = useTranslations("transactions.filters")
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialFilters.query)
  const [period, setPeriod] = useState(initialFilters.period)
  const [kind, setKind] = useState(initialFilters.kind)

  function applyFilters(nextFilters: TransactionFilters) {
    const params = new URLSearchParams()

    if (nextFilters.kind !== "ALL") {
      params.set("kind", nextFilters.kind)
    }

    if (nextFilters.period !== "30d") {
      params.set("period", nextFilters.period)
    }

    if (nextFilters.query.trim().length > 0) {
      params.set("query", nextFilters.query.trim())
    }

    const nextHref = params.toString().length > 0 ? `${pathname}?${params}` : pathname

    startTransition(() => {
      router.replace(nextHref, { scroll: false })
    })
  }

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={kind}
          onValueChange={(nextValue) => {
            const nextKind = nextValue as TransactionKindFilter
            setKind(nextKind)
            applyFilters({ kind: nextKind, period, query })
          }}
        >
          <TabsList>
            {filterKinds.map((item) => (
              <TabsTrigger key={item} value={item}>
                {t(`kinds.${item.toLowerCase()}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isPending ? <Badge>{t("updating")}</Badge> : <Badge variant="primary">{t("urlSynced")}</Badge>}
      </div>
      <form
        className="flex flex-col gap-3 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          applyFilters({ kind, period, query })
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <Select
          value={period}
          onValueChange={(nextValue) => {
            const nextPeriod = nextValue as TransactionPeriod
            setPeriod(nextPeriod)
            applyFilters({ kind, period: nextPeriod, query })
          }}
        >
          <SelectTrigger aria-label={t("periodAriaLabel")} className="md:w-[10rem]">
            <SelectValue placeholder={t("periodPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {filterPeriods.map((item) => (
              <SelectItem key={item} value={item}>
                {t(`periods.${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">{t("apply")}</Button>
      </form>
    </div>
  )
}
