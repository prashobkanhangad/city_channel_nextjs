"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost, type PostActionState } from "@/actions/posts";
import { AdminHomepageSectionCheckboxes } from "@/components/admin/AdminHomepageSectionCheckboxes";
import {
  AdminField,
  adminInputClassName,
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";
import { POST_SECTION_OPTIONS } from "@/lib/constants/postSections";
import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_HINT,
} from "@/lib/images/imageUploadHint";

const initialState: PostActionState = {
  success: false,
  message: "",
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-80"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Saving...
        </>
      ) : (
        "Save post"
      )}
    </button>
  );
}

export default function AdminCreatePostForm() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminField label="Title" className="sm:col-span-2">
          <input
            className={adminInputClassName}
            name="title"
            placeholder="e.g. Weekend farmers market returns"
            required
          />
          {state.errors?.title?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.title[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Author">
          <input
            className={adminInputClassName}
            name="author"
            placeholder="e.g. Web Desk"
            required
          />
          {state.errors?.author?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.author[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Section">
          <select
            className={adminSelectClassName}
            name="city"
            defaultValue="Kerala"
            required
          >
            {POST_SECTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {state.errors?.city?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.city[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Status">
          <select className={adminSelectClassName} name="status" defaultValue="published">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {state.errors?.status?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.status[0]}</span>
          ) : null}
        </AdminField>

        <AdminHomepageSectionCheckboxes />

        <AdminField
          label="Featured image"
          hint={IMAGE_UPLOAD_HINT}
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

        <AdminField label="Content" className="sm:col-span-2">
          <textarea
            className={adminTextareaClassName}
            name="content"
            placeholder="Write a short news update..."
            required
            rows={5}
          />
          {state.errors?.content?.[0] ? (
            <span className="text-xs text-red-600">{state.errors.content[0]}</span>
          ) : null}
        </AdminField>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.success ? (
          <p className="text-sm text-green-700">{state.message}</p>
        ) : state.message ? (
          <p className="text-sm text-red-700">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
