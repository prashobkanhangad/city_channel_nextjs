import { requireAdmin } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "City Channel admin panel",
  path: "/admin",
  noIndex: true,
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
