"use client"

import { mapAccountDtoToAccount } from "@/features/accounts/mappers/map-account-dto-to-account"
import { accountDtoSchema } from "@/features/accounts/schemas/account.dto"
import {
  updateAccountRequestSchema,
  type UpdateAccountRequest,
} from "@/features/accounts/schemas/update-account"
import { browserApiRequest } from "@/services/api/browser/client"

export function updateAccount(
  householdId: string,
  accountId: string,
  body: UpdateAccountRequest,
) {
  return browserApiRequest({
    path: `/api/households/${householdId}/accounts/${accountId}`,
    method: "PATCH",
    body: updateAccountRequestSchema.parse(body),
    schema: accountDtoSchema,
  }).then(mapAccountDtoToAccount)
}
