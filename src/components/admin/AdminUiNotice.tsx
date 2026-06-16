"use client";

import { useState } from "react";

export function AdminUiNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>
        <span className="font-semibold">UI preview only.</span> Forms on this
        page are not connected to the backend yet.
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 text-xs font-medium text-amber-800 hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
}
