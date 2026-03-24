import { getTranslations } from "next-intl/server"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default async function HouseholdNotFound() {
  const t = await getTranslations("common.routeStates.householdNotFound")

  return (
    <div className="mx-auto max-w-3xl py-8">
      <EmptyState
        title={t("title")}
        description={t("description")}
        action={
          <Button asChild>
            <Link href="/select-household">{t("action")}</Link>
          </Button>
        }
      />
    </div>
  )
}
