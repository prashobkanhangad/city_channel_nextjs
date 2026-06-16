import { z } from "zod";
import { HOMEPAGE_SECTION_VALUES } from "@/lib/constants/homepageSections";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000),
  author: z.string().min(2, "Author name is required").max(80),
  city: z.string().min(2, "City is required").max(80),
  imageUrl: z.string().url().max(500).nullable().optional(),
  homepageSections: z.array(z.enum(HOMEPAGE_SECTION_VALUES)).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  status: z.enum(["draft", "published"]).optional(),
});
