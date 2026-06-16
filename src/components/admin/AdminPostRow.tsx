"use client";

import { useState } from "react";
import AdminDeletePostButton from "@/components/admin/AdminDeletePostButton";
import { AdminPostEditForm } from "@/components/admin/AdminPostEditForm";
import { PostThumbImage } from "@/components/landing/PostImage";
import type { Post } from "@/types";
import { formatViewCount } from "@/lib/utils/views";

type AdminPostRowProps = {
  post: Post;
};

export function AdminPostRow({ post }: AdminPostRowProps) {
  const [editing, setEditing] = useState(false);

  return (
    <article className="px-5 py-4">
      <div className="flex items-start gap-4">
        <PostThumbImage src={post.imageUrl} alt={post.title} className="h-20 w-28" />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-zinc-950">
                {post.title}
              </h4>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
                  post.status === "published"
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : "bg-amber-50 text-amber-800 ring-amber-200"
                }`}
              >
                {post.status === "published" ? "Published" : "Draft"}
              </span>
            </div>

            {!editing ? (
              <>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {post.content}
                </p>
                <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Author
                    </dt>
                    <dd className="font-medium text-zinc-700">{post.author}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      City / Section
                    </dt>
                    <dd className="font-medium text-zinc-700">{post.city}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Views
                    </dt>
                    <dd className="font-semibold text-zinc-900">
                      {formatViewCount(post.viewCount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Post ID
                    </dt>
                    <dd className="font-mono text-xs text-zinc-700">{post.id}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <AdminPostEditForm
                post={post}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              {formatViewCount(post.viewCount)} views
            </p>
            <p className="text-xs text-zinc-500">
              {new Date(post.createdAt).toLocaleString("en-IN")}
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="h-8 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Edit
                </button>
              ) : null}
              <a
                href={`/news/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Preview
              </a>
              <AdminDeletePostButton id={post.id} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
