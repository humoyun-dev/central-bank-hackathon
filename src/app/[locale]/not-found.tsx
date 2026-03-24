import { getTranslations } from "next-intl/server"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default async function NotFound() {
  const t = await getTranslations("common.routeStates.globalNotFound")

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <EmptyState
        title={t("title")}
        description={t("description")}
        action={
          <Button asChild>
            <Link href="/select-household">{t("action")}</Link>
          </Button>
        }
      />
    </main>
  )
}
