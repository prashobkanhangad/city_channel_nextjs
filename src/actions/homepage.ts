"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPostById, updatePost } from "@/lib/db/posts";
import {
  getHomepageYoutubeVideoUrl,
  updateHomepageYoutubeVideoUrl,
} from "@/lib/db/homepageSettings";
import type { HomepageSection } from "@/lib/constants/homepageSections";
import { isUuid } from "@/lib/utils/uuid";

export type HomepageActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const homepageVideoUrlSchema = z.object({
  youtubeVideoUrl: z
    .string()
    .max(500)
    .refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      "Enter a valid URL",
    ),
});

export async function getHomepageVideoSettings() {
  const youtubeVideoUrl = await getHomepageYoutubeVideoUrl();
  return { youtubeVideoUrl };
}

export async function saveHomepageVideoUrl(
  _prevState: HomepageActionState,
  formData: FormData,
): Promise<HomepageActionState> {
  const parsed = homepageVideoUrlSchema.safeParse({
    youtubeVideoUrl: String(formData.get("youtubeVideoUrl") ?? "").trim(),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateHomepageYoutubeVideoUrl(parsed.data.youtubeVideoUrl);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save homepage video URL.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");

  return {
    success: true,
    message: parsed.data.youtubeVideoUrl
      ? "Homepage video URL saved."
      : "Homepage video reset to default playlist.",
  };
}

export async function removePostFromHomepageSection(
  postId: string,
  section: HomepageSection,
): Promise<HomepageActionState> {
  if (!isUuid(postId)) {
    return { success: false, message: "Invalid post ID." };
  }

  try {
    const post = await getPostById(postId);

    if (!post) {
      return { success: false, message: "Post not found." };
    }

    const homepageSections = post.homepageSections.filter(
      (value) => value !== section,
    );

    await updatePost(postId, { homepageSections });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove post from section.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/posts");

  return { success: true, message: "Post removed from section." };
}
