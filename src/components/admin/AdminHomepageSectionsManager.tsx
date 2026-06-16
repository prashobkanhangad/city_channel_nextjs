"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removePostFromHomepageSection } from "@/actions/homepage";
import {
  HOMEPAGE_SECTIONS,
  type HomepageSection,
} from "@/lib/constants/homepageSections";
import type { Post } from "@/types";

type HomepageSectionConfig = (typeof HOMEPAGE_SECTIONS)[number];

type AdminHomepageSectionsManagerProps = {
  sectionPosts: Record<HomepageSection, Post[]>;
  sections?: readonly HomepageSectionConfig[];
};

export function AdminHomepageSectionsManager({
  sectionPosts,
  sections = HOMEPAGE_SECTIONS,
}: AdminHomepageSectionsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(postId: string, section: HomepageSection) {
    const confirmed = window.confirm("Remove this post from the section?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await removePostFromHomepageSection(postId, section);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {sections.map((section) => {
        const posts = sectionPosts[section.value];

        return (
          <section
            key={section.value}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-zinc-100 pb-3">
              <h3 className="text-base font-semibold text-zinc-900">
                {section.label}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{section.description}</p>
            </div>

            {posts.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No posts assigned. Use the checkboxes when creating or editing a
                post.
              </p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="rounded-lg border border-zinc-100 p-3"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-zinc-900">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {post.status === "published" ? "Published" : "Draft"} ·{" "}
                      {post.city}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`/news/${post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-zinc-700 hover:text-red-700"
                      >
                        Preview
                      </a>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleRemove(post.id, section.value)}
                        className="text-xs font-medium text-red-700 hover:underline disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
