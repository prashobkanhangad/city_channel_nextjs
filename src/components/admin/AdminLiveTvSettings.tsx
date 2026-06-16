"use client";

import { useActionState } from "react";
import { saveLiveTvUrl, type LiveTvActionState } from "@/actions/liveTv";
import { AdminField, adminInputClassName } from "@/components/admin/AdminField";

const initialState: LiveTvActionState = {
  success: false,
  message: "",
  errors: undefined,
};

type AdminLiveTvSettingsProps = {
  streamUrl: string;
};

export function AdminLiveTvSettings({ streamUrl }: AdminLiveTvSettingsProps) {
  const [state, formAction] = useActionState(saveLiveTvUrl, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <AdminField
        label="Live TV URL"
        hint="YouTube channel, video, or embed URL shown on /live-tv"
        className="max-w-2xl"
      >
        <input
          className={adminInputClassName}
          name="streamUrl"
          defaultValue={streamUrl}
          placeholder="https://www.youtube.com/channel/UC..."
          required
        />
        {state.errors?.streamUrl?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.streamUrl[0]}</span>
        ) : null}
      </AdminField>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Save URL
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
