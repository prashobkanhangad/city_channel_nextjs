"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/components/admin/adminNavItems";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {adminNavItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-red-50 text-red-700"
                : "text-zinc-700 hover:bg-zinc-50 hover:text-red-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
