import { formatImageMaxSize, IMAGE_UPLOAD_MAX_BYTES } from "@/lib/images/constants";

const MAX_FILE_SIZE = formatImageMaxSize();

export const AD_PLACEMENTS = [
  {
    value: "home-sidebar",
    label: "Homepage — sidebar",
    aspectClass: "aspect-[16/10]",
    recommendedSize: "800 × 500 px",
    ratio: "16:10",
    maxFileSize: MAX_FILE_SIZE,
  },
  {
    value: "home-mid-banner",
    label: "Homepage — middle banner",
    aspectClass: "aspect-[16/5]",
    recommendedSize: "1200 × 375 px",
    ratio: "16:5",
    maxFileSize: MAX_FILE_SIZE,
  },
  {
    value: "category-sidebar-top",
    label: "Category / article sidebar — top",
    aspectClass: "aspect-[4/3]",
    recommendedSize: "600 × 450 px",
    ratio: "4:3",
    maxFileSize: MAX_FILE_SIZE,
  },
  {
    value: "category-sidebar-bottom",
    label: "Category / article sidebar — bottom",
    aspectClass: "aspect-[4/5]",
    recommendedSize: "600 × 750 px",
    ratio: "4:5",
    maxFileSize: MAX_FILE_SIZE,
  },
] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number]["value"];

export const AD_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export { IMAGE_UPLOAD_MAX_BYTES as AD_IMAGE_MAX_BYTES };

export function getPlacementMeta(placement: string) {
  return AD_PLACEMENTS.find((item) => item.value === placement);
}
