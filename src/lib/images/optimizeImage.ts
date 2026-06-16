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

async function getSharp() {
  try {
    const sharpModule = await import("sharp");
    return sharpModule.default;
  } catch {
    throw new Error(
      "Image processing is unavailable. Run: npm install --include=optional sharp",
    );
  }
}

export async function optimizeImageBuffer(
  input: Buffer,
  options: OptimizeImageOptions = {},
): Promise<OptimizedImage> {
  const { maxWidth = 1600, quality = IMAGE_WEBP_QUALITY } = options;
  const sharp = await getSharp();

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
