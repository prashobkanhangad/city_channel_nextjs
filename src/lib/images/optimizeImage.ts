import sharp from "sharp";
import { IMAGE_WEBP_QUALITY } from "@/lib/images/constants";

export type OptimizeImageOptions = {
  maxWidth?: number;
  quality?: number;
};

export type OptimizedImage = {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
};

export async function optimizeImageBuffer(
  input: Buffer,
  options: OptimizeImageOptions = {},
): Promise<OptimizedImage> {
  const { maxWidth = 1600, quality = IMAGE_WEBP_QUALITY } = options;

  const metadata = await sharp(input).metadata();
  let pipeline = sharp(input).rotate();

  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
  };
}
