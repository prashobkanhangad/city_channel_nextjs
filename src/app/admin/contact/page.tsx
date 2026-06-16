import { AdminCard } from "@/components/admin/AdminCard";
import { AdminContactSettings } from "@/components/admin/AdminContactSettings";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminUiNotice } from "@/components/admin/AdminUiNotice";

export const metadata = {
  title: "Contact | Admin | City Channel",
};

export default function AdminContactPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact"
        description="Edit contact details and intro text on the public contact page."
        badge="UI only"
      />

      <AdminUiNotice />

      <AdminCard
        title="Contact page settings"
        description="Email, phone, office address, and form configuration."
      >
        <AdminContactSettings />
      </AdminCard>
    </div>
  );
}
