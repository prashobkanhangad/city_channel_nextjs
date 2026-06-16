"use client";

import { useActionState } from "react";
import { saveHomepageVideoUrl, type HomepageActionState } from "@/actions/homepage";
import { AdminField, adminInputClassName } from "@/components/admin/AdminField";

const initialState: HomepageActionState = {
  success: false,
  message: "",
};

type AdminHomepageVideoSettingsProps = {
  youtubeVideoUrl: string;
};

export function AdminHomepageVideoSettings({
  youtubeVideoUrl,
}: AdminHomepageVideoSettingsProps) {
  const [state, formAction] = useActionState(saveHomepageVideoUrl, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <AdminField
        label="YouTube URL"
        hint="Video, playlist, channel, or embed link for the City TV player at the top of the homepage. Leave empty to use the default uploads playlist."
        className="max-w-2xl"
      >
        <input
          className={adminInputClassName}
          name="youtubeVideoUrl"
          defaultValue={youtubeVideoUrl}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {state.errors?.youtubeVideoUrl?.[0] ? (
          <span className="text-xs text-red-600">
            {state.errors.youtubeVideoUrl[0]}
          </span>
        ) : null}
      </AdminField>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Save video URL
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
