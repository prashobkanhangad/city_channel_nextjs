import type { HomepageSection } from "@/lib/constants/homepageSections";
import { normalizeHomepageSections } from "@/lib/constants/homepageSections";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/utils/uuid";
import type { CreatePostInput, Post, UpdatePostInput } from "@/types";

type PostRow = {
  id: string;
  title: string;
  content: string;
  author: string;
  city: string;
  image_url: string | null;
  homepage_sections: string[] | null;
  view_count: number;
  status: string;
  created_at: string;
  updated_at: string;
};

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    city: row.city,
    imageUrl: row.image_url,
    homepageSections: normalizeHomepageSections(row.homepage_sections),
    status: row.status === "draft" ? "draft" : "published",
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildPostUpdatePayload(input: UpdatePostInput) {
  const payload: Record<string, string | null | string[]> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.content !== undefined) payload.content = input.content;
  if (input.author !== undefined) payload.author = input.author;
  if (input.city !== undefined) payload.city = input.city;
  if (input.status !== undefined) payload.status = input.status;
  if (input.imageUrl !== undefined) payload.image_url = input.imageUrl;
  if (input.homepageSections !== undefined) {
    payload.homepage_sections = input.homepageSections;
  }

  return payload;
}

export async function getAllPosts(): Promise<Post[]> {
  const result = await getAllPostsPaginated(1, 10_000);
  return result.posts;
}

export async function getAllPostsPaginated(
  page = 1,
  pageSize = 15,
): Promise<{ posts: Post[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  return {
    posts: (data as PostRow[]).map(mapPost),
    totalCount: count ?? 0,
  };
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent posts: ${error.message}`);
  }

  return (data as PostRow[]).map(mapPost);
}

export async function getPostsCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to count posts: ${error.message}`);
  }

  return count ?? 0;
}

export async function getTotalPostViews(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("posts").select("view_count");

  if (error) {
    throw new Error(`Failed to fetch post views: ${error.message}`);
  }

  return (data ?? []).reduce(
    (total, row) => total + (typeof row.view_count === "number" ? row.view_count : 0),
    0,
  );
}

export async function getPublishedPosts(limit = 30): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch published posts: ${error.message}`);
  }

  return (data as PostRow[]).map(mapPost);
}

export async function getTrendingPublishedPosts(limit = 10): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch trending posts: ${error.message}`);
  }

  return (data as PostRow[]).map(mapPost);
}

async function queryPostsByHomepageSection(
  section: HomepageSection,
  limit: number,
  publishedOnly: boolean,
): Promise<Post[]> {
  const supabase = publishedOnly
    ? await createSupabaseServerClient()
    : getSupabaseAdmin();

  let query = supabase
    .from("posts")
    .select("*")
    .contains("homepage_sections", [section])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (publishedOnly) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Failed to fetch ${section} homepage posts: ${error.message}`,
    );
  }

  return (data as PostRow[]).map(mapPost);
}

export async function getPublishedPostsByHomepageSection(
  section: HomepageSection,
  limit = 10,
): Promise<Post[]> {
  return queryPostsByHomepageSection(section, limit, true);
}

export async function getPostsByHomepageSection(
  section: HomepageSection,
  limit = 20,
): Promise<Post[]> {
  return queryPostsByHomepageSection(section, limit, false);
}

export async function getPublishedPostsByCity(
  city: string,
  limit = 30,
): Promise<Post[]> {
  const result = await getPublishedPostsByCityPaginated(city, 1, limit);
  return result.posts;
}

export async function getPublishedPostsByCityPaginated(
  city: string,
  page = 1,
  pageSize = 10,
): Promise<{ posts: Post[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .ilike("city", city)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch posts for ${city}: ${error.message}`);
  }

  return {
    posts: (data as PostRow[]).map(mapPost),
    totalCount: count ?? 0,
  };
}

export async function getPublishedPostById(id: string): Promise<Post | null> {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data ? mapPost(data as PostRow) : null;
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isUuid(id)) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data ? mapPost(data as PostRow) : null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: input.title,
      content: input.content,
      author: input.author,
      city: input.city,
      image_url: input.imageUrl ?? null,
      homepage_sections: input.homepageSections ?? [],
      status: input.status ?? "published",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  return mapPost(data as PostRow);
}

export async function updatePost(
  id: string,
  input: UpdatePostInput,
): Promise<Post | null> {
  const supabase = getSupabaseAdmin();
  const payload = buildPostUpdatePayload(input);

  if (Object.keys(payload).length === 0) {
    return getPostById(id);
  }

  const { data, error } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  return data ? mapPost(data as PostRow) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("posts")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export async function incrementPostViewCount(id: string): Promise<void> {
  if (!isUuid(id)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("increment_post_view", {
    post_id: id,
  });

  if (error) {
    throw new Error(`Failed to increment view count: ${error.message}`);
  }
}
