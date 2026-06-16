import { z } from "zod";
import { parseYouTubeVideoId } from "@/lib/youtube/videoId";

const youtubeInputSchema = z
  .string()
  .max(200)
  .optional()
  .or(z.literal(""))
  .transform((value) => {
    if (!value) return null;
    return parseYouTubeVideoId(value);
  });

export const createVideoSchema = z.object({
  title: z.string().min(3, "Title is required").max(200),
  youtubeVideoId: youtubeInputSchema,
  showOnHomepage: z.boolean().optional().default(false),
});

export const updateVideoSchema = createVideoSchema.partial().extend({
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
