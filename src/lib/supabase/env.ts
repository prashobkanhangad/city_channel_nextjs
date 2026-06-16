const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl(): string {
  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Copy .env.example to .env.local and add your Supabase project URL.",
    );
  }
  return supabaseUrl;
}

export function getSupabaseAnonKey(): string {
  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to .env.local from Supabase → Project Settings → API.",
    );
  }
  return supabaseAnonKey;
}

export function getSupabaseServiceRoleKey(): string {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local (server only — never expose to the browser).",
    );
  }
  return supabaseServiceRoleKey;
}
