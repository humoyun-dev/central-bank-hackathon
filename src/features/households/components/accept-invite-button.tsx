"use client"

import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { acceptHouseholdInvite } from "@/features/households/api/accept-household-invite"
import { useRouter } from "@/i18n/navigation"

export function AcceptInviteButton({ inviteId }: { inviteId: string }) {
  const t = useTranslations("households.selection")
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: () => acceptHouseholdInvite(inviteId),
    onSuccess: () => {
      toast.success(t("inviteAccepted"))
      router.refresh()
    },
  })

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? t("acceptInvitePending") : t("acceptInvite")}
    </Button>
  )
}
