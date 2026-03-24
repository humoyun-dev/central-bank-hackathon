"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { acceptHouseholdInvite } from "@/features/households/api/accept-household-invite"

export function AcceptInviteButton({ inviteId }: { inviteId: string }) {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: () => acceptHouseholdInvite(inviteId),
    onSuccess: () => {
      toast.success("Invite accepted")
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
      {mutation.isPending ? "Accepting..." : "Accept invite"}
    </Button>
  )
}
