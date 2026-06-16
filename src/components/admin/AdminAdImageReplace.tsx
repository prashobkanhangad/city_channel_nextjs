"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replaceAdvertisementImage } from "@/actions/advertisements";
import { getPlacementMeta } from "@/lib/constants/adPlacements";
import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_HINT,
} from "@/lib/images/imageUploadHint";
import type { Advertisement } from "@/types/advertisement";

type AdminAdImageReplaceProps = {
  ad: Advertisement;
};

export function AdminAdImageReplace({ ad }: AdminAdImageReplaceProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const placementMeta = getPlacementMeta(ad.placement);

  function handleReplace() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      alert("Choose an image file first.");
      return;
    }

    const formData = new FormData();
    formData.set("image", file);

    startTransition(async () => {
      const result = await replaceAdvertisementImage(ad.id, formData);
      if (!result.success) {
        alert(result.message);
        return;
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-medium text-zinc-700">Replace image</p>
      <p className="text-xs text-zinc-500">
        Recommended: {placementMeta?.recommendedSize} · {IMAGE_UPLOAD_HINT}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_ACCEPT}
        className="block w-full text-xs text-zinc-600 file:mr-2 file:rounded file:border-0 file:bg-white file:px-2 file:py-1 file:text-xs file:font-medium file:text-zinc-700"
      />
      <button
        type="button"
        disabled={isPending}
        onClick={handleReplace}
        className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
      >
        {isPending ? "Uploading..." : "Upload new image"}
      </button>
    </div>
  );
}
