import { z } from "zod";

export const createCategorySchema = z.object({
  title: z.string().min(2, "Title is required").max(80),
  titleMl: z.string().min(2, "Malayalam title is required").max(80),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  navLabel: z.string().min(2, "Nav label is required").max(40),
  description: z.string().max(500).optional().default(""),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
