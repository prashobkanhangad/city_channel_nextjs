import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getDeviceTokens(
  platform: "android" | "ios" = "android",
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("device_tokens")
    .select("token")
    .eq("platform", platform);

  if (error) {
    throw new Error(`Failed to load device tokens: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => row.token)
    .filter((token): token is string => typeof token === "string" && token.length > 0);
}
