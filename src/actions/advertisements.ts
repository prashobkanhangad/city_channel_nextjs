"use server";

import { revalidatePath } from "next/cache";
import {
  createAdvertisement as createAdvertisementInDb,
  deleteAdvertisement as deleteAdvertisementInDb,
  getAllAdvertisementsPaginated,
  updateAdvertisement,
} from "@/lib/db/advertisements";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";
import {
  buildPaginatedResult,
  parsePageParam,
  type PaginatedResult,
} from "@/lib/utils/pagination";
import { getPlacementMeta } from "@/lib/constants/adPlacements";
import { createAdvertisementSchema } from "@/lib/validations/advertisement";
import {
  uploadAdvertisementImage,
  validateAdvertisementImageFile,
} from "@/lib/supabase/storage";
import type { Advertisement } from "@/types/advertisement";
import type { AdPlacement } from "@/lib/constants/adPlacements";

export type AdvertisementActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function revalidateAdPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/advertisements");
  revalidatePath("/kasaragod");
  revalidatePath("/kerala");
  revalidatePath("/national");
  revalidatePath("/entertainment");
  revalidatePath("/sports");
  revalidatePath("/business");
  revalidatePath("/contact");
  revalidatePath("/live-tv");
  revalidatePath("/news/[id]", "page");
}

async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("image");

  if (file instanceof File && file.size > 0) {
    return uploadAdvertisementImage(file);
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  return imageUrl || null;
}

export async function getAdvertisements(): Promise<Advertisement[]> {
  const page = await getAdvertisementsPage(1);
  return page.items;
}

export async function getAdvertisementsPage(
  page = 1,
): Promise<PaginatedResult<Advertisement>> {
  const currentPage = parsePageParam(String(page));
  const { advertisements, totalCount } = await getAllAdvertisementsPaginated(
    currentPage,
    ADMIN_PAGE_SIZE,
  );

  return buildPaginatedResult(
    advertisements,
    totalCount,
    currentPage,
    ADMIN_PAGE_SIZE,
  );
}

export async function createAdvertisement(
  _prevState: AdvertisementActionState,
  formData: FormData,
): Promise<AdvertisementActionState> {
  const placement = String(formData.get("placement") ?? "") as AdPlacement;
  const placementMeta = getPlacementMeta(placement);

  let imageUrl: string | null = null;

  try {
    imageUrl = await resolveImageUrl(formData);
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

  if (!imageUrl) {
    return {
      success: false,
      message: "Upload an image or provide an image URL.",
      errors: { image: ["Upload an image or provide an image URL."] },
    };
  }

  const parsed = createAdvertisementSchema.safeParse({
    title: formData.get("title"),
    placement,
    imageUrl,
    linkUrl: formData.get("linkUrl") || "",
    altText: formData.get("altText") || "",
    aspectClass: formData.get("aspectClass") || placementMeta?.aspectClass,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createAdvertisementInDb({
      ...parsed.data,
      imageUrl,
      linkUrl: parsed.data.linkUrl || undefined,
    });
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create advertisement.",
    };
  }

  revalidateAdPaths();

  return {
    success: true,
    message: "Advertisement created successfully.",
  };
}

export async function replaceAdvertisementImage(
  id: string,
  formData: FormData,
): Promise<AdvertisementActionState> {
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      message: "Choose an image file to upload.",
    };
  }

  const validationError = validateAdvertisementImageFile(file);
  if (validationError) {
    return { success: false, message: validationError };
  }

  try {
    const imageUrl = await uploadAdvertisementImage(file);
    const ad = await updateAdvertisement(id, { imageUrl });

    if (!ad) {
      return { success: false, message: "Advertisement not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to replace image.",
    };
  }

  revalidateAdPaths();

  return { success: true, message: "Image updated successfully." };
}

export async function toggleAdvertisementActive(
  id: string,
  isActive: boolean,
): Promise<AdvertisementActionState> {
  try {
    const ad = await updateAdvertisement(id, { isActive });

    if (!ad) {
      return { success: false, message: "Advertisement not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update advertisement.",
    };
  }

  revalidateAdPaths();

  return {
    success: true,
    message: isActive ? "Advertisement enabled." : "Advertisement disabled.",
  };
}

export async function deleteAdvertisement(
  id: string,
): Promise<AdvertisementActionState> {
  try {
    const deleted = await deleteAdvertisementInDb(id);

    if (!deleted) {
      return { success: false, message: "Advertisement not found." };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete advertisement.",
    };
  }

  revalidateAdPaths();

  return { success: true, message: "Advertisement deleted." };
}
