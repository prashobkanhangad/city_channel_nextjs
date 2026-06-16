import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_MAX_BYTES,
  formatImageMaxSize,
} from "@/lib/images/constants";

const ALLOWED_TYPES = new Set(IMAGE_UPLOAD_ACCEPT.split(","));

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use JPG, PNG, WebP, or GIF only.";
  }

  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return `Image must be ${formatImageMaxSize()} or smaller.`;
  }

  return null;
}
