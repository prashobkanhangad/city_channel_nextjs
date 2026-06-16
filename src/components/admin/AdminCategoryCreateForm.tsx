"use client";

import { useActionState } from "react";
import { createCategory, type CategoryActionState } from "@/actions/categories";
import {
  AdminField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";

const initialState: CategoryActionState = {
  success: false,
  message: "",
  errors: undefined,
};

export function AdminCategoryCreateForm() {
  const [state, formAction] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AdminField label="Category name (English)">
        <input
          className={adminInputClassName}
          name="title"
          placeholder="e.g. Kerala"
          required
        />
        {state.errors?.title?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.title[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="Category name (Malayalam)">
        <input
          className={adminInputClassName}
          name="titleMl"
          placeholder="e.g. കേരളം"
          required
        />
        {state.errors?.titleMl?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.titleMl[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="URL slug" hint="Lowercase only, e.g. kerala">
        <input
          className={adminInputClassName}
          name="slug"
          placeholder="e.g. kerala"
          required
        />
        {state.errors?.slug?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.slug[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="Nav label">
        <input
          className={adminInputClassName}
          name="navLabel"
          placeholder="e.g. KERALA"
          required
        />
        {state.errors?.navLabel?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.navLabel[0]}</span>
        ) : null}
      </AdminField>

      <AdminField label="Description" className="sm:col-span-2">
        <textarea
          className={adminTextareaClassName}
          name="description"
          placeholder="Category page description..."
          rows={3}
        />
        {state.errors?.description?.[0] ? (
          <span className="text-xs text-red-600">
            {state.errors.description[0]}
          </span>
        ) : null}
      </AdminField>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Add category
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
