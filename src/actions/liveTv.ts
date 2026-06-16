"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  getLiveTvStreamUrl,
  updateLiveTvStreamUrl,
} from "@/lib/db/liveTv";

export type LiveTvActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const liveTvUrlSchema = z.object({
  streamUrl: z
    .string()
    .min(1, "URL is required")
    .url("Enter a valid URL")
    .max(500),
});

export async function getLiveTvSettings() {
  const streamUrl = await getLiveTvStreamUrl();
  return { streamUrl };
}

export async function saveLiveTvUrl(
  _prevState: LiveTvActionState,
  formData: FormData,
): Promise<LiveTvActionState> {
  const parsed = liveTvUrlSchema.safeParse({
    streamUrl: formData.get("streamUrl"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateLiveTvStreamUrl(parsed.data.streamUrl);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to save Live TV URL.",
    };
  }

  revalidatePath("/live-tv");
  revalidatePath("/admin/live-tv");

  return {
    success: true,
    message: "Live TV URL saved successfully.",
  };
}
