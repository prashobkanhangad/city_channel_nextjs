"use client";

import { useActionState, useState } from "react";
import {
  createAdvertisement,
  type AdvertisementActionState,
} from "@/actions/advertisements";
import {
  AdminField,
  adminInputClassName,
  adminSelectClassName,
} from "@/components/admin/AdminField";
import {
  AD_PLACEMENTS,
  type AdPlacement,
} from "@/lib/constants/adPlacements";
import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_HINT,
} from "@/lib/images/imageUploadHint";

const initialState: AdvertisementActionState = {
  success: false,
  message: "",
  errors: undefined,
};

export function AdminAdCreateForm() {
  const [state, formAction] = useActionState(createAdvertisement, initialState);
  const [placement, setPlacement] = useState<AdPlacement>("home-sidebar");
  const placementMeta = AD_PLACEMENTS.find((item) => item.value === placement);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <AdminField label="Ad title">
        <input
          className={adminInputClassName}
          name="title"
          placeholder="e.g. Summer campaign"
          required
        />
        {state.errors?.title?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.title[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="Placement">
        <select
          className={adminSelectClassName}
          name="placement"
          required
          value={placement}
          onChange={(event) => setPlacement(event.target.value as AdPlacement)}
        >
          {AD_PLACEMENTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {state.errors?.placement?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.placement[0]}</span>
        ) : null}
      </AdminField>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 sm:col-span-2">
        <p className="text-sm font-semibold text-blue-900">Recommended image size</p>
        <p className="mt-1 text-sm text-blue-800">
          {placementMeta?.recommendedSize} ({placementMeta?.ratio} ratio) · Max{" "}
          {placementMeta?.maxFileSize} before upload · Auto-compressed to WebP
        </p>
      </div>

      <AdminField
        label="Upload image"
        hint={`Best size: ${placementMeta?.recommendedSize}. ${IMAGE_UPLOAD_HINT}`}
        className="sm:col-span-2"
      >
        <input
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700"
          type="file"
          name="image"
          accept={IMAGE_UPLOAD_ACCEPT}
        />
        {state.errors?.image?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.image[0]}</span>
        ) : null}
      </AdminField>

      <AdminField
        label="Or image URL (optional)"
        hint="Use upload above, or paste a URL if you already host the image"
        className="sm:col-span-2"
      >
        <input
          className={adminInputClassName}
          name="imageUrl"
          placeholder="https://example.com/banner.jpg or /sample.png"
        />
        {state.errors?.imageUrl?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.imageUrl[0]}</span>
        ) : null}
      </AdminField>

      <input
        type="hidden"
        name="aspectClass"
        value={placementMeta?.aspectClass ?? "aspect-[16/10]"}
      />

      <AdminField label="Click URL (optional)">
        <input
          className={adminInputClassName}
          name="linkUrl"
          placeholder="https://example.com"
        />
        {state.errors?.linkUrl?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.linkUrl[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="Alt text">
        <input
          className={adminInputClassName}
          name="altText"
          placeholder="Image description"
        />
      </AdminField>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Add advertisement
        </button>
        {state.success ? (
          <p className="text-sm text-green-700">{state.message}</p>
        ) : state.message ? (
          <p className="text-sm text-red-700">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
