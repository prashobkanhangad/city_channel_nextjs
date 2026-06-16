import { NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/types";

export function successResponse<T>(data: T, status = 200) {
  const body: ApiSuccess<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function errorResponse(
  error: string,
  status = 400,
  details?: Record<string, string[]>,
) {
  const body: ApiError = { success: false, error, details };
  return NextResponse.json(body, { status });
}
