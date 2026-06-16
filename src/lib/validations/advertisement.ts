import { z } from "zod";
import { AD_PLACEMENTS, type AdPlacement } from "@/lib/constants/adPlacements";

const placementValues = AD_PLACEMENTS.map((item) => item.value) as [
  AdPlacement,
  ...AdPlacement[],
];

export const createAdvertisementSchema = z.object({
  title: z.string().min(2, "Title is required").max(120),
  placement: z.enum(placementValues),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
  linkUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  altText: z.string().max(160).optional().default(""),
  aspectClass: z.string().min(4).max(40).optional(),
});

export const updateAdvertisementSchema = createAdvertisementSchema.partial().extend({
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
