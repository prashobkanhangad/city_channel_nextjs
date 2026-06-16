export const IMAGE_UPLOAD_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const IMAGE_UPLOAD_MAX_BYTES = 512 * 1024;
export const IMAGE_STORAGE_MAX_BYTES = 512 * 1024;

export const POST_IMAGE_MAX_WIDTH = 1200;
export const AD_IMAGE_MAX_WIDTH = 1000;
export const IMAGE_WEBP_QUALITY = 75;

export function formatImageMaxSize(bytes = IMAGE_UPLOAD_MAX_BYTES): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
