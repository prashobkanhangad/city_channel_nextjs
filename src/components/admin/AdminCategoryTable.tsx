"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCategory,
  toggleCategoryActive,
} from "@/actions/categories";
import type { Category } from "@/types/category";

type AdminCategoryTableProps = {
  categories: Category[];
};

export function AdminCategoryTable({ categories }: AdminCategoryTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleCategoryActive(id, !isActive);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Delete category "${title}"?`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  if (categories.length === 0) {
    return (
      <p className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-500">
        No categories yet. Add your first category above.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-zinc-100">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nav</th>
            <th className="px-4 py-3 font-medium">English</th>
            <th className="px-4 py-3 font-medium">Malayalam</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {categories.map((category) => (
            <tr key={category.id} className={!category.isActive ? "opacity-60" : ""}>
              <td className="px-4 py-3 font-medium text-zinc-900">
                {category.navLabel}
              </td>
              <td className="px-4 py-3 text-zinc-700">{category.title}</td>
              <td className="px-4 py-3 text-zinc-700">{category.titleMl}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                /{category.slug}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    category.isActive
                      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                      : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200"
                  }`}
                >
                  {category.isActive ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(category.id, category.isActive)}
                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                  >
                    {category.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(category.id, category.title)}
                    className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
