"use client"

import { mapAccountDtoToAccount } from "@/features/accounts/mappers/map-account-dto-to-account"
import { accountDtoSchema } from "@/features/accounts/schemas/account.dto"
import {
  createAccountRequestSchema,
  type CreateAccountRequest,
} from "@/features/accounts/schemas/create-account"
import { browserApiRequest } from "@/services/api/browser/client"

export function createAccount(householdId: string, body: CreateAccountRequest) {
  return browserApiRequest({
    path: `/api/households/${householdId}/accounts`,
    method: "POST",
    body: createAccountRequestSchema.parse(body),
    schema: accountDtoSchema,
  }).then(mapAccountDtoToAccount)
}
