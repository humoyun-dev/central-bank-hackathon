import { NextResponse } from "next/server"
import { publicEnv } from "@/services/config/public-env"
import { getServerEnv } from "@/services/config/server-env"

export async function GET() {
  const serverEnv = getServerEnv()

  return NextResponse.json({
    status: "ok",
    appName: publicEnv.appName,
    mockMode: publicEnv.enableMockApi,
    backendApiUrl: serverEnv.BACKEND_API_URL,
  })
}
