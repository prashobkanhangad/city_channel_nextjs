import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { SiteLogo } from "@/components/landing/SiteLogo";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Admin Login",
  description: "Sign in to the City Channel admin panel",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <SiteLogo width={170} height={52} />

          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-red-700"
          >
            Back to website
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-black text-white">
              <span className="text-2xl leading-none">◉</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">Admin Login</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Sign in to manage news and content
            </p>
          </div>

          <Suspense
            fallback={
              <p className="text-center text-sm text-zinc-500">Loading...</p>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
