"use client";

import { useActionState } from "react";
import { createVideo, type VideoActionState } from "@/actions/videos";
import {
  AdminField,
  adminInputClassName,
} from "@/components/admin/AdminField";

const initialState: VideoActionState = {
  success: false,
  message: "",
};

export function AdminVideoCreateForm() {
  const [state, formAction] = useActionState(createVideo, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AdminField label="Video title" className="sm:col-span-2">
        <input
          className={adminInputClassName}
          name="title"
          placeholder="e.g. Kerala news bulletin"
          required
        />
        {state.errors?.title?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.title[0]}</span>
        ) : null}
      </AdminField>

      <AdminField
        label="YouTube video ID or URL"
        hint="Optional — paste a watch link or video ID"
        className="sm:col-span-2"
      >
        <input
          className={adminInputClassName}
          name="youtubeVideoId"
          placeholder="dQw4w9WgXcQ or https://www.youtube.com/watch?v=..."
        />
        {state.errors?.youtubeVideoId?.[0] ? (
          <span className="text-xs text-red-600">
            {state.errors.youtubeVideoId[0]}
          </span>
        ) : null}
      </AdminField>

      <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 sm:col-span-2">
        <input
          type="checkbox"
          name="showOnHomepage"
          className="rounded border-zinc-300"
        />
        Show on homepage
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Add video
        </button>
        {state.message ? (
          <p
            className={`text-sm ${state.success ? "text-green-700" : "text-red-700"}`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
