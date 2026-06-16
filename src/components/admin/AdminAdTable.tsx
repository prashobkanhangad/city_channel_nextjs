"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminAdImageReplace } from "@/components/admin/AdminAdImageReplace";
import {
  deleteAdvertisement,
  toggleAdvertisementActive,
} from "@/actions/advertisements";
import { getPlacementMeta } from "@/lib/constants/adPlacements";
import type { Advertisement } from "@/types/advertisement";

type AdminAdTableProps = {
  advertisements: Advertisement[];
};

function isRemoteImage(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function AdminAdTable({ advertisements }: AdminAdTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleAdvertisementActive(id, !isActive);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Delete advertisement "${title}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAdvertisement(id);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  if (advertisements.length === 0) {
    return (
      <p className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        No advertisements yet. Add your first ad above.
      </p>
    );
  }

  return (
    <div className="space-y-4 border-t border-zinc-100 pt-4">
      {advertisements.map((ad) => {
        const placementMeta = getPlacementMeta(ad.placement);

        return (
          <article
            key={ad.id}
            className={`rounded-xl border border-zinc-200 p-4 ${!ad.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                {isRemoteImage(ad.imageUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ad.imageUrl}
                    alt={ad.altText || ad.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={ad.imageUrl}
                    alt={ad.altText || ad.title}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-zinc-900">{ad.title}</h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      ad.isActive
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200"
                    }`}
                  >
                    {ad.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-zinc-600">
                  {placementMeta?.label ?? ad.placement}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Image size: {placementMeta?.recommendedSize} ({placementMeta?.ratio})
                </p>
                {ad.linkUrl ? (
                  <p className="mt-1 truncate text-xs text-zinc-500">{ad.linkUrl}</p>
                ) : null}

                <AdminAdImageReplace ad={ad} />
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(ad.id, ad.isActive)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {ad.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(ad.id, ad.title)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
