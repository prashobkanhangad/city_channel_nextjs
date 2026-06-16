"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validations/auth";
import { isAdminEmail } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function login(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  if (!isAdminEmail(email)) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const redirectTo = String(formData.get("redirect") ?? "").trim();
  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
