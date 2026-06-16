import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
