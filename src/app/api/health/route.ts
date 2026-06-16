import { successResponse } from "@/lib/api/response";

export async function GET() {
  return successResponse({
    status: "ok",
    service: "city-channel-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
