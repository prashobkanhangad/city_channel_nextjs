import { getPlacementMeta } from "@/lib/constants/adPlacements";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Advertisement,
  CreateAdvertisementInput,
  UpdateAdvertisementInput,
} from "@/types/advertisement";
import type { AdPlacement } from "@/lib/constants/adPlacements";

type AdvertisementRow = {
  id: string;
  title: string;
  placement: string;
  image_url: string;
  link_url: string | null;
  alt_text: string;
  aspect_class: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapAdvertisement(row: AdvertisementRow): Advertisement {
  return {
    id: row.id,
    title: row.title,
    placement: row.placement as AdPlacement,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    altText: row.alt_text,
    aspectClass: row.aspect_class,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllAdvertisements(): Promise<Advertisement[]> {
  const result = await getAllAdvertisementsPaginated(1, 10_000);
  return result.advertisements;
}

export async function getAllAdvertisementsPaginated(
  page = 1,
  pageSize = 15,
): Promise<{ advertisements: Advertisement[]; totalCount: number }> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("advertisements")
    .select("*", { count: "exact" })
    .order("placement", { ascending: true })
    .order("sort_order", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch advertisements: ${error.message}`);
  }

  return {
    advertisements: (data as AdvertisementRow[]).map(mapAdvertisement),
    totalCount: count ?? 0,
  };
}

export async function getActiveAdByPlacement(
  placement: AdPlacement,
): Promise<Advertisement | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch advertisement: ${error.message}`);
  }

  return data ? mapAdvertisement(data as AdvertisementRow) : null;
}

export async function getActiveAdsByPlacements(
  placements: AdPlacement[],
): Promise<Partial<Record<AdPlacement, Advertisement>>> {
  const entries = await Promise.all(
    placements.map(async (placement) => {
      try {
        const ad = await getActiveAdByPlacement(placement);
        return [placement, ad] as const;
      } catch {
        return [placement, null] as const;
      }
    }),
  );

  return Object.fromEntries(entries.filter(([, ad]) => ad !== null)) as Partial<
    Record<AdPlacement, Advertisement>
  >;
}

export async function createAdvertisement(
  input: CreateAdvertisementInput,
): Promise<Advertisement> {
  const supabase = getSupabaseAdmin();
  const placementMeta = getPlacementMeta(input.placement);
  const { data: lastAd } = await supabase
    .from("advertisements")
    .select("sort_order")
    .eq("placement", input.placement)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder =
    lastAd && typeof lastAd.sort_order === "number" ? lastAd.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("advertisements")
    .insert({
      title: input.title,
      placement: input.placement,
      image_url: input.imageUrl,
      link_url: input.linkUrl || null,
      alt_text: input.altText ?? "",
      aspect_class: input.aspectClass ?? placementMeta?.aspectClass ?? "aspect-[16/10]",
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create advertisement: ${error.message}`);
  }

  return mapAdvertisement(data as AdvertisementRow);
}

export async function updateAdvertisement(
  id: string,
  input: UpdateAdvertisementInput,
): Promise<Advertisement | null> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.placement !== undefined) payload.placement = input.placement;
  if (input.imageUrl !== undefined) payload.image_url = input.imageUrl;
  if (input.linkUrl !== undefined) payload.link_url = input.linkUrl || null;
  if (input.altText !== undefined) payload.alt_text = input.altText;
  if (input.aspectClass !== undefined) payload.aspect_class = input.aspectClass;
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

  const { data, error } = await supabase
    .from("advertisements")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update advertisement: ${error.message}`);
  }

  return data ? mapAdvertisement(data as AdvertisementRow) : null;
}

export async function deleteAdvertisement(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("advertisements")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete advertisement: ${error.message}`);
  }

  return (count ?? 0) > 0;
}
