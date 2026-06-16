import { errorResponse } from "@/lib/api/response";
import { getAdminUser } from "@/lib/auth/session";

export async function requireApiAdmin() {
  const user = await getAdminUser();

  if (!user) {
    return {
      user: null,
      error: errorResponse("Unauthorized", 401),
    } as const;
  }

  return { user, error: null } as const;
}
