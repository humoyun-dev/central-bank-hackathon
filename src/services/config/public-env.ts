import { z } from "zod"

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Central Bank"),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3).default("USD"),
  NEXT_PUBLIC_ENABLE_MOCK_API: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
})

const parsedPublicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
  NEXT_PUBLIC_ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API,
})

export const publicEnv = {
  appName: parsedPublicEnv.NEXT_PUBLIC_APP_NAME,
  defaultCurrency: parsedPublicEnv.NEXT_PUBLIC_DEFAULT_CURRENCY,
  enableMockApi: parsedPublicEnv.NEXT_PUBLIC_ENABLE_MOCK_API,
} as const
