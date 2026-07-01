"use server";

import { revalidatePath } from "next/cache";
import {
  createPost as createPostInDb,
  deletePost as deletePostInDb,
  getAllPostsPaginated,
  getPostById,
  getPostsCount as getPostsCountFromDb,
  getRecentPosts,
  getTotalPostViews as getTotalPostViewsFromDb,
  updatePost as updatePostInDb,
} from "@/lib/db/posts";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  buildPaginatedResult,
  parsePageParam,
  type PaginatedResult,
} from "@/lib/utils/pagination";
import { uploadPostImage } from "@/lib/supabase/storage";
import { createPostSchema, updatePostSchema } from "@/lib/validations/post";
import { parseHomepageSections } from "@/lib/constants/homepageSections";
import { getCategoryPathForCity } from "@/lib/news/postNewsItem";
import { notifyPublishedPost } from "@/lib/push/notifyPublishedPost";
import { isUuid } from "@/lib/utils/uuid";
import type { Post } from "@/types";

export type PostActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function revalidatePostPublicPaths(options?: {
  city?: string;
  postId?: string;
  previousCity?: string;
}) {
  revalidatePath("/");
  revalidatePath("/admin/homepage");

  const categoryPath = getCategoryPathForCity(options?.city);
  if (categoryPath) {
    revalidatePath(categoryPath);
  }

  const previousCategoryPath = getCategoryPathForCity(options?.previousCity);
  if (
    previousCategoryPath &&
    previousCategoryPath !== categoryPath
  ) {
    revalidatePath(previousCategoryPath);
  }

  if (options?.postId) {
    revalidatePath(`/news/${options.postId}`);
  }
}

async function resolvePostImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("image");

  if (file instanceof File && file.size > 0) {
    return uploadPostImage(file);
  }

  return null;
}

export async function getPosts(): Promise<Post[]> {
  const page = await getPostsPage(1);
  return page.items;
}

export async function getPostsPage(page = 1): Promise<PaginatedResult<Post>> {
  const currentPage = parsePageParam(String(page));
  const { posts, totalCount } = await getAllPostsPaginated(
    currentPage,
    ADMIN_PAGE_SIZE,
  );

  return buildPaginatedResult(posts, totalCount, currentPage, ADMIN_PAGE_SIZE);
}

export async function getAdminPostsCount(): Promise<number> {
  return getPostsCountFromDb();
}

export async function getRecentPostsForAdmin(limit = 5): Promise<Post[]> {
  return getRecentPosts(limit);
}

export async function getTotalPostViews(): Promise<number> {
  return getTotalPostViewsFromDb();
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  let imageUrl: string | null = null;

  try {
    imageUrl = await resolvePostImageUrl(formData);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload image.",
      errors: {
        image: [
          error instanceof Error ? error.message : "Failed to upload image.",
        ],
      },
    };
  }

  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    author: formData.get("author"),
    city: formData.get("city"),
    imageUrl,
    homepageSections: parseHomepageSections(formData),
    status: formData.get("status") || "published",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const post = await createPostInDb(parsed.data);

    if (parsed.data.status === "published") {
      void notifyPublishedPost(post);
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to publish post.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePostPublicPaths({ city: parsed.data.city });

  return {
    success: true,
    message:
      parsed.data.status === "draft"
        ? "Post saved as draft."
        : "Post published successfully.",
  };
}

export async function updatePostAction(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const id = formData.get("id");

  if (typeof id !== "string" || !isUuid(id)) {
    return { success: false, message: "Invalid post ID." };
  }

  let imageUrl: string | undefined;

  try {
    const uploadedImageUrl = await resolvePostImageUrl(formData);
    if (uploadedImageUrl) {
      imageUrl = uploadedImageUrl;
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload image.",
      errors: {
        image: [
          error instanceof Error ? error.message : "Failed to upload image.",
        ],
      },
    };
  }

  const parsed = updatePostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    author: formData.get("author"),
    city: formData.get("city"),
    status: formData.get("status"),
    imageUrl,
    homepageSections: parseHomepageSections(formData),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  let previousCity: string | undefined;
  let previousStatus: Post["status"] | undefined;

  try {
    const existingPost = await getPostById(id);
    previousCity = existingPost?.city;
    previousStatus = existingPost?.status;
  } catch {
    // Continue with update even if the lookup fails.
  }

  let updatedPost: Post | null = null;

  try {
    updatedPost = await updatePostInDb(id, parsed.data);

    if (!updatedPost) {
      return { success: false, message: "Post not found." };
    }

    if (
      updatedPost.status === "published" &&
      previousStatus === "draft"
    ) {
      void notifyPublishedPost(updatedPost);
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update post.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePostPublicPaths({
    city: parsed.data.city ?? previousCity,
    previousCity,
    postId: id,
  });

  return {
    success: true,
    message: "Post updated successfully.",
  };
}

export async function deletePost(id: string): Promise<PostActionState> {
  let previousCity: string | undefined;

  try {
    const existingPost = await getPostById(id);
    previousCity = existingPost?.city;
  } catch {
    // Continue with delete even if the lookup fails.
  }

  try {
    const deleted = await deletePostInDb(id);

    if (!deleted) {
      return { success: false, message: "Post not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete post.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePostPublicPaths({ previousCity, postId: id });

  return { success: true, message: "Post removed." };
}
