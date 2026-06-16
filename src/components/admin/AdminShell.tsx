import Link from "next/link";
import { logout } from "@/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminNavItems } from "@/components/admin/adminNavItems";
import { SiteLogo } from "@/components/landing/SiteLogo";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 font-sans text-zinc-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white md:flex md:flex-col">
          <div className="border-b border-zinc-200 px-5 py-5">
            <SiteLogo href="/admin" width={150} height={46} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-600">
              Admin Panel
            </p>
          </div>

          <AdminNav />

          <div className="border-t border-zinc-200 p-3">
            <Link
              href="/"
              className="mb-2 block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              View website
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-red-700"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:px-6">
            <div>
              <p className="text-xs text-zinc-500">City Channel</p>
              <p className="text-sm font-semibold">Content Management</p>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <Link
                href="/admin/posts"
                className="text-sm font-medium text-zinc-700"
              >
                Posts
              </Link>
              <details className="relative">
                <summary className="cursor-pointer text-sm font-medium text-zinc-700">
                  Menu
                </summary>
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-red-700">
                  Logout
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
