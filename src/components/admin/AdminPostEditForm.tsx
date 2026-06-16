"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePostAction } from "@/actions/posts";
import { AdminHomepageSectionCheckboxes } from "@/components/admin/AdminHomepageSectionCheckboxes";
import {
  AdminField,
  adminInputClassName,
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";
import { PostThumbImage } from "@/components/landing/PostImage";
import { POST_SECTION_OPTIONS } from "@/lib/constants/postSections";
import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_HINT,
} from "@/lib/images/imageUploadHint";
import type { Post } from "@/types";

type AdminPostEditFormProps = {
  post: Post;
  onCancel: () => void;
};

export function AdminPostEditForm({ post, onCancel }: AdminPostEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updatePostAction(
        { success: false, message: "" },
        formData,
      );

      if (result.success) {
        router.refresh();
        onCancel();
        return;
      }

      setMessage(result.message);
      setErrors(result.errors ?? {});
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mt-4 space-y-4"
    >
      <input type="hidden" name="id" value={post.id} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminField label="Title" className="sm:col-span-2">
          <input
            className={adminInputClassName}
            defaultValue={post.title}
            name="title"
            required
          />
          {errors.title?.[0] ? (
            <span className="text-xs text-red-600">{errors.title[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Author">
          <input
            className={adminInputClassName}
            defaultValue={post.author}
            name="author"
            required
          />
          {errors.author?.[0] ? (
            <span className="text-xs text-red-600">{errors.author[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="City / Section">
          <select
            className={adminSelectClassName}
            defaultValue={post.city}
            name="city"
            required
          >
            {POST_SECTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.city?.[0] ? (
            <span className="text-xs text-red-600">{errors.city[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Content" className="sm:col-span-2">
          <textarea
            className={adminTextareaClassName}
            defaultValue={post.content}
            name="content"
            required
            rows={5}
          />
          {errors.content?.[0] ? (
            <span className="text-xs text-red-600">{errors.content[0]}</span>
          ) : null}
        </AdminField>

        <AdminHomepageSectionCheckboxes selected={post.homepageSections} />

        <AdminField
          label="Featured image"
          hint={IMAGE_UPLOAD_HINT}
          className="sm:col-span-2"
        >
          <PostThumbImage
            src={post.imageUrl}
            alt={post.title}
            className="mb-3 h-28 w-44 rounded-lg"
          />
          <input
            className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700"
            type="file"
            name="image"
            accept={IMAGE_UPLOAD_ACCEPT}
          />
          {errors.image?.[0] ? (
            <span className="text-xs text-red-600">{errors.image[0]}</span>
          ) : null}
        </AdminField>

        <AdminField label="Status">
          <select
            className={adminSelectClassName}
            defaultValue={post.status}
            name="status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status?.[0] ? (
            <span className="text-xs text-red-600">{errors.status[0]}</span>
          ) : null}
        </AdminField>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
        {message ? <p className="text-sm text-red-700">{message}</p> : null}
      </div>
    </form>
  );
}
