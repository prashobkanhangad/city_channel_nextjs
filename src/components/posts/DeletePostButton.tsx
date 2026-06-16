"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function onDelete() {
    const confirmed = window.confirm(
      "ഈ പോസ്റ്റ് ഇല്ലാതാക്കണോ? ഇത് പഴയപടിയാക്കാൻ കഴിയില്ല.",
    );
    if (!confirmed) return;

    startTransition(async () => {
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("പോസ്റ്റ് ഇല്ലാതാക്കാൻ കഴിഞ്ഞില്ല.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "ഇല്ലാതാക്കുന്നു..." : "ഇല്ലാതാക്കുക"}
    </button>
  );
}
