"use client";

import { useState } from "react";
import {
  AdminField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";

export function AdminContactSettings() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminField label="Contact email">
          <input
            className={adminInputClassName}
            defaultValue="news@citychannel.com"
            name="email"
            type="email"
          />
        </AdminField>

        <AdminField label="Phone number">
          <input
            className={adminInputClassName}
            defaultValue="+91 98765 43210"
            name="phone"
          />
        </AdminField>

        <AdminField label="Office address" className="sm:col-span-2">
          <textarea
            className={adminTextareaClassName}
            defaultValue="City Channel Media, Kasaragod, Kerala, India"
            name="address"
            rows={3}
          />
        </AdminField>

        <AdminField label="Page intro (Malayalam)" className="sm:col-span-2">
          <textarea
            className={adminTextareaClassName}
            defaultValue="വാർത്താ നിർദ്ദേശങ്ങൾ, പരാതികൾ, അല്ലെങ്കിൽ പരസ്യങ്ങൾക്കായി ഞങ്ങളെ ബന്ധപ്പെടുക."
            name="intro"
            rows={3}
          />
        </AdminField>

        <AdminField label="Form submit action" className="sm:col-span-2">
          <input
            className={adminInputClassName}
            placeholder="e.g. /api/contact (not connected)"
            name="formAction"
          />
        </AdminField>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Save contact settings
        </button>
        {saved ? (
          <p className="text-sm text-green-700">Saved (UI only)</p>
        ) : null}
      </div>
    </form>
  );
}
