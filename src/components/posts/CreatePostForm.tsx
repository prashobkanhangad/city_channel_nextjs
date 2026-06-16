"use client";

import { useActionState } from "react";
import { createPost, type PostActionState } from "@/actions/posts";

const initialState: PostActionState = {
  success: false,
  message: "",
  errors: undefined,
};

export default function CreatePostForm() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">ശീർഷകം</span>
          <input
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-400"
            name="title"
            placeholder="ഉദാ: വാരാന്ത്യ കർഷക മാർക്കറ്റ് തിരിച്ചുവരുന്നു"
            required
          />
          {state.errors?.title?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.title[0]}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">എഴുതിയവർ</span>
          <input
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-400"
            name="author"
            placeholder="ഉദാ: വെബ് ഡെസ്ക്"
            required
          />
          {state.errors?.author?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.author[0]}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">നഗരം</span>
          <input
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-400"
            name="city"
            placeholder="ഉദാ: കൊച്ചി"
            required
          />
          {state.errors?.city?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.city[0]}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-sm font-medium text-zinc-700">വിവരണം</span>
          <textarea
            className="min-h-[110px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
            name="content"
            placeholder="ചെറിയ വാർത്താ വിവരണം എഴുതുക..."
            required
          />
          {state.errors?.content?.[0] ? (
            <span className="text-xs text-red-600">
              {state.errors.content[0]}
            </span>
          ) : null}
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          പ്രസിദ്ധീകരിക്കുക
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
