import type { HomepageSection } from "@/lib/constants/homepageSections";

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  city: string;
  imageUrl: string | null;
  homepageSections: HomepageSection[];
  status: "draft" | "published";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostInput = {
  title: string;
  content: string;
  author: string;
  city: string;
  imageUrl?: string | null;
  homepageSections?: HomepageSection[];
  status?: "draft" | "published";
};

export type UpdatePostInput = Partial<CreatePostInput>;
