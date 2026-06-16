import {
  AD_IMAGE_MAX_WIDTH,
  IMAGE_STORAGE_MAX_BYTES,
  POST_IMAGE_MAX_WIDTH,
  formatImageMaxSize,
} from "@/lib/images/constants";
import { optimizeImageBuffer } from "@/lib/images/optimizeImage";
import { validateImageFile } from "@/lib/images/validateImageFile";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const AD_BUCKET = "advertisements";
const POST_BUCKET = "post-images";

async function uploadOptimizedImage(
  file: File,
  bucket: string,
  maxWidth: number,
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = getSupabaseAdmin();
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const { buffer, contentType, extension } = await optimizeImageBuffer(
    inputBuffer,
    { maxWidth },
  );

  if (buffer.length > IMAGE_STORAGE_MAX_BYTES) {
    throw new Error(
      `Image is still too large after compression. Use a smaller file (max ${formatImageMaxSize(IMAGE_STORAGE_MAX_BYTES)} stored).`,
    );
  }

  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export { validateImageFile as validateAdvertisementImageFile };
export { validateImageFile as validatePostImageFile };

export async function uploadAdvertisementImage(file: File): Promise<string> {
  return uploadOptimizedImage(file, AD_BUCKET, AD_IMAGE_MAX_WIDTH);
}

export async function uploadPostImage(file: File): Promise<string> {
  return uploadOptimizedImage(file, POST_BUCKET, POST_IMAGE_MAX_WIDTH);
}
